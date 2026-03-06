import os
import base64
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

SYSTEM = """You are StudyLab AI, a smart study assistant helping Indian students prepare for competitive exams like UPSC, SSC, State PSC, Railways, Banking etc.

You can:
- Answer questions on History, Geography, Polity, Economy, Science, GK
- Summarize notes (text, PDF, images)
- Explain concepts clearly
- Give mnemonics and memory tricks
- Create practice questions
- Give quick revision points

Keep responses clear, structured and exam-focused. Use bullet points where helpful."""

@app.route("/")
def home():
    return jsonify({"status": "StudyLab AI Assistant running!"})

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        messages = data.get("messages", [])
        if not messages:
            return jsonify({"error": "No messages"}), 400

        # Build conversation history for Gemini
        history = []
        for msg in messages[:-1]:
            history.append({
                "role": "user" if msg["role"] == "user" else "model",
                "parts": [msg["content"]]
            })

        chat_session = model.start_chat(history=history)
        last_msg = messages[-1]["content"]
        response = chat_session.send_message(SYSTEM + "\n\n" + last_msg if len(messages) == 1 else last_msg)
        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/summarize-file", methods=["POST"])
def summarize_file():
    try:
        data = request.get_json()
        file_data = data.get("data", "")
        mime_type = data.get("mimeType", "")
        file_type = data.get("fileType", "")
        question = data.get("question", "")

        if not file_data or not mime_type:
            return jsonify({"error": "No file data"}), 400

        prompt = question if question else """You are a study assistant for Indian competitive exams. Read these notes and provide:

1. KEY POINTS
(bullet points of all important facts)

2. IMPORTANT DATES & NUMBERS
(dates, years, statistics)

3. IMPORTANT NAMES & TERMS
(people, places, acts, concepts)

4. QUICK REVISION
(3-5 sentences for last-minute revision)

Be thorough and exam-focused."""

        content = [
            prompt,
            {"inline_data": {"mime_type": mime_type, "data": file_data}}
        ]

        response = model.generate_content(content)
        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
