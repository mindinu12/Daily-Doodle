# 🎯 Daily Doodle — Macondo Edition

Welcome to the **Daily Doodle**! An interactive, hyper-focused retro dashboard built custom for Hack Club Macondo. This app provides interactive client-side games, randomized quest synchronization, style inspiration selectors, and retro drawing panels.

---

## ⚡ Core Features

### 1. Style Customizer
- **Layered Layering**: Modify hairstyles, facial expressions, and clothing layers using responsive emoji elements inside absolute-positioned boundaries.
- **Roll Randomizer**: Generate custom, random outfit and character combinations instantly.
- **Persistent State**: Changes are stored in `localStorage`, maintaining your style across refreshes.

### 2. Today's Quests
- **Date-Locked Selector**: Selects exactly 3 randomized quests from a distinct repository of 30 options at the start of each morning.
- **Progress Track**: A progress bar dynamically tracking completion rates, giving immediate visual feedback as items are completed.
- **Strict Verification**: Status persistence locks objectives to protect against session restarts.

### 3. Hand-Crafted Idea Generator
- **Idea Box**: Randomly rotates creative prompts (e.g. "A robotic pineapple wearing sunglasses", "A wise wizard snail carrying a library on its shell") to spark sketch ideas.

### 4. Macondo Game Room
Switch between three games using custom tab selectors:
*   **🎯 Target Clicker**: A reaction game where the target `🎯` scales down dynamically as your score accumulates, making it harder to target. Tracks high score bounds in persistent memory.
*   **🎨 Doodle Sketchpad**: A fully responsive HTML5 Canvas drawing board supporting both mouse pointers and touch gestures. Select neon color palettes, toggle thin or thick brush configurations, clear panels, and draw freely.
*   **🃏 Memory Card Match**: A 12-card puzzle grid matching pairs of Macondo retro emojis. Features attempt trackers, completion counters, and game state loops.

---

## 🛠️ Stack & Architecture

- **Engine**: React 19 & Next.js App Router
- **Style Definitions**: Custom vanilla CSS targeting high-contrast boundaries, bold black shadows, and responsive grid layouts (Tailwind-free).
- **Client Synchronization**: Standard hooks (`useState`, `useEffect`, `useRef`) managing event bindings, context rendering, and browser state memory.

---

## 🚀 Getting Started

1.  Navigate into the workspace folder:
    ```bash
    cd daily-doodle
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Launch local development server:
    ```bash
    npm run dev
    ```
4.  Build optimization binaries:
    ```bash
    npm run build
    ```
