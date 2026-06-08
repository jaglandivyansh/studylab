// api/doubt.js (Super Clean & Safe Version)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // Ekdum kadak prompt jo planning ko 100% block karega
  const SYSTEM_PROMPT = `You are a helpful study assistant for Indian competitive exam students.
Provide a direct, complete, and concise answer under 150 words using simple English.

CRITICAL ROLE: Do NOT think out loud. Do NOT write "Deconstruct the User's Request", "Initial Brainstorming", or any numbered steps. Output ONLY the final student-facing answer directly.`;

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
        temperature: 0.1, 
        max_tokens: 450, // tokens badha diye taaki answer poora aaye
        reasoning_effort: "low"
      })
    });

    const data = await sarvamRes.json();
    if (data.error) return res.status(200).json({ answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` });

    const answer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content;
    
    if (answer) {
      return res.status(200).json({ answer: answer.trim() });
    }
    return res.status(200).json({ answer: "⚠️ Model did not return any text." });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
