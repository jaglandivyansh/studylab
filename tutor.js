export default async function handler(req, res) {
  // 1. Log the method to Vercel logs so we can see what's happening
  console.log("Request Method:", req.method);

  try {
    // 2. Forward the request to Sarvam using your hidden environment variable
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await sarvamRes.json();
    
    // 3. Send the AI's response back to your StudyLab frontend
    res.status(200).json(data);
    
  } catch (error) {
    console.error("AI Proxy Error:", error);
    res.status(500).json({ error: "Failed to connect to AI Tutor." });
  }
}