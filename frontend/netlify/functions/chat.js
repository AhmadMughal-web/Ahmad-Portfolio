const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
    // only POST allowed
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { messages } = JSON.parse(event.body);

        if (!Array.isArray(messages)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'messages must be an array' }),
            };
        }

        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                // ✅ safe working model
                model: 'claude-3-haiku-20240307',
                max_tokens: 300,

                system: `You are an AI assistant for M Ahmad's portfolio website.
M Ahmad is a Junior Full Stack Developer from Pakistan.
Skills: HTML, CSS, JavaScript, React, Tailwind, Bootstrap, Node.js, Express, MongoDB, REST APIs, GitHub, AI tools.
Projects: Portfolio website, AI Agency website, Full Stack App (in progress).
Contact: ahmadmughalweb@gmail.com, WhatsApp: +92 324 9425513.
He is open to work, self-taught, came from pre-medical background.
Answer questions about his portfolio, skills, projects, and contact info.
Also answer general coding questions briefly and clearly.`,

                messages: messages.map((m) => ({
                    role: m.role,
                    content: String(m.content),
                })),
            }),
        });

        const data = await res.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reply: data?.content?.[0]?.text || 'No response generated',
            }),
        };
    } catch (err) {
        console.error('Function Error:', err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
            }),
        };
    }
};