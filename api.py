import os
import base64
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

PROMPT = """You are a study assistant helping a student prepare for competitive exams like UPSC, SSC, State PSC etc.

Read these notes carefully and provide a structured summary:

1. KEY POINTS
(bullet points of all important facts)

2. IMPORTANT DATES & NUMBERS
(dates, years, statistics, numbers)

3. IMPORTANT NAMES & TERMS
(people, places, acts, concepts, battles, dynasties)

4. QUICK REVISION
(3-5 sentences for last-minute revision)

Be thorough. Capture every important fact clearly."""

@app.route("/")
def home():
    return jsonify({"status": "StudyLab AI Backend running!"})

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.get_json()
        notes = data.get("notes", "").strip()
        if not notes or len(notes) < 20:
            return jsonify({"error": "Notes too short"}), 400
        response = model.generate_content([PROMPT + "\n\nNotes:\n" + notes])
        return jsonify({"summary": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/summarize-file", methods=["POST"])
def summarize_file():
    try:
        data = request.get_json()
        file_data = data.get("data", "")
        mime_type = data.get("mimeType", "")
        file_type = data.get("fileType", "")  # "pdf" or "image"

        if not file_data or not mime_type:
            return jsonify({"error": "No file data"}), 400

        # Decode base64
        raw = base64.b64decode(file_data)

        if file_type == "pdf":
            # For PDF use inline_data
            content = [
                PROMPT,
                {
                    "inline_data": {
                        "mime_type": "application/pdf",
                        "data": file_data
                    }
                }
            ]
        else:
            # Image
            content = [
                PROMPT,
                {
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": file_data
                    }
                }
            ]

        response = model.generate_content(content)
        return jsonify({"summary": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
