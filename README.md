# EcoVerse AI 🌍

**EcoVerse AI** is a futuristic, cinematic, AI-powered planetary simulator. It allows users to visualize, simulate, and emotionally connect with the long-term impact of climate policies, sustainability actions, and technological breakthroughs on the future of Earth.

## ✨ Features

- **Living Earth Engine**: A dynamic 3D globe powered by React Three Fiber that physically degrades (pollution, smog, dying forests) or thrives (glowing oceans, green continents) based on your real-time Climate Health Score.
- **Future Earth Portal**: Ask an advanced AI engine (powered by Groq `llama-3.3-70b-versatile`) about any sustainability scenario and receive a structured projection mapping the impact across 1, 5, 10, and 20 years.
- **Green Multiverse (Parallel Universe Engine)**: A massive cinematic 3D experience where you can fly through space, enter dimensional portals to 4 alternate Earth futures (from "Business as Usual" to "Tech Breakthrough"), and watch two alternate universes physically collide in a keynote-level interactive demo.
- **Butterfly Effect Engine**: A fully interactive 3D web mapping the cascading impact of small personal choices over a 24-year timeline. Watch as a low-poly city physically transforms and morphs into a healthy planet as you scrub the timeline.
- **AI-Powered Ecosystem**: Uses the Groq API for lightning-fast generative AI, including Future News Holograms, Citizen Lifeline tracking, and emotional "Talk to Earth" dialogues.

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion (for glassmorphic UI overlays).
- **3D Rendering**: Three.js + React Three Fiber + Drei.
- **AI Integration**: Groq API (`llama-3.3-70b-versatile`) via REST.
- **Data Persistence**: LocalStorage (Privacy-first caching of all AI generation).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` (or create a `.env` file) and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_groq_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security Note
All API requests are made via client-side fetch calls for demonstration purposes. Ensure you restrict your API keys if deploying to a production environment. The `.env` file is heavily excluded from Git to prevent secret leakage.
