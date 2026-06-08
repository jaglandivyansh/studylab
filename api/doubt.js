// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Bracket Tag Extractor — 100% Complete and Accurate Answers
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // AI ko clear brackets ke sath answer dene ko bola hai
  const SYSTEM_PROMPT = `You are an educational assistant for Indian competitive exams.
Answer the question completely and concisely in under 150 words using simple English.

CRITICAL: You must wrap your final student-facing answer between [ANSWER_START] and [ANSWER_END] tags. 
Example:
[ANSWER_START]
The Prime Minister (PM) of India is the head of the government...
[ANSWER_END]`;

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
          { role: "user", content: `${SYSTEM_PROMPT}\n\nQuestion: ${question.trim()}` }
        ],
        temperature: 0.1, 
        max_tokens: 500 // Sahi bada token count taaki answer poora aaye
      })
    });

    const data = await sarvamRes.json();
    if (data.error) return res.status(200).json({ answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` });

    let answer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content || "";
    
    if (answer) {
      // 🎯 BRACKET EXTRACTOR: Agar AI ne tags lagaye hain, toh unke beech ka poora text nikal lo
      const match = answer.match(/\[ANSWER_START\]([\s\S]*?)\[ANSWER_END\]/i);
      
      if (match && match[1]) {
        answer = match[1].trim();
      } else {
        // Fallback: Agar AI tag lagana bhool gaya, toh bas "1.", "2." waali lines ko hatayenge
        answer = answer
          .split("\n")
          .filter(line => !/^\d+\./.test(line.trim()) && !line.toLowerCase().includes("deconstruct") && !line.toLowerCase().includes("analyze"))
          .join("\n")
          .trim();
      }

      return res.status(200).json({ answer: answer });
    }

    return res.status(200).json({ answer: "⚠️ Model did not return any text." });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
