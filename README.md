#  HealthHer — Kindred Confidant Connect

> **A Secure, Anonymous, and Elegant Full-Stack Women's Wellness & Companion Platform**

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-FF00C1?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

**HealthHer** (Kindred Confidant Connect) is a modern, full-stack wellness platform engineered to empower women with comprehensive cycle tracking, mood and symptom analytics, and real-time anonymous community support. Adhering to a zero-auth, high-privacy philosophy, it integrates real-time chat rooms, curated wellness resources, and a private AI emotional support companion—all presented in a beautiful blush-peach and deep-plum pastel design.

---

## 📖 Table of Contents

1. [✨ Key Features](#-key-features)
2. [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
3. [📂 Folder Structure](#-folder-structure)
4. [⚙️ Local Installation & Setup](#️-local-installation--setup)
5. [🌐 Environment Variables](#-environment-variables)
6. [🔌 API & WebSocket Documentation](#-api--websocket-documentation)
7. [🚀 Deployment Instructions](#-deployment-instructions)
8. [🤝 Privacy & Security Philosophy](#-privacy--security-philosophy)

---

## ✨ Key Features

### 🌸 Cycle Prediction & Symptom Analytics (`/dashboard`)
* **Smart Tracker:** Log period dates, flow intensity, and physiological symptoms (cramps, headaches, fatigue, bloating).
* **Automated Computations:** Computes average cycle duration and predicts your next period onset dynamically.
* **Interactive Visualizations:** Renders monthly mood-and-symptom trends using responsive **Recharts** charts to help users identify physical patterns.

### 💬 Anonymous Support Lounge (`/community`)
* **Zero-Auth Entrance:** Access support groups by entering a temporary nickname. No passwords, email verification, or tracking logs required.
* **Sub-Second Real-Time Chat:** Powered by **Socket.io**, enabling users to instantly broadcast and receive support messages across specialized rooms:
  * 🌿 *General Chat*
  * 🩸 *Period Talk*
  * 🧠 *Mental Well-being*
* **Persistent Archive:** Chats are stored securely in a MongoDB cluster via custom Mongoose schemas.

### 🤖 Ephemeral AI Wellness Companion (`/ai`)
* **Empathetic Companion:** Dedicated, beautifully styled chat window connecting to a private AI wellness companion to answer questions about stress, PMS, cycles, and general self-care.
* **100% Client-Safe:** Chat logs are completely local to your browser session, maintaining total user privacy.

### 🌿 Curated Resource Library (`/resources`)
* Curated wellness libraries mapping specialized articles, diet guides for menstrual phases, PCOS self-care checklists, and breathing exercises.

### 🎨 Harmonious UI/UX Experience
* High-end **blush-peach, soft sage, and deep plum** color palettes.
* Distinctive typography incorporating **Fraunces** serif headers and **Inter** sans-serif body text.
* Fluid layouts with micro-interactions and smooth **Framer Motion** state transitions.

---

## 🛠️ Tech Stack & Architecture

```mermaid
flowchart TD
    subgraph Client ["Client (React 19 / Vite)"]
        A[App Router] --> B(Home Landing)
        A --> C(Dashboard / Analytics)
        A --> D(Anonymous Chat Lounge)
        A --> E(AI Wellness Companion)
        A --> F(Resource Hub)
    end

    C <-->|HTTP CRUD| G[Express REST API]
    F <-->|HTTP GET| G
    E <-->|HTTP POST Query| H[AI Controller Service]
    D <-->|WS join_room / send_message| I[Socket.io Server]

    subgraph Server ["Server (Node.js & Express)"]
        G
        H
        I
    end

    subgraph Database ["Database Layer"]
        J[(MongoDB Cluster)]
    end

    G <-->|Mongoose ODM| J
    I <-->|Write chat messages| J
