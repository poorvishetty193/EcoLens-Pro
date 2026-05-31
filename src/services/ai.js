const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = 'qwen/qwen3-32b';

// Helper for localStorage caching (24 hours)
const getCachedResponse = (key) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data;
    }
  }
  return null;
};

const setCachedResponse = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

const fetchGroqAPI = async (systemInstruction, userPrompt, schemaExample) => {
  const fullInstruction = `${systemInstruction}\n\nYou MUST respond entirely in valid JSON format matching this exact structure:\n${JSON.stringify(schemaExample, null, 2)}`;

  const makeRequest = async (modelName) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: fullInstruction },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const err = new Error(`API Error ${response.status}`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  };

  try {
    return await makeRequest(PRIMARY_MODEL);
  } catch (error) {
    console.warn(`Primary model failed (${error.message}). Attempting fallback to ${FALLBACK_MODEL}...`);
    // Retry with fallback if it's a rate limit (429) or server error (5xx)
    if (error.status === 429 || error.status >= 500) {
      return await makeRequest(FALLBACK_MODEL);
    }
    throw error; // Throw other errors (like 401 Unauthorized)
  }
};

export const getFutureProjections = async (scenario) => {
  const cacheKey = `future_portal_${scenario}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    projections: [
      {
        year: 1,
        carbonReduction: 10,
        waterSaved: 5,
        airQuality: 15,
        climateScoreIncrease: 5
      }
    ]
  };

  const data = await fetchGroqAPI(
    "You are an advanced climate simulation engine. Given a scenario, output an array of 4 projections for years 1, 5, 10, and 20 inside a 'projections' key.",
    `Scenario: ${scenario}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data.projections);
  return data.projections;
};

export const getDebateResponse = async (decision) => {
  const cacheKey = `debate_${decision}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    Scientist: "String response",
    Economist: "String response",
    PolicyMaker: "String response",
    Citizen: "String response",
    Recommendation: "String final summary"
  };

  const data = await fetchGroqAPI(
    "You simulate a climate policy debate. For the given decision, provide exactly one response per persona and a final recommendation.",
    `Decision: ${decision}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getClimateStrategy = async (goal) => {
  const cacheKey = `strategy_${goal}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    actionPlan: ["Action 1", "Action 2"],
    timeline: "2 Years",
    estimatedCost: "$1.5 Billion",
    expectedCarbonReduction: "500k Tons",
    difficultyLevel: "High",
    priorityRanking: 1
  };

  const data = await fetchGroqAPI(
    "You are a climate strategist. Output a structured strategy to achieve the user's goal.",
    `Goal: ${goal}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getPlanetDna = async (choices) => {
  const cacheKey = `dna_${choices}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    personality: "Forest Guardian",
    description: "You deeply value biodiversity and natural carbon sinks."
  };

  const data = await fetchGroqAPI(
    "Based on the user's choices, assign them a sustainability personality from: Forest Guardian, Energy Optimizer, Waste Warrior, Mobility Champion, Circular Economy Builder.",
    `Choices: ${choices}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getImpactStory = async (actions) => {
  const cacheKey = `story_${actions}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    story: [
      { year: 2028, narrative: "Narrative paragraph here." },
      { year: 2035, narrative: "Narrative paragraph here." },
      { year: 2050, narrative: "Narrative paragraph here." }
    ]
  };

  const data = await fetchGroqAPI(
    "Generate a cinematic narrative showing the future impact of these actions in 3 storytelling cards.",
    `Actions: ${actions}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data.story);
  return data.story;
};

export const getClimateNews = async (scenario) => {
  const cacheKey = `news_${scenario}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    news: [
      { year: 2030, headline: "Headline here", snippet: "Snippet here" }
    ]
  };

  const data = await fetchGroqAPI(
    "You are a future news generator. For a given climate scenario, generate exactly 3 future newspaper headlines for years 2030, 2035, and 2040.",
    `Scenario: ${scenario}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data.news);
  return data.news;
};

export const getClimateProphecy = async (city) => {
  const cacheKey = `prophecy_${city}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    grimTimeline: [
      { year: 2028, event: "Grim event here" }
    ],
    alternativeFuture: "Positive alternative summary here."
  };

  const data = await fetchGroqAPI(
    "Generate a timeline of grim events if the given city does nothing about climate change (2028, 2032, 2038, 2045), followed by an alternative sustainable future summary.",
    `City: ${city}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getSustainabilityInventor = async (problem) => {
  const cacheKey = `inventor_${problem}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    productName: "String",
    productIdea: "String",
    businessModel: "String",
    sustainabilityImpact: "String",
    implementationPlan: ["Step 1", "Step 2"]
  };

  const data = await fetchGroqAPI(
    "You are a climate startup incubator. Given a problem, invent a product/startup solution.",
    `Problem: ${problem}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getTimeCapsule = async (plan) => {
  const cacheKey = `capsule_${plan}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    message: "String message reflecting back from 2050"
  };

  const data = await fetchGroqAPI(
    "You are a message from humanity in 2050 reflecting back. Based on the user's sustainability plan, generate an emotional holographic letter.",
    `Plan: ${plan}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const talkToEarth = async (question, healthScore) => {
  const cacheKey = `earth_${question}_${healthScore}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    response: "String response from Earth"
  };

  const data = await fetchGroqAPI(
    `You are Earth. You are a living entity. Your current health score is ${healthScore}/100. Respond to the user's question emotionally, reflecting your current health state. Keep it under 3 sentences.`,
    `Question: ${question}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getGenerationSimulation = async (policy) => {
  const cacheKey = `generation_${policy}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    simulation: [
      { age: 10, impact: "String impact" },
      { age: 20, impact: "String impact" },
      { age: 40, impact: "String impact" },
      { age: 70, impact: "String impact" }
    ]
  };

  const data = await fetchGroqAPI(
    "Simulate the impact of a given policy on a child born today across age milestones: 10, 20, 40, and 70.",
    `Policy: ${policy}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data.simulation);
  return data.simulation;
};

export const getCampusSimulation = async (params) => {
  const cacheKey = `campus_${JSON.stringify(params)}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    wasteReduction: 45,
    energySavings: 30,
    carbonReduction: 1200,
    summary: "String summary of impact"
  };

  const data = await fetchGroqAPI(
    "You are a university sustainability simulator. Based on the given campus parameters, predict the waste reduction (%), energy savings (%), and carbon reduction (tons/yr).",
    `Params: ${JSON.stringify(params)}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getButterflyNarrative = async (action) => {
  const cacheKey = `butterfly_${action}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    narrative: "String short story here"
  };

  const data = await fetchGroqAPI(
    "You are a futuristic climate simulation engine. Generate a short, emotional cinematic story (max 3 sentences) about how the given action transformed the future.",
    `Action: ${action}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getCitizenStory = async (universeName) => {
  const cacheKey = `citizen_${universeName}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    story: [
      { age: 10, year: 2036, narrative: "String" },
      { age: 25, year: 2051, narrative: "String" },
      { age: 50, year: 2076, narrative: "String" },
      { age: 75, year: 2101, narrative: "String" }
    ]
  };

  const data = await fetchGroqAPI(
    "You are simulating a citizen's life trajectory in a specific alternate future. Describe their life at ages 10, 25, 50, and 75 based on the environmental and social conditions of this universe.",
    `Universe: ${universeName}`,
    schemaExample
  );

  const safeStory = data?.story || [];
  setCachedResponse(cacheKey, safeStory);
  return safeStory;
};

export const getLegacyNarrative = async (universeA, universeB) => {
  const cacheKey = `legacy_${universeA}_${universeB}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    narrative: "String cinematic conclusion"
  };

  const data = await fetchGroqAPI(
    "You are the narrator of the EcoVerse multiverse. Compare these two colliding timelines and deliver a powerful, emotional, cinematic concluding sentence asking the user which future they will leave behind.",
    `Timelines: ${universeA} vs ${universeB}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};
