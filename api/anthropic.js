/**
 * Tool definitions and API calling logic for Anthropic.
 */

export const TOOL_DEFINITIONS = [
    {
        name: "read_file",
        description: "Read the contents of a file from the virtual filesystem.",
        input_schema: {
            type: "object",
            properties: {
                path: { type: "string", description: "The path to the file to read" }
            },
            required: ["path"]
        }
    },
    {
        name: "write_file",
        description: "Write content to a file in the virtual filesystem.",
        input_schema: {
            type: "object",
            properties: {
                path: { type: "string", description: "The path where the file should be saved" },
                content: { type: "string", description: "The content to write to the file" }
            },
            required: ["path", "content"]
        }
    },
    {
        name: "web_search",
        description: "Perform a web search using the specified query.",
        input_schema: {
            type: "object",
            properties: {
                query: { type: "string", description: "The search query" }
            },
            required: ["query"]
        }
    },
    {
        name: "call_api",
        description: "Make a fetch request to an external API.",
        input_schema: {
            type: "object",
            properties: {
                url: { type: "string" },
                method: { type: "string", enum: ["GET", "POST", "PUT", "DELETE"], default: "GET" },
                body: { type: "string", description: "Stringified JSON body for POST/PUT" }
            },
            required: ["url"]
        }
    }
];

export const callAnthropic = async (apiKey, messages, systemPrompt) => {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'dangerously-allow-browser': 'true' // For this portable artifact
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 4096,
                system: systemPrompt,
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content
                })),
                tools: TOOL_DEFINITIONS
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Failed to call Anthropic API');
        }

        return await response.json();
    } catch (err) {
        throw err;
    }
};
