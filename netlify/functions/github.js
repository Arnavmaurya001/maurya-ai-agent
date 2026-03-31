exports.handler = async (event) => {
    // Enable CORS
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'Arnavmaurya001';
    const repo = process.env.GITHUB_REPO || 'maurya-ai-agent';

    if (!token) {
        return { 
            statusCode: 500, 
            headers,
            body: JSON.stringify({ error: "GITHUB_TOKEN not configured in environment" }) 
        };
    }

    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const { action, path, content, sha: incomingSha } = body;

        const ghHeaders = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Maurya-AI-Agent-Proxy'
        };

        if (action === 'read') {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const response = await fetch(url, { headers: ghHeaders });
            const data = await response.json();

            if (!response.ok) {
                return { statusCode: response.status, headers, body: JSON.stringify(data) };
            }

            // Return decoded content
            const decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ content: decodedContent, sha: data.sha }) 
            };
        } 
        
        if (action === 'write') {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            
            // 1. Get current SHA if not provided
            let sha = incomingSha;
            if (!sha) {
                const getRes = await fetch(url, { headers: ghHeaders });
                if (getRes.ok) {
                    const getData = await getRes.json();
                    sha = getData.sha;
                }
            }

            // 2. Commit the change
            const writeRes = await fetch(url, {
                method: 'PUT',
                headers: ghHeaders,
                body: JSON.stringify({
                    message: `Update ${path} via Maurya AI Agent Proxy`,
                    content: Buffer.from(content).toString('base64'),
                    sha: sha
                })
            });

            const writeData = await writeRes.json();
            return { 
                statusCode: writeRes.status, 
                headers, 
                body: JSON.stringify(writeData) 
            };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid action" }) };

    } catch (err) {
        console.error("GitHub Proxy Error:", err);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: err.message }) 
        };
    }
};
