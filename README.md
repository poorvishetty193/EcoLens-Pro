# EcoLens Pro 🌱

An AI-Powered Planetary Intelligence Platform for Personal & Community Climate Action.

EcoLens Pro transforms how people relate to climate change — making it personal, gamified, and actionable. It fuses live environmental data feeds, Gemini AI intelligence, a gamified achievement system, and real-time tracking into one immersive dark-mode web application.

## Features

- **Single Page Application (SPA)**: Pure Vite + React frontend architecture.
- **Privacy-First**: No database. All user data is securely stored in browser `localStorage`.
- **Live Integrations**:
  - Gemini 2.0 Flash for AI coaching, forecasting, and scenario simulations.
  - Open-Meteo for real-time weather and AQI context.
  - Electricity Maps for live carbon intensity of the energy grid.
- **Gamification**: Earn XP, unlock levels, achieve up to 30 custom badges, and conquer 20 daily missions.
- **Comprehensive Logging**: Detailed calculators for Transport, Energy, Food, Shopping, and Digital footprints.

## Quick Start

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
   Copy `.env.example` to `.env` and fill in your keys.
   ```
   VITE_GEMINI_API_KEY=your_gemini_key_here
   VITE_ELECTRICITY_MAPS_API_KEY=your_electricity_maps_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment (Docker / Cloud Run)

The repository includes a multi-stage Dockerfile that builds the Vite application and serves it via an NGINX alpine image, perfect for Google Cloud Run deployment.

```bash
docker build -t ecolens-pro .
docker run -p 8080:8080 ecolens-pro
```
