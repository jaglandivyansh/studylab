export default async function handler(req, res) {
  try {
    // Forward the request to Sarvam with the correct model ID
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-30b", // Use "sarvam-30b" or "sarvam-105b" for better reasoning
        messages: req.body.messages,
        temperature: 0.2, // Low temperature for deterministic, factual output
        reasoning_effort: "low" // Ensures it stays brief as requested
      })
    });

    const data = await sarvamRes.json();
    
    // If the API returns an error (e.g. invalid key), we send it to the frontend for debugging
    if (data.error) {
      return res.status(200).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "The AI Tutor backend failed to connect." });
  }
}
