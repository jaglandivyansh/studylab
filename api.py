import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.get_json()
        notes = data.get("notes", "").strip()

        if not notes:
            return jsonify({"error": "No notes provided"}), 400

        prompt = f"""You are a helpful study assistant. Analyze the following study notes and return a structured summary in this exact format:

KEY POINTS:
- [point 1]
- [point 2]
- [point 3]
(list the most important points)

IMPORTANT DATES & NUMBERS:
- [year/number]: [what it refers to]
(only if present in the notes)

IMPORTANT NAMES & TERMS:
- [name/term]: [brief explanation]
(only if present in the notes)

QUICK REVISION SUMMARY:
[2-3 sentences summarizing everything for last-minute reading]

Notes to summarize:
{notes}"""

        response = model.generate_content(prompt)
        return jsonify({"summary": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "StudyLab API is running!"})

if __name__ == "__main__":
    app.run(debug=False)
