// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Debugging Version — AI Doubt Solver
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
        temperature: 0.4,
        max_tokens: 300
      })
    });

    // Pehle raw text check karte hain ki kuch aa bhi raha hai ya nahi
    const rawText = await sarvamRes.text();
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      // Agar JSON nahi hai (jaise HTML error page ya bad gateway)
      return res.status(200).json({ 
        answer: `⚠️ Server returned non-JSON response. Raw: ${rawText.substring(0, 200)}` 
      });
    }

    // 1. Agar Sarvam ne koi error bheja hai
    if (data.error) {
      return res.status(200).json({ 
        answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` 
      });
    }

    // 2. Agar sahi response aaya hai
    const answer = data?.choices?.[0]?.message?.content;
    if (answer) {
      return res.status(200).json({ answer: answer });
    }

    // 3. Agar response aaya par structure bilkul alag hai (Poora data screen par dikhega)
    return res.status(200).json({ 
      answer: `⚠️ Data structural mismatch. Received: ${JSON.stringify(data).substring(0, 300)}` 
    });

  } catch (err) {
    return res.status(200).json({ 
      answer: `⚠️ Backend catch block error: ${err.message || err}` 
    });
  }
}
