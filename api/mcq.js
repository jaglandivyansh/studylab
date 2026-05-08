module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY not set" });
    return;
  }

  const newsContext = req.body && req.body.newsContext;
  if (!newsContext) {
    res.status(400).json({ error: "newsContext missing" });
    return;
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: newsContext }] }]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      res.status(500).json({ error: "Bad Gemini response", raw: JSON.stringify(data) });
      return;
    }

    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ text: text });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};