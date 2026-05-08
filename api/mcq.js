export default async function handler(req, res) {
  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: req.body.messages,
        temperature: 0.4,
        max_tokens: 1500
      })
    });

    const data = await sarvamRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Backend failed to connect." });
  }
}