// This file runs securely on the server, hiding your API key.
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Forward the request to Sarvam using the hidden environment variable
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await sarvamRes.json();
    
    // Send the AI's response back to your frontend
    res.status(200).json(data);
    
  } catch (error) {
    console.error("AI Proxy Error:", error);
    res.status(500).json({ error: "Failed to connect to AI Tutor." });
  }
}