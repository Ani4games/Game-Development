# 🚀 Space Dodger (JavaScript)

A 2D space survival game built using **HTML5 Canvas and JavaScript**, focused on **gameplay AI design**, **FSM-based enemy behavior**, and **dynamic difficulty control**.

This project was created to explore **game design + lightweight AI systems**, not just visuals.

---

## 🎮 Gameplay Overview

- The player controls a spaceship that can **move only horizontally**
- Obstacles descend from the top of the screen
- The objective is to **survive as long as possible** while avoiding collisions
- Difficulty increases dynamically based on player performance

---

## 🕹️ Controls

- **Left Arrow (←)** – Move left  
- **Right Arrow (→)** – Move right  

---

## 🤖 Gameplay AI Architecture

This game uses a **unified obstacle entity system** rather than separate logic for each enemy type.

### 🔹 Obstacle Entity System
All threats (meteors, UFOs) are treated as **obstacles** that share:
- Position
- Size
- State
- Update & render pipeline

Behavior differences emerge from **data-driven parameters**, not conditionals.

---

### 🔹 Finite State Machine (FSM)

Each obstacle operates using a finite state machine:

| State  | Description |
|------|------------|
| DRIFT | Moves straight downward |
| TARGET | Actively aligns with the player |
| FEINT | Performs sudden lateral movement to surprise the player |

FSM allows enemies to feel **intentional**, not random.

---

### 🔹 Director-Based Difficulty System

A lightweight **AI Director** adjusts challenge dynamically using:
- Survival time
- Near-miss tracking
- Player score

Director modes:
- **CALM** – Gentle pacing
- **PRESSURE** – Increased aggressive behavior
- **RELIEF** – Temporary reduction in intensity

This prevents both boredom and unfair difficulty spikes.

---

### 🔹 Score-Gated Enemy Introduction

- UFOs are introduced **only after a score threshold**
- Ensures early gameplay remains accessible
- Rewards player mastery with increased challenge

---

## 🧠 Why This Design?

Instead of hard-coding behavior per enemy:
- One update loop
- One draw loop
- Behavior defined by parameters

This approach:
- Scales easily
- Avoids logic duplication
- Reflects real-world game architecture principles

---

## 📁 Project Structure

Space-Dodger/
│
├── index.html # Canvas setup & game entry
├── style.css # Basic styling
├── game.js # Game loop, AI logic, FSM, director
└── assets/
├── player.png
├── meteor.png
├── ufo.png
└── hit.ogg


---

## ▶️ How to Run

1. Clone the repository:
```bash
git clone https://github.com/Ani4Games/Space-Dodger.git