exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Prioritize Netlify Environment Variable for security, fallback to header
    const apiKey = process.env.GEMINI_API_KEY || event.headers['x-api-key'];
    
    if (!apiKey) {
        return { 
            statusCode: 401, 
            body: JSON.stringify({ error: { message: "No Gemini API Key provided (missing GEMINI_API_KEY env or x-api-key header)" } }) 
        };
    }

    // Default to gemini-2.5-flash for confirmed 2026 compatibility
    const model = event.body && JSON.parse(event.body).model || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: event.body
        });

        const data = await response.json();
        
        return {
            statusCode: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        };
    } catch (err) {
        console.error("Proxy Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: err.message } })
        };
    }
};
