import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "../utils/storage";

const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error("Missing Gemini API Key");
  }
  return new GoogleGenerativeAI(apiKey);
};

const getModel = () => {
  return getGenAI().getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: { 
      temperature: 0.7
    }
  });
};

const stripMarkdown = (text) => {
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
};

export const getCoachAnalysis = async (data14Day) => {
  const cacheKey = 'ai_coach_analysis';
  const cached = storage.getCachedAI(cacheKey);
  if (cached) return cached;

  try {
    const model = getModel();
    const prompt = `You are an expert sustainability coach. Analyze the user's 14-day carbon log data: ${JSON.stringify(data14Day)}. 
    Return ONLY a JSON object with no markdown fences:
    {
      "summary": "2 sentences, personal, uses their numbers",
      "top_sources": [ { "category": "string", "avg_kg_day": number, "insight": "string" } ],
      "strategies": [
        { 
          "action": "string", "category": "string", "co2_saved_kg_week": number, 
          "difficulty": 1, "why_it_matters": "1 sentence"
        }
      ],
      "motivational_note": "1 sentence, encouraging"
    }`;

    const result = await model.generateContent(prompt);
    const jsonStr = stripMarkdown(result.response.text());
    const parsed = JSON.parse(jsonStr);
    
    storage.setCachedAI(cacheKey, parsed, 60 * 12); // Cache 12 hours
    return parsed;
  } catch (error) {
    console.error("AI Coach Error:", error);
    throw new Error(error.message || "Failed to generate coaching analysis.");
  }
};

export const getScenarioSimulation = async (scenario, userAnnualKg) => {
  try {
    const model = getModel();
    const prompt = `User's current annual CO₂: ${userAnnualKg} kg. They want to: ${scenario}. 
    Return ONLY JSON, no markdown fences:
    {
      "annual_reduction_kg": number,
      "monthly_reduction_kg": number,
      "new_planet_score": number,
      "cost_impact": "string (e.g. 'Saves ~₹45,000/year')",
      "equivalent": "string (e.g. 'Like planting 47 trees')",
      "flights_offset": "string (e.g. 'Offsets 3 London round trips')",
      "difficulty": "Easy"|"Medium"|"Hard"|"Major Life Change",
      "time_to_impact": "string"
    }`;

    const result = await model.generateContent(prompt);
    return JSON.parse(stripMarkdown(result.response.text()));
  } catch (error) {
    console.error("Scenario Simulation Error:", error);
    throw new Error(error.message || "Failed to simulate scenario.");
  }
};

export const getEmissionForecast = async (data30Day, weatherForecast) => {
  const cacheKey = 'ai_forecast_narrative';
  const cached = storage.getCachedAI(cacheKey);
  if (cached) return cached;

  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { temperature: 0.7 } });
    const prompt = `User's recent 30-day carbon data: ${JSON.stringify(data30Day)}. Weather forecast: ${JSON.stringify(weatherForecast)}.
    Write a 2-sentence forecast narrative. E.g. "Based on your patterns, you're on track for X kg this week. Your weekend tends to be your heaviest..." No greeting, just the insight.`;

    const result = await model.generateContent(prompt);
    const insight = result.response.text().trim();
    
    storage.setCachedAI(cacheKey, insight, 60 * 24); // Cache 24 hours
    return insight;
  } catch (error) {
    console.error("Emission Forecast Error:", error);
    return "Based on your recent activity, you are tracking steadily. Keep an eye on weekend usage.";
  }
};

export const getDailyInsight = async (summaryData) => {
  const cacheKey = 'ai_daily_insight';
  const cached = storage.getCachedAI(cacheKey);
  if (cached) return cached;

  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { temperature: 0.8 } });
    const prompt = `User's recent carbon summary: ${JSON.stringify(summaryData)}. 
    Write a 1-2 sentence insightful observation about their pattern. No greeting, just the insight.`;

    const result = await model.generateContent(prompt);
    const insight = result.response.text().trim();
    
    storage.setCachedAI(cacheKey, insight, 60 * 6); // Cache 6 hours
    return insight;
  } catch (error) {
    console.error("Daily Insight Error:", error);
    return "Keep logging your activities to discover actionable insights about your carbon footprint.";
  }
};

export const getBaselineAssessment = async (answers) => {
  try {
    const model = getModel();
    const prompt = `You are a sustainability expert. User baseline answers: ${JSON.stringify(answers)}. 
    Return ONLY a JSON object, no markdown:
    {
      "estimated_annual_kg": number,
      "planet_score": number (0-100),
      "top_sources": ["string", "string"],
      "encouragement": "string (max 20 words)"
    }`;

    const result = await model.generateContent(prompt);
    return JSON.parse(stripMarkdown(result.response.text()));
  } catch (error) {
    console.error("Baseline Assessment Error:", error);
    return {
      estimated_annual_kg: 4500,
      planet_score: 65,
      top_sources: ["Transport", "Food"],
      encouragement: "Great start! Let's work together to reduce your footprint."
    };
  }
};
