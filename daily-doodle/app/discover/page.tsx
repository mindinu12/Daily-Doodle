"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext, DoodleCreation } from "../context/AppContext";

export default function DiscoverPage() {
  const { creations, likedCreations, toggleLikeCreation, cloneOutfit } = useAppContext();
  const [cloneMessage, setCloneMessage] = useState("");

  const handleClone = (creation: DoodleCreation) => {
    cloneOutfit(creation.avatar);
    setCloneMessage(`Outfit from @${creation.username} cloned successfully! Check your profile!`);
    setTimeout(() => setCloneMessage(""), 4000);
  };

  return (
    <>
      <header className="animate-float">
        <h1>Discover Stream</h1>
        <p>Explore community styling creations, like matches and clone custom looks</p>
      </header>

      <nav className="doodle-nav">
        <Link href="/" className="doodle-nav-link">Home</Link>
        <Link href="/profile" className="doodle-nav-link">Profile</Link>
        <Link href="/discover" className="doodle-nav-link active">Discover</Link>
        <Link href="/network" className="doodle-nav-link">Network</Link>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
        {cloneMessage && (
          <div
            style={{
              background: "#d4efdf",
              border: "3px solid #1a1a1a",
              boxShadow: "4px 4px 0px #1a1a1a",
              padding: "15px",
              fontWeight: "bold",
              color: "#196f3d",
              marginBottom: "25px",
              textAlign: "center"
            }}
          >
            {cloneMessage}
          </div>
        )}

        <div className="discover-grid">
          {creations.map((item) => {
            const isLiked = likedCreations.includes(item.id);
            return (
              <div key={item.id} className="creation-card">
                <div className="creation-avatar-wrap">
                  <div className="avatar-preview" style={{ fontSize: "3.5rem" }}>
                    {item.avatar.hair !== "❌" && (
                      <div className="avatar-hair" style={{ fontSize: "1.8rem", top: "10px" }}>
                        {item.avatar.hair}
                      </div>
                    )}
                    <div className="avatar-face" style={{ fontSize: "3.5rem" }}>
                      {item.avatar.face}
                    </div>
                    {item.avatar.clothes !== "❌" && (
                      <div className="avatar-clothes" style={{ fontSize: "1.8rem", bottom: "15px" }}>
                        {item.avatar.clothes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="creation-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>@{item.username}</span>
                    <span className="task-date-label" style={{ margin: 0 }}>{item.timestamp}</span>
                  </div>
                  <div className="creation-meta">
                    <span>High Score: {item.highScore}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      className="animate-wobble"
                      style={{
                        padding: "8px 12px",
                        fontSize: "0.85rem",
                        background: isLiked ? "#ff69b4" : "#ffffff",
                        borderColor: "#1a1a1a"
                      }}
                      onClick={() => toggleLikeCreation(item.id)}
                    >
                      {isLiked ? "❤️ Liked" : "🤍 Like"} ({item.likes})
                    </button>
                    <button
                      className="animate-wobble"
                      style={{
                        padding: "8px 12px",
                        fontSize: "0.85rem",
                        background: "#ffd700",
                        borderColor: "#1a1a1a"
                      }}
                      onClick={() => handleClone(item)}
                    >
                      ⚡ Clone
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
