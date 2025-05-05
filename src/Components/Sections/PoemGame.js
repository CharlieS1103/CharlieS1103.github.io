import "../../styles/PoemGame.scss";
import { useEffect, useState, useRef } from "react";
import React from "react";

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
      fetchPoemsFrom("https://www.reddit.com/r/OCPoetry/top.json?limit=50"),
      fetchPoemsFrom("https://www.reddit.com/r/OCPoetry/new.json?limit=50"),
      fetchPoemsFrom("https://www.reddit.com/r/OCPoetry/hot.json?limit=50")
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

function useAiPoems() {
  const [aiPoems, setAiPoems] = useState([]);

  useEffect(() => {
    fetch("https://charlies1103.github.io/ai-poems.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setAiPoems(data);
      });
  }, []);

  return aiPoems;
}

// Combine and shuffle poems for the game
function getShuffledPoemPair(humanPoems, aiPoems) {
  // Only return a pair if both arrays have at least one poem
  if (!Array.isArray(humanPoems) || !Array.isArray(aiPoems) || humanPoems.length === 0 || aiPoems.length === 0) {
    return [];
  }

  // Helper to get a random poem of similar length (line count)
  function getSimilarLengthPoem(targetPoem, candidates, usedIndexes = new Set()) {
    const targetLines = targetPoem.text.split('\n').filter(Boolean).length;
    // Filter out poems that are too short (e.g. < 6 lines)
    const filtered = candidates
      .map((poem, idx) => ({ poem, idx }))
      .filter(({ poem, idx }) =>
        poem.text.split('\n').filter(Boolean).length >= Math.max(6, targetLines - 2) &&
        poem.text.split('\n').filter(Boolean).length <= targetLines + 2 &&
        !usedIndexes.has(idx)
      );
    if (filtered.length === 0) {
      // fallback: pick any poem with at least 6 lines and not used
      const fallback = candidates
        .map((poem, idx) => ({ poem, idx }))
        .filter(({ poem, idx }) => poem.text.split('\n').filter(Boolean).length >= 6 && !usedIndexes.has(idx));
      if (fallback.length === 0) return null;
      const pick = fallback[Math.floor(Math.random() * fallback.length)];
      usedIndexes.add(pick.idx);
      return pick.poem;
    }
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    usedIndexes.add(pick.idx);
    return pick.poem;
  }

  // Track used indexes to avoid repeats in a session
  if (!getShuffledPoemPair.usedHuman) getShuffledPoemPair.usedHuman = new Set();
  if (!getShuffledPoemPair.usedAI) getShuffledPoemPair.usedAI = new Set();

  // Pick a random human poem (prefer longer ones)
  const humanCandidates = humanPoems
    .map((poem, idx) => ({ poem, idx }))
    .filter(({ poem, idx }) => poem.text.split('\n').filter(Boolean).length >= 6 && !getShuffledPoemPair.usedHuman.has(idx));
  let humanPick;
  if (humanCandidates.length > 0) {
    const pick = humanCandidates[Math.floor(Math.random() * humanCandidates.length)];
    humanPick = pick.poem;
    getShuffledPoemPair.usedHuman.add(pick.idx);
  } else {
    // fallback: allow repeats if all have been used
    getShuffledPoemPair.usedHuman.clear();
    const pick = humanPoems[Math.floor(Math.random() * humanPoems.length)];
    humanPick = pick;
  }

  // Pick an AI poem of similar length (avoid repeats)
  const aiPick = getSimilarLengthPoem(humanPick, aiPoems, getShuffledPoemPair.usedAI) || aiPoems[Math.floor(Math.random() * aiPoems.length)];

  // Mark as used
  const aiIdx = aiPoems.indexOf(aiPick);
  if (aiIdx !== -1) getShuffledPoemPair.usedAI.add(aiIdx);

  // Randomize order
  const pair = Math.random() > 0.5 ? [humanPick, aiPick] : [aiPick, humanPick];
  return pair;
}

function PoemGame() {
  const humanPoems = useRedditPoems();
  const aiPoems = useAiPoems();
  const [poemPair, setPoemPair] = useState(() => getShuffledPoemPair(humanPoems, aiPoems));
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  // Scroll to top when next round or new poems loaded
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    setPoemPair(getShuffledPoemPair(humanPoems, aiPoems));
    setSelected(null);
    setResult(null);
    scrollToTop();
    // eslint-disable-next-line
  }, [humanPoems, aiPoems]);

  function nextRound() {
    setPoemPair(getShuffledPoemPair(humanPoems, aiPoems));
    setSelected(null);
    setResult(null);
    scrollToTop();
  }

  function handleGuess(index) {
    setSelected(index);
    if (poemPair[index].author !== "AI") {
      setResult("Correct! You found the human poem.");
    } else {
      setResult("Wrong! That was the AI poem.");
    }
  }

  return (
    <div className="projects-container" style={{ minHeight: "60vh", position: "relative" }}>
      <div className="project">
        <h2>Poem vs AI Generated Poem</h2>
        <p>Can you guess which poem is written by a human?</p>
        <div className="poem-game">
          {poemPair.length === 2 ? (
            poemPair.map((poem, idx) => (
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
            ))
          ) : (
            <div style={{ margin: "2em", color: "#fff" }}>
              Loading poems...
            </div>
          )}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default PoemGame;