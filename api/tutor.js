export default async function handler(req, res) {
  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-2b", // Use 'sarvam-2b' as it is currently the most stable for chat
        messages: req.body.messages,
        temperature: 0.2
      })
    });

    const data = await sarvamRes.json();
    
    // If Sarvam sends an error, we pass it to the frontend to see it
    if (data.error) {
      return res.status(200).json({ choices: [{ message: { content: "AI Error: " + data.error.message } }] });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Backend failed to connect." });
  }
}
