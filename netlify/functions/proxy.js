exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Prioritize rotating keys: GEMINI_API_KEY, GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3
    const keys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
    ].filter(Boolean);

    // Fallback to header if no env keys
    if (keys.length === 0 && event.headers['x-api-key']) {
        keys.push(event.headers['x-api-key']);
    }

    if (keys.length === 0) {
        return { 
            statusCode: 401, 
            body: JSON.stringify({ error: { message: "No Gemini API Key provided (missing env keys or x-api-key header)" } }) 
        };
    }

    const model = event.body && JSON.parse(event.body).model || "gemini-2.5-flash";
    
    // Try each key in the pool if we hit a 429 (Rate Limit)
    for (let i = 0; i < keys.length; i++) {
        const apiKey = keys[i];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: event.body
            });

            const data = await response.json();
            
            // If Rate Limited (429) and we have more keys, try next
            if (response.status === 429 && i < keys.length - 1) {
                console.warn(`Key ${i+1} Rate Limited. Shifting to next key...`);
                continue;
            }

            return {
                statusCode: response.status,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(data)
            };
        } catch (err) {
            console.error(`Proxy Error (Key ${i+1}):`, err);
            if (i === keys.length - 1) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: { message: err.message } })
                };
            }
        }
    }
};
