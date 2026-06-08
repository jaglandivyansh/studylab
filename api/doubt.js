// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Vercel Serverless Function — AI Doubt Solver (powered by Sarvam AI)
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
Topics: History, Geography, Polity, Economy, Science, GK, Current Affairs.
Answer clearly and concisely in under 150 words.
Use simple English. If the question is unrelated to studies, politely redirect.`;

  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-30b", // ✅ Fixed: Purane model ko 'sarvam-30b' se replace kar diya hai
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: question.trim() }
        ],
        temperature: 0.4,
        max_tokens: 300
      })
    });

    const data = await sarvamRes.json();

    // Agar Sarvam API koi direct error response de (jaise deprecation ya backend error)
    if (data.error) {
      return res.status(200).json({ error: data.error.message || data.error });
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (answer) {
      return res.status(200).json({ answer });
    }

    return res.status(500).json({ error: "No response from Sarvam." });

  } catch (err) {
    return res.status(500).json({ error: "Backend failed to connect." });
  }
}
