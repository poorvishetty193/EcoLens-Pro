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
  const cacheKey = `council_${decision}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    turns: [
      {
        speaker: "Scientist",
        quote: "String (Opening argument focusing on climate models)",
        theme: "science",
        confidence: 95,
        evidence: "High",
        risk: "Low"
      },
      {
        speaker: "Economist",
        quote: "String (Counter-argument focusing on budget/cost)",
        theme: "economy",
        confidence: 82,
        evidence: "Medium",
        risk: "High"
      },
      {
        speaker: "Citizen",
        isInterruption: true,
        quote: "String (Passionate interruption about daily life impact)",
        theme: "citizen",
        confidence: 99,
        evidence: "Anecdotal",
        risk: "Medium"
      },
      {
        speaker: "Strategist",
        quote: "String (Policy implementation pathway and political feasibility)",
        theme: "policy",
        confidence: 75,
        evidence: "Medium",
        risk: "Low"
      }
    ],
    vote: {
      result: "APPROVED or REJECTED",
      supportPercentage: 86
    },
    resolution: "String (Official UN-style final declaration resolving the debate)"
  };

  const data = await fetchGroqAPI(
    "You are the orchestration engine for The Climate Council, a high-stakes UN-style summit. Generate a highly dramatic, sequential debate script involving 4 personas (Scientist, Economist, Citizen, Strategist). Include at least one interruption, final vote percentages, and a formal resolution.",
    `Proposal: ${decision}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getClimateStrategy = async (goal) => {
  const cacheKey = `command_center_${goal}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    experts: [
      { role: "Economist", quote: "String (Opinion on cost vs ROI)" },
      { role: "Climate Scientist", quote: "String (Opinion on carbon impact)" },
      { role: "Urban Planner", quote: "String (Opinion on infrastructure)" }
    ],
    roadmap: {
      phase1: "String (0-6 Months focus)",
      phase2: "String (1-3 Years focus)",
      phase3: "String (3-10 Years focus)"
    },
    strategies: [
      { 
        id: "s1",
        title: "String (e.g. Solar Array)", 
        impact: "Number (1-100)", 
        cost: "Number (1-100)", 
        difficulty: "String (Easy/Medium/Hard)",
        risk: "String (Short risk description)" 
      }
      // Need 4-6 strategies
    ],
    legacy: {
      peopleImpacted: "String (e.g. 50,000+)",
      carbonPrevented: "String (e.g. 100k Tons)",
      treesEquivalent: "String (e.g. 2 Million)"
    }
  };

  const data = await fetchGroqAPI(
    "You are the AI Strategy Council for a global Climate Command Center. Analyze the user's goal and generate a comprehensive, structured JSON response containing expert opinions, a phased roadmap, specific interactive strategies (with numerical impact/cost 1-100), and final legacy metrics.",
    `User Goal: ${goal}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getPlanetDna = async (timeline) => {
  const cacheKey = `planet_dna_${timeline}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    archetype: "String (e.g., Forest Guardian, Energy Architect, Planet Restorer, etc.)",
    creature: "String (e.g., Forest Dragon, Solar Phoenix, Ocean Leviathan)",
    story: "String (2-3 sentence cinematic origin story about their environmental legacy)",
    legacy: "String (e.g., Protected 12 species, Prevented 80,000kg CO2)"
  };

  const data = await fetchGroqAPI(
    "You are the sequencer of the EcoVerse Planet DNA Lab. Based on the provided timeline context, assign the user an epic Environmental Archetype, a Spirit Creature, an Origin Story, and a future Legacy projection.",
    `Timeline Context: ${timeline}`,
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
  const cacheKey = `lab_${problem}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    dna: {
      name: "String (Futuristic Startup Name)",
      mission: "String (One sentence mission)",
      tech: "String (e.g., AI-driven biotech, IoT robotics)",
      innovationScore: 92,
      fundingScore: 85
    },
    investors: [
      { role: "Climate Investor", quote: "String (Financial perspective)", verdict: "PASS or FUND" },
      { role: "Engineer", quote: "String (Technical feasibility)", verdict: "PASS or FUND" },
      { role: "Policy Expert", quote: "String (Regulatory hurdles)", verdict: "PASS or FUND" },
      { role: "Customer", quote: "String (Market adoption)", verdict: "PASS or FUND" }
    ],
    impact: {
      metricName: "String (e.g., Tons of CO2 Prevented, Liters of Water Saved)",
      valuePerUser: 15
    },
    legacy: "String (Cinematic description of how this changes the world in 2050)"
  };

  const data = await fetchGroqAPI(
    "You are the core intelligence of the Climate Innovation Lab. For the given environmental problem, invent a billion-dollar, highly futuristic climate-tech startup. Generate its DNA, investor feedback, and future legacy.",
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

export const getSpeciesRecoveryStory = async (speciesName) => {
  const cacheKey = `species_${speciesName}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    story: "String narrative paragraph"
  };

  const data = await fetchGroqAPI(
    "You are a narrator for a National Geographic style documentary. Write a short, emotional 2-sentence story describing how this species returned from the brink of extinction due to global habitat restoration.",
    `Species: ${speciesName}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getMissionBriefing = async (campaignName) => {
  const cacheKey = `mission_${campaignName}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    situation: "String (1-2 sentences describing the current dire climate crisis in this region)",
    objective: "String (1-2 sentences outlining the specific restoration goals)",
    outcome: "String (1 sentence projecting the positive future impact if successful)"
  };

  const data = await fetchGroqAPI(
    "You are the AI Mission Commander of the EcoVerse Future Earth Simulator. Generate a concise, high-stakes military/scientific briefing for a global planetary restoration campaign.",
    `Campaign: ${campaignName}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getDocumentaryScript = async (policy) => {
  const cacheKey = `doc_${policy}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    c1_decision: "String (Narrator: The state of the world in 2026 before the policy)",
    c2_changes: "String (Narrator: 2028 - The immediate short-term impact of the policy)",
    c3_turning_point: "String (Narrator: 2035 - The massive scaling of the initiative)",
    c4_new_generation: "String (Narrator: 2050 - A new generation born into a changed world)",
    c5_legacy: "String (Narrator: 2075 - The final legacy of the decision)",
    news_2030: "String (Headline format)",
    news_2040: "String (Headline format)",
    news_2060: "String (Headline format)",
    interview_name: "String (e.g., Dr. Elena Rostova)",
    interview_role: "String (e.g., Urban Farmer, 2050)",
    interview_quote: "String (1-2 sentences from the citizen's perspective)"
  };

  const data = await fetchGroqAPI(
    "You are a visionary AI screenwriter for a cinematic climate documentary spanning 50 years. Given a policy, generate a 5-chapter narration script, future news headlines, and a fictional citizen interview.",
    `Policy: ${policy}`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};

export const getCityAdvisorInsight = async (policies) => {
  const cacheKey = `mayor_${policies.renewables}_${policies.transport}_${policies.forests}_${policies.industry}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const schemaExample = {
    headline: "String (e.g., SMOG LEVELS CRITICAL)",
    insight: "String (1-2 sentences of specific advice from the AI Mayor based on the current policy slider values)"
  };

  const data = await fetchGroqAPI(
    "You are the AI Mayor Advisor of the Future City Nexus. Analyze the current city policy metrics (0-100 scale) and provide a short, urgent insight on the city's health.",
    `Policies: Renewables(${policies.renewables}%), Transport(${policies.transport}%), Forests(${policies.forests}%), Industry(${policies.industry}%)`,
    schemaExample
  );

  setCachedResponse(cacheKey, data);
  return data;
};
