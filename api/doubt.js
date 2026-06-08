// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Final Working Version — AI Doubt Solver with Low Reasoning
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question || typeof question !== "string" || question.trim() === "") {
    return res.status(400).json({ error: "Question is required." });
  }

  const SYSTEM_PROMPT = `You are a helpful study assistant for Indian competitive exam students (UPSC, SSC, State PSC).
Answer clearly and concisely in under 150 words. Use simple English.`;

  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-30b", 
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: question.trim() }
        ],
        temperature: 0.2, // Thoda kam kiya deterministic output ke liye
        max_tokens: 300,
        reasoning_effort: "low" // ✅ FIXED: Isse model lambi reasoning chhodkar seedha content bhejega!
      })
    });

    const data = await sarvamRes.json();

    if (data.error) {
      return res.status(200).json({ answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` });
    }

    // Pehle normal content check karo, agar reasoning_content mein hi sab likha hai toh woh le lo
    const answer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content;
    
    if (answer) {
      return res.status(200).json({ answer: answer });
    }

    return res.status(200).json({ answer: "⚠️ Model did not return any text text." });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
