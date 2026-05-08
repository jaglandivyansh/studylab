export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { newsContext } = req.body;

    if (!newsContext) {
      return res.status(400).json({ error: "newsContext is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: newsContext }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
        })
      }
    );

    const data = await response.json();

    // Log full response for debugging
    if (!response.ok) {
      return res.status(500).json({ error: "Gemini API error", details: data });
    }

    if (!data.candidates || !data.candidates[0]) {
      return res.status(500).json({ error: "No candidates in response", raw: data });
    }

    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}