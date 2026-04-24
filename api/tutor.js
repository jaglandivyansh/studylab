export default async function handler(req, res) {
  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Updated to a supported model ID based on your error message
        model: "sarvam-m", 
        messages: req.body.messages,
        temperature: 0.2,
        max_tokens: 150
      })
    });

    const data = await sarvamRes.json();
    
    // Pass the data back to the frontend
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Backend failed to connect." });
  }
}
