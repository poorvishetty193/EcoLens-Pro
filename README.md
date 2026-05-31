# EcoVerse AI 🌍

**EcoVerse AI** is a futuristic, cinematic, AI-powered planetary simulator. It allows users to visualize, simulate, and emotionally connect with the long-term impact of climate policies, sustainability actions, and technological breakthroughs on the future of Earth.

## 🌟 The Ultimate Climate Action Sandbox

**EcoLens Pro** has been completely overhauled into a cinematic, high-stakes 3D global simulation platform. Built with React Three Fiber, Framer Motion, and the ultra-fast Groq LLM, every feature is designed to be a jaw-dropping "wow" moment.

### 🌌 Cinematic Features

- **FutureCast Network (Climate News):** A live television broadcast from tomorrow. Submit a scenario and watch a 3D Holographic News Globe react as you scrub through a chronological timeline of breaking news, field reports from AI correspondents across different channels, and citizen interviews from 2030 to 2100.
- **Future City Nexus (Digital Twin):** A living, breathing 3D metropolis simulation. Tweak transport and industry policies to watch smog clear, neon buildings light up, and urban forests literally grow out of the concrete in real-time. Features an AI Mayor Advisor.
- **The Climate Council (Debate Chamber):** A high-stakes UN-style global summit. Submit a policy and watch 4 distinct AI personas (Scientist, Economist, Citizen, Strategist) debate it in a 3D Reality Projection chamber, complete with dramatic interruptions, voting, and a final UN resolution.
- **Future Echoes (Impact Story):** An interactive 5-chapter cinematic AI documentary. Watch a procedural 3D city evolve through decades as an AI narrator recounts the long-term legacy of your environmental choices.
- **Climate Command Center (Strategist AI):** A tactical 3D war room. Deploy specific climate strategies into a 3D "Cost vs Impact Galaxy" and watch as an AI Council debates the deployment before initializing a global launch sequence.
- **Climate Innovation Lab (AI Inventor):** A Tony Stark-esque startup incubator. The 3D Innovation Reactor fuses scientific disciplines to generate a holographic climate-tech startup, complete with "Startup DNA" scores and an evaluation from an AI Board of Investors.
- **Planet DNA Lab:** A dark, futuristic DNA sequencing laboratory that analyzes your past decisions to construct your unique environmental archetype.
- **The Great Rewilding:** Watch a 3D nature reserve literally spring to life, generating trees, sparkling fireflies, and animals as your overall planet health increases. real-time Climate Health Score.
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
