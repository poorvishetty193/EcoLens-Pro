# EcoLens Pro 🌍

EcoLens Pro is an AI-Powered Planetary Intelligence Platform for Personal & Community Climate Action. It goes beyond simple carbon tracking by offering real-time data integration, advanced AI forecasting, and engaging gamification features.

**"See your planet. Own your impact."**

## Architecture

```text
client (React/Vite) <--> server (Express) <--> Supabase (Postgres)
                                          <--> Claude API
                                          <--> Open-Meteo API
                                          <--> Electricity Maps API
```

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS (v4), Framer Motion, Recharts, Three.js
- **Backend**: Node.js, Express, Upstash Redis
- **Database/Auth**: Supabase
- **AI**: Anthropic Claude API

## Prerequisites
- Node.js 18+
- A Supabase Project
- Anthropic API Key (Claude)
- Electricity Maps API Key

## Setup Instructions

1. **Clone the repository**
2. **Database Setup**
   - Go to your Supabase project's SQL Editor.
   - Run the SQL script found in `supabase_schema.sql` to initialize tables and RLS policies.
3. **Backend Setup**
   - Navigate to `/server`.
   - Copy `.env.example` to `.env` and fill in your keys.
   - Run `npm install` and `npm run dev`.
4. **Frontend Setup**
   - Navigate to `/client`.
   - Copy `.env.example` to `.env` and fill in the Supabase keys.
   - Run `npm install` and `npm run dev`.

## Deployment
A `Dockerfile` is included for easy deployment to Google Cloud Run, rendering the static client assets through the Express server in production.

## License
MIT
