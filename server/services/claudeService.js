const fetch = require('node-fetch'); // Assuming node 18+ global fetch or we might need it if older, but Node 18 has native fetch

const callClaude = async (systemPrompt, userPrompt, maxTokens = 1024, retries = 3) => {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_CLAUDE_API_KEY') {
        throw new Error('Claude API key not configured');
    }

    const url = 'https://api.anthropic.com/v1/messages';
    const body = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
            { role: 'user', content: userPrompt }
        ]
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Claude API error: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            let text = data.content[0].text;
            
            // Clean markdown fences if JSON is expected
            if (systemPrompt.includes('JSON')) {
                text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }

            return text;
        } catch (error) {
            console.error(`Claude attempt ${attempt} failed:`, error.message);
            if (attempt === retries) throw error;
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
};

module.exports = {
    callClaude
};
