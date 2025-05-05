import "../../styles/About.scss";
import { useEffect, useState } from "react";
import React from "react";

function cleanPoemText(text) {
  // Remove "Feedback links" and everything after, including URLs and "Comments:"
  let cleaned = text.trim();
  const lower = cleaned.toLowerCase();
  const feedbackIdx = lower.indexOf("feedback links");
  const commentsIdx = lower.indexOf("comments:");
  let cutIdx = -1;
  if (feedbackIdx !== -1 && commentsIdx !== -1) {
    cutIdx = Math.min(feedbackIdx, commentsIdx);
  } else if (feedbackIdx !== -1) {
    cutIdx = feedbackIdx;
  } else if (commentsIdx !== -1) {
    cutIdx = commentsIdx;
  }
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
  return cleaned;
}

function useRedditPoems() {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    fetch("https://www.reddit.com/r/OCPoetry/top.json?limit=50")
      .then(res => res.json())
      .then(data => {
        if (!data || !data.data || !Array.isArray(data.data.children)) return;
        const posts = data.data.children;
        const poems = posts
          .filter(post => post.data && post.data.selftext && post.data.selftext.length > 40)
          .map(post => ({
            title: post.data.title || "Untitled",
            author: post.data.author || "Reddit User",
            text: cleanPoemText(post.data.selftext)
          }))
          .filter(poem => poem.text.split("\n").length >= 3 && poem.text.length > 40); // basic filter for poem-like
        if (poems.length > 0) setPoems(poems);
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
  // Defensive: Only return a pair if both arrays have at least one poem
  if (!Array.isArray(humanPoems) || !Array.isArray(aiPoems) || humanPoems.length === 0 || aiPoems.length === 0) {
    return [];
  }
  const human = humanPoems[Math.floor(Math.random() * humanPoems.length)];
  const ai = aiPoems[Math.floor(Math.random() * aiPoems.length)];
  // Randomize order
  const pair = Math.random() > 0.5 ? [human, ai] : [ai, human];
  return pair;
}

function PoemGame() {
  const humanPoems = useRedditPoems();
  const aiPoems = useAiPoems();
  const [poemPair, setPoemPair] = useState(() => getShuffledPoemPair(humanPoems, aiPoems));
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  // Update poem pair when humanPoems or aiPoems changes (after fetch)
  useEffect(() => {
    setPoemPair(getShuffledPoemPair(humanPoems, aiPoems));
    setSelected(null);
    setResult(null);
    // eslint-disable-next-line
  }, [humanPoems, aiPoems]);

  // Reset game on next round
  function nextRound() {
    setPoemPair(getShuffledPoemPair(humanPoems, aiPoems));
    setSelected(null);
    setResult(null);
  }

  // Handle user guess
  function handleGuess(index) {
    setSelected(index);
    if (poemPair[index].author !== "AI") {
      setResult("Correct! You found the human poem.");
    } else {
      setResult("Wrong! That was the AI poem.");
    }
  }

  return (
    <div className="projects-container" style={{ minHeight: "60vh" }}>
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
          <div style={{ marginTop: "1em", fontWeight: "bold" }}>
            {result}
            <br />
            <button onClick={nextRound} style={{ marginTop: "0.5em" }}>
              Next Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PoemGame;