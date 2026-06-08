// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Vercel Serverless Function — AI Doubt Solver (Fixed Response Structure)
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
        model: "sarvam-30b", 
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: question.trim() }
        ],
        temperature: 0.4,
        max_tokens: 300
      })
    });

    const data = await sarvamRes.json();

    // 1. Agar Sarvam backend se koi error aaye (jaise quota end ya invalid key)
    if (data.error) {
      return res.status(200).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    // 2. Sahi response format ko check karne ka ekdum safe tareeqa
    const answer = data?.choices?.[0]?.message?.content;
    
    if (answer) {
      // Frontend ko dono formats mein bhej rahe hain taaki agar frontend 
      // data.answer dhoond raha ho ya data.choices, dono jagah kaam chal jaye.
      return res.status(200).json({ 
        answer: answer,
        choices: [{ message: { content: answer } }] 
      });
    }

    // 3. Agar response aaya par choices khali thi
    return res.status(200).json({ error: "Sarvam returned an empty response. Raw data: " + JSON.stringify(data) });

  } catch (err) {
    return res.status(500).json({ error: "Backend failed to connect." });
  }
}
