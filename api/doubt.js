// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Ultimate Structural Filter — Completely Strips Out All Reasoning Steps
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  const SYSTEM_PROMPT = "You are a direct educational assistant. Provide a simple, clear, and complete answer to the student's question for competitive exams. Do not show any internal thinking, planning steps, or numbered analysis. Output only the final answer.";

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
        max_tokens: 500 // Tokens thode badha diye taaki filter hone ke baad bhi answer adhura na rahe
      })
    });

    const data = await sarvamRes.json();
    if (data.error) return res.status(200).json({ answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` });

    let answer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content || "";
    
    if (answer) {
      // 🔥 BULLETPROOF REGEX CLEANER: 
      // Agar text mein "1. ", "2. ", "3. ", ya "4. " ke sath koi bhi bold heading ya text shuru hota hai,
      // toh hum pure string ko split karke sirf sabse aakhiri block uthayenge jo ki actual answer hoga.
      if (/\b\d+\.\s+(\*\*.*?\*\*|[A-Za-z])/i.test(answer) || answer.includes("Analyze the User") || answer.includes("Review and Refine")) {
        
        // Block text ko paragraphs mein todenge
        const paragraphs = answer.split(/\n+/);
        
        // Piche se dhoondenge ki kaun sa paragraph bina kisi "1.", "2.", "Analyze" ke shuru ho raha hai
        let cleanAnswerParts = [];
        for (let i = paragraphs.length - 1; i >= 0; i--) {
          let p = paragraphs[i].trim();
          // Agar paragraph kisi planning keyword se shuru nahi ho raha, toh yeh humara actual answer hai
          if (p && !/^\d+\./.test(p) && !p.startsWith('*') && !p.toLowerCase().includes("deconstruct") && !p.toLowerCase().includes("analyze") && !p.toLowerCase().includes("synthesize") && !p.toLowerCase().includes("refine")) {
            cleanAnswerParts.unshift(p);
          }
        }
        
        if (cleanAnswerParts.length > 0) {
          answer = cleanAnswerParts.join("\n\n");
        } else {
          // Fallback: Agar sabhi mein steps the, toh bas sabse aakhiri paragraph ko hi return karo
          answer = paragraphs[paragraphs.length - 1];
        }
      }

      // Final check: Agar abhi bhi galti se koi bullet point bacha ho toh use thoda saaf kar dein
      answer = answer.replace(/^\s*[\-\*]\s*/, ''); 

      return res.status(200).json({ answer: answer.trim() });
    }

    return res.status(200).json({ answer: "⚠️ Model did not return any text." });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
