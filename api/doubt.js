// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// FINAL PRODUCTION VERSION — STOPS MONOLOGUE & FORCES COMPLETE ANSWERS
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // Prompt ko ekdum chota aur directly hit karne waala banaya hai
  const SYSTEM_PROMPT = "Provide a direct, complete answer for competitive exams under 150 words using simple English. Do not show any internal brainstorming, refining steps, or meta-commentary like 'Refining and Combining'. Start immediately with the facts.";

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
        max_tokens: 500
      })
    });

    const data = await sarvamRes.json();
    if (data.error) return res.status(200).json({ answer: `⚠️ Sarvam Error: ${data.error.message || JSON.stringify(data.error)}` });

    let answer = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content || "";
    
    if (answer) {
      // 🎯 FORCEFUL EXTRACTOR: Agar AI apni aadat se majboor ho kar planning text bhejta hai,
      // toh hum use direct bullet points ya paragraph se split karke sirf actual answer nikalenge.
      if (answer.toLowerCase().includes("refining") || answer.toLowerCase().includes("let's start") || answer.toLowerCase().includes("core definition")) {
        
        // Agar text ke andar clear point indicators hain jaise "*" ya "-" toh unka use karenge
        const blocks = answer.split(/\n+/);
        let cleanLines = [];
        
        for (let line of blocks) {
          let trimmed = line.trim();
          // Faltu headings ko skip karenge aur sirf quotes ke andar ka ya clean statement uthayenge
          if (trimmed && !trimmed.toLowerCase().includes("refining") && !trimmed.toLowerCase().includes("structuring") && !trimmed.toLowerCase().includes("brainstorming")) {
            // Agar line mein "The Prime Minister..." jaisa text quotes mein hai ya direct hai, toh clean karein
            let cleanLine = trimmed.replace(/^[\s\-\*\"\']+|[\"\'\:]+$/g, '');
            if (cleanLine.toLowerCase().startsWith("let's start")) {
              cleanLine = cleanLine.replace(/Let's start with the core definition\.?/i, '').trim();
            }
            if (cleanLine) cleanLines.push(cleanLine);
          }
        }
        
        if (cleanLines.length > 0) {
          answer = cleanLines.join(" ");
        }
      }

      // Agar filter lagne ke baad bhi kuch "Let's start" bacha ho toh ek last safety check
      answer = answer.replace(/Refining and Combining for Conciseness and Simplicity.*?\n/gi, "");
      answer = answer.replace(/Let's start with the core definition\.?/gi, "");

      return res.status(200).json({ answer: answer.trim() });
    }

    return res.status(200).json({ answer: "⚠️ Model did not return any text." });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
