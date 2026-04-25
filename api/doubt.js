// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// Vercel Serverless Function — Gemini AI Doubt Solver
//
// SETUP (one time):
//   1. Vercel Dashboard → Your Project → Settings → Environment Variables
//   2. Add:  GEMINI_API_KEY = (your key from aistudio.google.com/apikey)
//   3. Redeploy once — done!
//
// This file goes in your project at:  /api/doubt.js
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {

  // Only allow POST requests
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
Use simple English. If unrelated to studies, politely redirect.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: SYSTEM_PROMPT + "\n\nStudent question: " + question.trim() }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 512
          }
        })
      }
    );

    const data = await geminiRes.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ answer: data.candidates[0].content.parts[0].text });
    }

    if (data.error) {
      return res.status(500).json({ error: data.error.message || "Gemini API error." });
    }

    return res.status(500).json({ error: "No response from Gemini." });

  } catch (err) {
    return res.status(500).json({ error: "Backend failed to connect." });
  }
}