"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext, UserProfile } from "../context/AppContext";

export default function NetworkPage() {
  const {
    user,
    accounts,
    followingUsers,
    toggleFollowUser,
    switchProfile,
    createNewAccount
  } = useAppContext();

  const [newUsername, setNewUsername] = useState("");
  const [discord, setDiscord] = useState("");
  const [github, setGithub] = useState("");
  const [scrapbook, setScrapbook] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    createNewAccount(newUsername.trim());
    setNewUsername("");
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage("External handles linked successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <>
      <header className="animate-float">
        <h1>Social Graph & Accounts</h1>
        <p>Switch profiles, follow other citizens, and map external developer accounts</p>
      </header>

      <nav className="doodle-nav">
        <Link href="/" className="doodle-nav-link">Home</Link>
        <Link href="/profile" className="doodle-nav-link">Profile</Link>
        <Link href="/discover" className="doodle-nav-link">Discover</Link>
        <Link href="/network" className="doodle-nav-link active">Network</Link>
      </nav>

      <main className="app-container">
        <section className="card">
          <h2>Identity Switcher</h2>
          <p style={{ marginBottom: "20px" }}>Switch between active browser profiles or spin up a new citizen handle.</p>
          
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "1rem" }}>Current Identity</h3>
            <div className="network-user-item" style={{ background: "#ffd700" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>@{user.username} (You)</span>
                <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", color: "#333" }}>
                  High Score: {user.stats.highScore} | Badges: {user.badgeIds.length}
                </p>
              </div>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem" }}>ACTIVE</span>
            </div>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "1rem" }}>Other Identities</h3>
            <div className="network-user-list">
              {accounts.map((acc) => (
                <div key={acc.username} className="network-user-item">
                  <div>
                    <span style={{ fontWeight: "bold" }}>@{acc.username}</span>
                    <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", color: "#666" }}>
                      High Score: {acc.stats.highScore} | Badges: {acc.badgeIds.length}
                    </p>
                  </div>
                  <button
                    className="animate-wobble"
                    style={{ width: "auto", padding: "6px 12px", fontSize: "0.8rem", background: "#f0f0f0" }}
                    onClick={() => switchProfile(acc.username)}
                  >
                    Switch
                  </button>
                </div>
              ))}
              {accounts.length === 0 && <p style={{ fontSize: "0.9rem", color: "#666" }}>No other accounts found.</p>}
            </div>
          </div>

          <form onSubmit={handleCreate} style={{ borderTop: "2px dashed #1a1a1a", paddingTop: "20px" }}>
            <h3>Create Account</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="new_username"
                style={{
                  flex: 1,
                  border: "3px solid #1a1a1a",
                  padding: "10px",
                  fontWeight: "bold",
                  fontFamily: "inherit"
                }}
                maxLength={20}
              />
              <button
                type="submit"
                className="animate-wobble"
                style={{ width: "auto", padding: "10px 20px", background: "#58d68d" }}
              >
                Create
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <h2>Network Social Graph</h2>
          
          <div style={{ marginBottom: "25px" }}>
            <h3>Peer Citizen List</h3>
            <div className="network-user-list">
              {accounts.map((peer) => {
                const isFollowing = followingUsers.includes(peer.username);
                return (
                  <div key={`peer-${peer.username}`} className="network-user-item">
                    <div>
                      <span style={{ fontWeight: "bold" }}>@{peer.username}</span>
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", color: "#666" }}>
                        Followers: {peer.followers + (isFollowing ? 1 : 0)} | High Score: {peer.stats.highScore}
                      </p>
                    </div>
                    <button
                      className="animate-wobble"
                      style={{
                        width: "auto",
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        background: isFollowing ? "#f5b7b1" : "#5dade2"
                      }}
                      onClick={() => toggleFollowUser(peer.username)}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSaveSocials} style={{ borderTop: "2px dashed #1a1a1a", paddingTop: "20px" }}>
            <h3>External Handles Linker</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Discord Name:</label>
                <input
                  type="text"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="lucas#1234"
                  style={{
                    width: "100%",
                    border: "3px solid #1a1a1a",
                    padding: "8px",
                    fontWeight: "bold",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>GitHub User:</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="lucashacks"
                  style={{
                    width: "100%",
                    border: "3px solid #1a1a1a",
                    padding: "8px",
                    fontWeight: "bold",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Scrapbook Link:</label>
                <input
                  type="text"
                  value={scrapbook}
                  onChange={(e) => setScrapbook(e.target.value)}
                  placeholder="https://scrapbook.hackclub.com/lucas"
                  style={{
                    width: "100%",
                    border: "3px solid #1a1a1a",
                    padding: "8px",
                    fontWeight: "bold",
                    fontFamily: "inherit"
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="animate-wobble"
              style={{ background: "#ffd700" }}
            >
              Save Link Handles
            </button>
            {saveMessage && (
              <p style={{ color: "#27ae60", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>
                {saveMessage}
              </p>
            )}
          </form>
        </section>
      </main>
    </>
  );
}
