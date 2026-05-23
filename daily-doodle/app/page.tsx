"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAppContext } from "./context/AppContext";

const ALL_TASKS = [
  "Commit code to your Macondo repository",
  "Score 15 points in the Clicker game",
  "Draw a rocket ship in the Sketchpad",
  "Follow 2 new users in the network",
  "Like 3 creations in the Discover feed",
  "Clone a jacket from another user",
  "Score 25 points in the Clicker game",
  "Sketch an extraterrestrial alien creature",
  "Publish a creation to the Feed",
  "Customize your avatar to wear a crown",
  "Complete all daily objectives before noon",
  "Play a match of Memory game under 15 moves",
  "Design a logo for a virtual hacking club",
  "Draw a neo-brutalist cat using green",
  "Reach 30 points in the reaction game",
  "Style your avatar in sports attire",
  "Sketch a floating island on the canvas",
  "Try drawing with thin brush only",
  "Create a cyberpunk avatar style look",
  "Reach 40 points in the clicker game",
  "Draw a retro floppy disk in pink",
  "Choose clothes and hair that mismatch",
  "Read one page of scrapbooks",
  "Sketch a high-contrast shadow drawing",
  "Score exactly 7 points in clicker game",
  "Play a session without missing a click",
  "Draw a tree with purple leaves",
  "Design a futuristic computer interface",
  "Set your high score above 20",
  "Refactor a component in under 5 minutes",
  "Doodle a delicious double-glazed donut",
  "Change your username to something wacky",
  "Unlock 2 badges in your profile stats",
  "Connect your Discord handle in Network",
  "Follow the master account \"doodle_king\"",
  "Draw a slice of cheese on a blue canvas",
  "Clear the sketchpad three times",
  "Play memory match game twice",
  "Style your clothes as a karate master",
  "Have more than 50 fake followers",
  "Reach 10 clicks in the Clicker game",
  "Like 5 user creations in Discover",
  "Style your avatar bald with glasses",
  "Clone a crown look from Discover feed",
  "Link your GitHub repository in settings",
  "Share a sketch prompt with a teammate",
  "Reach 35 points in reaction clicker",
  "Finish Memory game in exactly 12 moves",
  "Draw a cup of coffee with steam rising",
  "Score more than 5 points using a tiny target"
];

const DOODLE_PROMPTS = [
  "A robotic pineapple wearing sunglasses",
  "A cozy space cottage on a floating pizza slice",
  "A cat wearing a massive developer headset coding in HSL colors",
  "A cybernetic skateboarding avocado riding a rainbow",
  "A futuristic vintage arcade machine overgrown with neon vines",
  "A retro floppy disk floating in a cup of steaming matcha tea",
  "A friendly dinosaur attempting to compile React code on a stone laptop",
  "A cloud shaped like a cup of coffee dropping tiny lightning bolts",
  "A high-contrast neon portal inside a pocket watch",
  "A wise wizard snail carrying a library on its shell",
  "A cup of bubble tea flying through a nebula with tiny wings",
  "A neon-brutalist computer monitor that has feelings",
  "A rubber ducky wearing a crown sailing a paper boat on lava",
  "A sleepy mushroom reading a technical documentation booklet",
  "A slice of toast wearing glasses and doing math",
  "A tiny jellyfish floating in a light bulb under the stars"
];

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function Home() {
  const {
    user,
    tasks,
    setTasks,
    toggleTask,
    addGamePlayed,
    showIntro,
    setShowIntro
  } = useAppContext();

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 100, y: 100 });
  const [targetSize, setTargetSize] = useState(60);
  const [showOodle, setShowOodle] = useState(false);
  const [targetClicks, setTargetClicks] = useState(0);
  const [dateStr, setDateStr] = useState("");

  const [activeTab, setActiveTab] = useState("clicker");
  const [brushColor, setBrushColor] = useState("#1a1a1a");
  const [brushSize, setBrushSize] = useState(8);

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const [currentPrompt, setCurrentPrompt] = useState(DOODLE_PROMPTS[0]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const todayStr = new Date().toDateString();
    setDateStr(todayStr);
    const savedDate = localStorage.getItem("daily_doodle_date");
    const savedTasks = localStorage.getItem("daily_doodle_tasks");

    if (savedDate === todayStr && savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const shuffled = [...ALL_TASKS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map(text => ({ text, completed: false }));
      localStorage.setItem("daily_doodle_date", todayStr);
      localStorage.setItem("daily_doodle_tasks", JSON.stringify(selected));
      setTasks(selected);
    }

    const savedPrompt = localStorage.getItem("daily_doodle_prompt");
    if (savedPrompt) {
      setCurrentPrompt(savedPrompt);
    } else {
      const randomPrompt = DOODLE_PROMPTS[Math.floor(Math.random() * DOODLE_PROMPTS.length)];
      setCurrentPrompt(randomPrompt);
      localStorage.setItem("daily_doodle_prompt", randomPrompt);
    }
  }, [setTasks]);

  useEffect(() => {
    if (activeTab === "sketchpad" && sketchCanvasRef.current) {
      const canvas = sketchCanvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = 300;
    } else if (activeTab === "memory") {
      initMemoryGame();
    }
  }, [activeTab]);

  const moveTarget = () => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.clientWidth;
    const h = canvasRef.current.clientHeight;
    const s = scoreRef.current;
    const size = Math.max(24, 60 - s * 3);
    const maxX = w - size;
    const maxY = h - size;
    const rx = Math.max(0, Math.floor(Math.random() * maxX));
    const ry = Math.max(0, Math.floor(Math.random() * maxY));
    setTargetPos({ x: rx, y: ry });
    setTargetSize(size);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setShowOodle(false);
          addGamePlayed(scoreRef.current, scoreRef.current);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, addGamePlayed]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      moveTarget();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, targetClicks]);

  useEffect(() => {
    if (showOodle) {
      moveTarget();
    }
  }, [showOodle]);

  const startGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(30);
    setIsPlaying(true);
    setShowOodle(true);
  };

  const handleTargetClick = () => {
    const nextScore = score + 1;
    setScore(nextScore);
    scoreRef.current = nextScore;
    moveTarget();
    setTargetClicks(prev => prev + 1);
  };

  const getCoordinates = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    const canvas = sketchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const coords = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    isDrawingRef.current = true;
  };

  const draw = (e: any) => {
    if (!isDrawingRef.current) return;
    const canvas = sketchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const coords = getCoordinates(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = sketchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const initMemoryGame = () => {
    const emojis = ["👾", "🦄", "🚀", "🍩", "🥑", "🎨"];
    const doubled = [...emojis, ...emojis];
    const shuffled = doubled
      .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }))
      .sort(() => 0.5 - Math.random());
    setMemoryCards(shuffled);
    setSelectedIndices([]);
    setMoves(0);
    setMemoryWon(false);
  };

  const handleCardClick = (idx: number) => {
    if (memoryCards[idx].isFlipped || memoryCards[idx].isMatched || selectedIndices.length >= 2) {
      return;
    }

    const updated = [...memoryCards];
    updated[idx].isFlipped = true;
    setMemoryCards(updated);

    if (selectedIndices.length === 0) {
      setSelectedIndices([idx]);
    } else {
      const firstIdx = selectedIndices[0];
      setSelectedIndices([firstIdx, idx]);
      setMoves(prev => prev + 1);

      if (updated[firstIdx].emoji === updated[idx].emoji) {
        updated[firstIdx].isMatched = true;
        updated[idx].isMatched = true;
        setMemoryCards(updated);
        setSelectedIndices([]);

        const allMatched = updated.every(card => card.isMatched);
        if (allMatched) {
          setMemoryWon(true);
        }
      } else {
        setTimeout(() => {
          const reverted = [...updated];
          reverted[firstIdx].isFlipped = false;
          reverted[idx].isFlipped = false;
          setMemoryCards(reverted);
          setSelectedIndices([]);
        }, 800);
      }
    }
  };

  const rollPrompt = () => {
    const randomPrompt = DOODLE_PROMPTS[Math.floor(Math.random() * DOODLE_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
    localStorage.setItem("daily_doodle_prompt", randomPrompt);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (showIntro) {
    return (
      <div className="intro-overlay">
        <div className="intro-emoji-bg-left">
          🤖 👾 🚀 🥑 🎨 🦄 🎯 🍩 👑 🎀 🧢 👕 🤠 🧐 😎
        </div>
        <div className="intro-emoji-bg-right">
          😎 🧐 🤠 👕 🧢 🎀 👑 🍩 🎯 🦄 🎨 🥑 🚀 👾 🤖
        </div>
        <div className="intro-card animate-float">
          <h1>Daily Doodle</h1>
          <p style={{ fontWeight: "bold", textTransform: "uppercase", color: "#666" }}>
            Macondo Hack Club Arcade
          </p>
          <div className="intro-logo-emoji">🎯</div>
          <p style={{ margin: "10px 0 30px 0", fontSize: "1.1rem" }}>
            Unleash your styling flair, log daily hacking quests, and challenge dynamic reaction scores!
          </p>
          <button className="animate-wobble" onClick={() => setShowIntro(false)}>
            Enter Arcade Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="animate-float">
        <h1>Daily Doodle</h1>
        <p>Macondo Edition: Tasks, Style & Games</p>
      </header>

      <nav className="doodle-nav">
        <Link href="/" className="doodle-nav-link active">Home</Link>
        <Link href="/profile" className="doodle-nav-link">Profile</Link>
        <Link href="/discover" className="doodle-nav-link">Discover</Link>
        <Link href="/network" className="doodle-nav-link">Network</Link>
      </nav>

      <main className="app-container">
        <section className="card tasks-section">
          <h2>Today's Quests</h2>
          <div className="task-date-label">{dateStr}</div>
          <ul>
            {tasks.map((task, i) => (
              <li key={`task-${i}`}>
                <input
                  type="checkbox"
                  id={`t-${i}`}
                  checked={task.completed}
                  onChange={() => toggleTask(i)}
                />{" "}
                <label htmlFor={`t-${i}`} className={task.completed ? "task-completed" : ""}>
                  {task.text}
                </label>
              </li>
            ))}
          </ul>
          <div className="doodle-progress-bar">
            <div className="doodle-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p style={{ fontWeight: "bold", marginTop: "12px", textAlign: "center" }}>
            {completedCount} of {totalCount} Quests Done!
          </p>
        </section>

        <section className="card customizer-section">
          <h2>Doodle Suggestion</h2>
          <p>Get a hand-crafted creative inspiration to spark your daily drawing!</p>
          <div className="idea-box animate-pulse">
            {currentPrompt}
          </div>
          <div className="controls" style={{ marginTop: "20px" }}>
            <button className="animate-wobble" onClick={rollPrompt}>Get New Idea</button>
          </div>
        </section>

        <section className="card game-section">
          <h2>Macondo Game Room</h2>
          
          <div className="game-tabs">
            <button
              className={`game-tab-btn animate-wobble ${activeTab === "clicker" ? "active" : ""}`}
              onClick={() => setActiveTab("clicker")}
            >
              🎯 Clicker
            </button>
            <button
              className={`game-tab-btn animate-wobble ${activeTab === "sketchpad" ? "active" : ""}`}
              onClick={() => setActiveTab("sketchpad")}
            >
              🎨 Sketchpad
            </button>
            <button
              className={`game-tab-btn animate-wobble ${activeTab === "memory" ? "active" : ""}`}
              onClick={() => setActiveTab("memory")}
            >
              🃏 Memory Card
            </button>
          </div>

          {activeTab === "clicker" && (
            <div>
              <div className="game-stats">
                <p>Score: <span>{score}</span></p>
                <p>Time Left: <span>{timeLeft}</span>s</p>
                <p>High Score: <span>{user.stats.highScore}</span></p>
              </div>
              <div id="game-canvas" ref={canvasRef}>
                {!isPlaying && (
                  <button id="start-game-btn" className="animate-wobble" onClick={startGame}>
                    {score > 0 ? "Play Again" : "Start Game"}
                  </button>
                )}
                {showOodle && (
                  <div
                    id="target-oodle"
                    onClick={handleTargetClick}
                    style={{
                      left: `${targetPos.x}px`,
                      top: `${targetPos.y}px`,
                      width: `${targetSize}px`,
                      height: `${targetSize}px`,
                      fontSize: `${targetSize * 0.7}px`,
                      lineHeight: `${targetSize}px`
                    }}
                  >
                    🎯
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "sketchpad" && (
            <div className="sketchpad-container">
              <div className="sketchpad-controls">
                <div className="color-palette">
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Color:</span>
                  {["#1a1a1a", "#58d68d", "#5dade2", "#ff69b4", "#ffd700"].map(color => (
                    <div
                      key={color}
                      className={`color-swatch ${brushColor === color ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBrushColor(color)}
                    />
                  ))}
                </div>
                <div className="brush-sizes">
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Size:</span>
                  {[3, 8, 15].map(size => (
                    <button
                      key={size}
                      className={`brush-size-btn ${brushSize === size ? "active" : ""}`}
                      onClick={() => setBrushSize(size)}
                    >
                      {size === 3 ? "Thin" : size === 8 ? "Med" : "Thick"}
                    </button>
                  ))}
                </div>
                <button
                  className="animate-wobble"
                  style={{ width: "auto", padding: "6px 12px", background: "#f5b7b1", fontSize: "0.85rem" }}
                  onClick={clearCanvas}
                >
                  Clear
                </button>
              </div>
              <canvas
                id="doodle-canvas"
                ref={sketchCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          )}

          {activeTab === "memory" && (
            <div>
              <div className="game-stats">
                <p>Moves: <span>{moves}</span></p>
                <p style={{ color: memoryWon ? "#27ae60" : "inherit" }}>
                  <span>{memoryWon ? "Completed!" : "Find all pairs!"}</span>
                </p>
                <button
                  className="animate-wobble"
                  style={{ width: "auto", padding: "4px 10px", fontSize: "0.85rem", background: "#f0f0f0" }}
                  onClick={initMemoryGame}
                >
                  Restart
                </button>
              </div>
              <div className="memory-grid">
                {memoryCards.map((card, i) => (
                  <div
                    key={`card-${i}`}
                    className={`memory-card ${card.isFlipped ? "flipped" : ""} ${card.isMatched ? "matched" : ""}`}
                    onClick={() => handleCardClick(i)}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : "❓"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
