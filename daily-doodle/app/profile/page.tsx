"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext, UserAvatar } from "../context/AppContext";

const HAIR_OPTIONS = ["🎩", "👑", "🧢", "🎀", "👒", "🪶", "🎧", "🦄", "🦱", "❌"];
const FACE_OPTIONS = ["😀", "😎", "🧐", "🤠", "👽", "🤖", "🐱", "🦊", "🦁", "🐸"];
const CLOTHES_OPTIONS = ["👕", "👔", "👗", "🥋", "🧥", "🧣", "🎽", "👚", "🥻", "❌"];

export default function ProfilePage() {
  const { user, setUser, creations, setCreations, likedCreations, followingUsers } = useAppContext();
  const [publishMessage, setPublishMessage] = useState("");

  const updateAvatar = (field: keyof UserAvatar, value: string) => {
    const nextAvatar = { ...user.avatar, [field]: value };
    const nextUser = { ...user, avatar: nextAvatar };
    setUser(nextUser);
    localStorage.setItem("doodle_user", JSON.stringify(nextUser));
  };

  const rollNewLook = () => {
    const randomHair = HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)];
    const randomFace = FACE_OPTIONS[Math.floor(Math.random() * FACE_OPTIONS.length)];
    const randomClothes = CLOTHES_OPTIONS[Math.floor(Math.random() * CLOTHES_OPTIONS.length)];
    const nextAvatar = { hair: randomHair, face: randomFace, clothes: randomClothes };
    const nextUser = { ...user, avatar: nextAvatar };
    setUser(nextUser);
    localStorage.setItem("doodle_user", JSON.stringify(nextUser));
  };

  const publishToFeed = () => {
    const newId = creations.length > 0 ? Math.max(...creations.map(c => c.id)) + 1 : 1;
    const newCreation = {
      id: newId,
      username: user.username,
      avatar: { ...user.avatar },
      likes: 0,
      highScore: user.stats.highScore,
      timestamp: "Just now"
    };

    const nextCreations = [newCreation, ...creations];
    setCreations(nextCreations);
    localStorage.setItem("doodle_creations", JSON.stringify(nextCreations));

    setPublishMessage("Outfit published successfully!");
    setTimeout(() => setPublishMessage(""), 3000);
  };

  return (
    <>
      <header className="animate-float">
        <h1>Hacker Profile</h1>
        <p>Manage your style, badges and platform metrics</p>
      </header>

      <nav className="doodle-nav">
        <Link href="/" className="doodle-nav-link">Home</Link>
        <Link href="/profile" className="doodle-nav-link active">Profile</Link>
        <Link href="/discover" className="doodle-nav-link">Discover</Link>
        <Link href="/network" className="doodle-nav-link">Network</Link>
      </nav>

      <main className="app-container">
        <section className="card customizer-section">
          <h2>Avatar Customizer</h2>
          <div className="avatar-frame">
            <div className="avatar-preview">
              {user.avatar.hair !== "❌" && <div className="avatar-hair">{user.avatar.hair}</div>}
              <div className="avatar-face">{user.avatar.face}</div>
              {user.avatar.clothes !== "❌" && <div className="avatar-clothes">{user.avatar.clothes}</div>}
            </div>
          </div>
          <div className="avatar-customizer">
            <div className="avatar-customizer-row">
              {HAIR_OPTIONS.map((h, i) => (
                <button
                  key={`hair-${i}`}
                  className={`avatar-customizer-btn animate-wobble ${user.avatar.hair === h ? "selected" : ""}`}
                  onClick={() => updateAvatar("hair", h)}
                >
                  {h}
                </button>
              ))}
            </div>
            <div className="avatar-customizer-row">
              {FACE_OPTIONS.map((f, i) => (
                <button
                  key={`face-${i}`}
                  className={`avatar-customizer-btn animate-wobble ${user.avatar.face === f ? "selected" : ""}`}
                  onClick={() => updateAvatar("face", f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="avatar-customizer-row">
              {CLOTHES_OPTIONS.map((c, i) => (
                <button
                  key={`clothes-${i}`}
                  className={`avatar-customizer-btn animate-wobble ${user.avatar.clothes === c ? "selected" : ""}`}
                  onClick={() => updateAvatar("clothes", c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="controls" style={{ marginTop: "20px" }}>
            <button className="animate-wobble" onClick={rollNewLook}>Roll Random Look</button>
            <button className="animate-wobble" style={{ background: "#58d68d" }} onClick={publishToFeed}>
              Publish Style
            </button>
          </div>
          {publishMessage && (
            <p style={{ color: "#27ae60", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>
              {publishMessage}
            </p>
          )}
        </section>

        <section className="card tasks-section">
          <div className="profile-card-header">
            <div className="avatar-frame" style={{ width: "80px", height: "80px", margin: 0 }}>
              <div className="avatar-preview" style={{ fontSize: "2rem" }}>
                {user.avatar.hair !== "❌" && <div style={{ fontSize: "1.1rem", position: "absolute", top: "5px" }}>{user.avatar.hair}</div>}
                <div style={{ fontSize: "2rem" }}>{user.avatar.face}</div>
                {user.avatar.clothes !== "❌" && <div style={{ fontSize: "1.1rem", position: "absolute", bottom: "5px" }}>{user.avatar.clothes}</div>}
              </div>
            </div>
            <div>
              <h2 style={{ margin: 0 }}>@{user.username}</h2>
              <p style={{ margin: 0, fontWeight: "bold", color: "#666" }}>Macondo Arcade Citizen</p>
            </div>
          </div>

          <div style={{ borderBottom: "2px dashed #1a1a1a", paddingBottom: "15px", marginBottom: "15px" }}>
            <h3>Career Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontWeight: "bold" }}>
              <p style={{ margin: "5px 0" }}>High Score: <span style={{ color: "#ffd700" }}>{user.stats.highScore}</span></p>
              <p style={{ margin: "5px 0" }}>Games Played: <span>{user.stats.gamesPlayed}</span></p>
              <p style={{ margin: "5px 0" }}>Total Clicks: <span>{user.stats.totalClicks}</span></p>
              <p style={{ margin: "5px 0" }}>Quests Completed: <span>{user.stats.questsCompleted}</span></p>
            </div>
          </div>

          <div style={{ borderBottom: "2px dashed #1a1a1a", paddingBottom: "15px", marginBottom: "15px" }}>
            <h3>Social Connections</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontWeight: "bold" }}>
              <p style={{ margin: "5px 0" }}>Followers: <span>{user.followers}</span></p>
              <p style={{ margin: "5px 0" }}>Following: <span>{followingUsers.length}</span></p>
            </div>
          </div>

          <div>
            <h3>Badges Unlocked</h3>
            <div className="badge-grid">
              {user.badgeIds.map((badge, idx) => (
                <div key={`badge-${idx}`} className="badge-item">
                  🏆 {badge}
                </div>
              ))}
              {user.badgeIds.length === 0 && <p style={{ fontSize: "0.9rem", color: "#666" }}>Play games and complete daily quests to earn badges!</p>}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
