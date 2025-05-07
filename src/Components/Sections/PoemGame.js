import "../../styles/PoemGame.scss";
import { useEffect, useState } from "react";
import React from "react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (use anon key, no custom JWT)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function cleanPoemText(text) {
  // Remove "Feedback links", "Feedback:", and everything after, including URLs, "Comments:", and critique notes
  let cleaned = text.trim();
  const lower = cleaned.toLowerCase();
  const feedbackLinksIdx = lower.indexOf("feedback links");
  const feedbackIdx = lower.indexOf("feedback:");
  const commentsIdx = lower.indexOf("comments:");
  const critiqueIdx = lower.indexOf("note, do not be afraid to critique");
  let cutIdx = -1;
  // Find the earliest of the markers
  [feedbackLinksIdx, feedbackIdx, commentsIdx, critiqueIdx]
    .filter(idx => idx !== -1)
    .forEach(idx => {
      if (cutIdx === -1 || idx < cutIdx) cutIdx = idx;
    });
  if (cutIdx !== -1) cleaned = cleaned.slice(0, cutIdx).trim();

  // Remove lines that are just URLs or contain reddit.com links
  cleaned = cleaned
    .split('\n')
    .filter(line =>
      !/^https?:\/\//i.test(line.trim()) &&
      !/reddit\.com/i.test(line.trim()) &&
      line.trim() !== ""
    )
    .join('\n')
    .trim();

  // Remove any trailing "[]()" style markdown links
  cleaned = cleaned.replace(/\[.*?\]\(.*?\)$/gm, '').trim();

  // Remove markdown formatting: headings, bold, italics, blockquotes, etc.
  cleaned = cleaned
    .replace(/^#+\s*/gm, '') // Remove markdown headings
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // Remove bold/italic
    .replace(/^\s*>+\s?/gm, '') // Remove blockquotes
    .replace(/\*\*/g, '') // Remove any remaining **
    .replace(/__+/g, '') // Remove any remaining __
    .replace(/^\s*[-*]\s+/gm, '') // Remove unordered list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove ordered list markers
    .replace(/&nbsp;/gi, ' ') // Remove HTML non-breaking spaces
    .replace(/ {2,}/g, ' ') // Collapse multiple spaces into one
    .replace(/\\$/gm, '') // Remove trailing backslashes used for line breaks
    .replace(/&[a-zA-Z]+;/g, '') // Remove any remaining HTML entities like &a, &nbs;
    .replace(/^\s+|\s+$/gm, '') // Trim leading/trailing spaces per line
    // Remove lines above or below a line with 3 or more repeated chars (e.g. ---)
    .replace(/(^|\n)[^\n]*\n[-_*~]{3,}\n[^\n]*(\n|$)/g, '\n')
    .replace(/(^|\n)[-_*~]{3,}\n[^\n]*(\n|$)/g, '\n')
    .replace(/(^|\n)[^\n]*\n[-_*~]{3,}(\n|$)/g, '\n')
    .trim();

  return cleaned;
}

function useRedditPoems() {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    // Helper to fetch from a given endpoint and return poems
    const fetchPoemsFrom = async (endpoint) => {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!data || !data.data || !Array.isArray(data.data.children)) return [];
      return data.data.children
        .filter(post => post.data && post.data.selftext && post.data.selftext.length > 40)
        .map(post => ({
          title: post.data.title || "Untitled",
          author: post.data.author || "Reddit User",
          text: cleanPoemText(post.data.selftext)
        }))
        .filter(poem => poem.text.split("\n").length >= 3 && poem.text.length > 40);
    };

    // Try to get poems from top, new, and hot, then shuffle and deduplicate
    Promise.all([

      fetchPoemsFrom("https://www.reddit.com/r/OCPoetry/new.json?limit=100"),
      fetchPoemsFrom("https://www.reddit.com/r/OCPoetry/hot.json?limit=100")
    ])
      .then(results => {
        // Flatten, deduplicate by text, and shuffle
        const all = results.flat();
        const seen = new Set();
        const deduped = all.filter(poem => {
          if (seen.has(poem.text)) return false;
          seen.add(poem.text);
          return true;
        });
        // Shuffle
        for (let i = deduped.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deduped[i], deduped[j]] = [deduped[j], deduped[i]];
        }
        setPoems(deduped);
      })
      .catch(() => {
        // no fallback
      });
  }, []);

  return poems;
}

// Fetch a random AI poem from Supabase and pair it with a random human poem
async function getShuffledPoemPair(humanPoems) {
  if (!Array.isArray(humanPoems) || humanPoems.length === 0) return [];
  // pick a human poem with at least 6 non-empty lines
  const candidates = humanPoems.filter(poem => poem.text.split('\n').filter(Boolean).length >= 6);
  const humanPick = candidates[Math.floor(Math.random() * candidates.length)];
  // fetch AI poems from Supabase
  const { data: aiPoems = [], error } = await supabase
    .from("ai_poems")
    .select("id, text, mimiced_author, created_at");
  if (error || aiPoems.length === 0) {
    console.error("Error fetching AI poems:", error);
    return [humanPick];
  }
  // pick and tag a random AI poem
  const aiPick = aiPoems[Math.floor(Math.random() * aiPoems.length)];
  const aiObj = {
    title: "Mimic Poem",
    author: "AI (Mimic)",
    text: aiPick.text,
    mimiced_author: aiPick.mimiced_author
  };
  const pair = [aiObj, humanPick];
  return Math.random() > 0.5 ? pair.reverse() : pair;
}

function PoemGame() {
  const humanPoems = useRedditPoems();
  // ...existing state declarations...
  const [poemPair, setPoemPair] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  // NEW: score state
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Helper function to scroll to the top of the page
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    async function loadPair() {
      if (humanPoems.length > 0) {
        const pair = await getShuffledPoemPair(humanPoems);
        setPoemPair(pair);
        setSelected(null);
        setResult(null);
        scrollToTop();
      }
    }
    loadPair();
    // eslint-disable-next-line
  }, [humanPoems]);

  function nextRound() {
    async function loadNext() {
      const pair = await getShuffledPoemPair(humanPoems);
      setPoemPair(pair);
      setSelected(null);
      setResult(null);
      scrollToTop();
    }
    loadNext();
  }

  function handleGuess(index) {
    setSelected(index);
    const isCorrect = poemPair[index].author !== "AI (Mimic)";
    if (isCorrect) {
      setResult("Correct! You found the human poem.");
      setCorrectCount(c => c + 1);      // increment correct
    } else {
      setResult("Wrong! That was the AI (mimic) poem.");
      setWrongCount(w => w + 1);        // increment wrong
    }
  }

  if (humanPoems.length === 0 || poemPair.length !== 2) {
    return (
      <div className="projects-container" style={{ minHeight: "60vh", position: "relative", color: "#fff" }}>
        <div className="project">
          <p>Loading poems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container" style={{ minHeight: "60vh", position: "relative" }}>
      <div className="project">
        <h2>Poem vs AI Generated Poem</h2>
        {/* NEW: Score display */}
        <div className="score-tracker" style={{ marginBottom: "1em", color: "#fff" }}>
          Score: {correctCount} correct, {wrongCount} wrong
        </div>
        <p>Can you guess which poem is written by a human?</p>
        <div className="poem-game">
          {poemPair.map((poem, idx) => (
            <div
              key={idx}
              className={`poem-option${selected === idx ? " selected" : ""}`}
              style={{
                border: "2px solid #fff",
                borderRadius: "10px",
                margin: "1em",
                padding: "1em",
                background: selected === idx ? "#3ea8ef33" : "rgba(0,0,0,0.4)",
                cursor: selected === null ? "pointer" : "default",
                opacity: selected !== null && selected !== idx ? 0.6 : 1
              }}
              onClick={() => selected === null && handleGuess(idx)}
            >
              <h3>Poem {idx + 1}</h3>
              <pre style={{ whiteSpace: "pre-wrap", textAlign: "left", fontFamily: "Merriweather, serif" }}>
                {poem?.text || ""}
              </pre>
            </div>
          ))}
        </div>
        {result && (
          <div style={{
            marginTop: "1em",
            fontWeight: "bold",
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: "rgba(30, 144, 255, 0.97)",
            color: "#fff",
            textAlign: "center",
            padding: "1em 0"
          }}>
            {result}
            <br />
            <button
              onClick={nextRound}
              className="poemgame-next-btn"
              style={{
                marginTop: "0.5em",
                position: "relative",
                zIndex: 1001
              }}
            >
              Next Round
            </button>
            {/* Author attribution */}
            {poemPair.map((poem, idx) => (
              <div key={idx} style={{ marginTop: "0.5em", color: "#fff" }}>
                Poem {idx + 1} by {poem.author}
                {poem.author === "AI (Mimic)" && poem.mimiced_author && (
                  <span>
                    {" "}(<a
                      href={`https://www.reddit.com/user/${poem.mimiced_author}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#fff", textDecoration: "underline" }}
                    >
                      original by {poem.mimiced_author}
                    </a>)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PoemGame;