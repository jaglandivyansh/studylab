// api/doubt.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // Ekdum chota aur direct prompt, bina kisi extra rules ke taaki AI confuse na ho
  const SYSTEM_PROMPT = "You are a direct study assistant. Provide a short, complete answer to the question in simple English for competitive exams. Do not write any thinking steps, brainstorming, or intro. Start directly with the answer.";

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
        temperature: 0.0, 
        max_tokens: 400,
        reasoning_effort: "low"
      })
    });

    const data = await sarvamRes.json();
    if (data.error) return res.status(200).json({ answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` });

    let answer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content || "";
    
    // Safety cleaner: Agar AI ne fir bhi 1. Analyze likha toh use uda dega
    if (answer.includes("1. ") || answer.includes("Analyze")) {
      const parts = answer.split(/\n\n/);
      answer = parts[parts.length - 1];
    }

    return res.status(200).json({ answer: answer.trim() });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
