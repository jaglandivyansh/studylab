// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Anti-Reasoning Monologue Version — Strict Chat Output
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // Simple aur seedha prompt. Zyada gyaan dene se AI confuse ho kar use hi repeat karne lagta hai.
  const SYSTEM_PROMPT = "You are a factual study assistant. Provide a direct, short answer to the user's question in simple English for competitive exams. Do not include any steps, thinking, planning, or introduction. Write only the definition or answer.";

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
          { role: "user", content: `${SYSTEM_PROMPT}\n\nQuestion: ${question.trim()}` } // Dono ko user message mein daal diya taaki AI use instruction hi maane
        ],
        temperature: 0.0, // Isko 0.0 kar diya taaki AI bilkul bhi bhatke nahi
        max_tokens: 300
      })
    });

    const data = await sarvamRes.json();
    if (data.error) return res.status(200).json({ answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` });

    let answer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content || "";
    
    // 💡 SYSTEM LEVEL CLEANER: Agar AI fir bhi dheetpan kare, toh code khud use saaf kar dega
    if (answer.includes("1. ") || answer.includes("Analyze the User") || answer.includes("Constraints:")) {
      // Agar text mein fir bhi planning aayi, toh split karke sirf aakhiri hissa nikalenge jahan asli definition hoti hai
      const cleanParts = answer.split(/\n\n/);
      // Agar aakhiri line mein kaam ka answer hai toh use le lo
      answer = cleanParts[cleanParts.length - 1];
    }

    return res.status(200).json({ answer: answer.trim() });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
