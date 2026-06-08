// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// STUDYLAB MASTER BACKEND — CRASH-PROOF AI DOUBT SOLVER
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { question } = req.body;

  if (!question || typeof question !== "string" || question.trim() === "") {
    return res.status(400).json({ error: "Please enter a valid question." });
  }

  // 💡 System prompt ko bilkul chota aur direct rakha hai taaki AI gyaan na bante
  const SYSTEM_PROMPT = "You are a direct study assistant for Indian competitive exams. Provide a short, complete answer under 150 words using simple English. Do not write any internal thinking, planning steps, or numbered analysis. Start directly with the answer.";

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
        temperature: 0.0,       // Strict deterministic output
        max_tokens: 450,        // Ample tokens taaki answer beech mein na kate
        reasoning_effort: "low" // Suppresses heavy thinking chains on supported gateways
      })
    });

    const data = await sarvamRes.json();

    if (data.error) {
      return res.status(200).json({ answer: "System busy. Please try again in a moment." });
    }

    let finalAnswer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content || "";

    if (finalAnswer) {
      // 🛡️ BACKEND SAFETY LAYER: Agar AI fir bhi dheetpan kare, toh code planning blocks ko uda dega
      if (finalAnswer.includes("1. ") || finalAnswer.includes("Analyze") || finalAnswer.includes("Deconstruct")) {
        const cleanBlocks = finalAnswer.split(/\n\n/);
        finalAnswer = cleanBlocks[cleanBlocks.length - 1];
      }
      
      return res.status(200).json({ answer: finalAnswer.trim() });
    }

    return res.status(200).json({ answer: "Could not generate a response. Please rephrase." });

  } catch (err) {
    return res.status(500).json({ error: "Internal server connectivity failure." });
  }
}
