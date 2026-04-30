from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from flask_cors import CORS
import os
import re

app = Flask(__name__)
CORS(app)

analyzer = SentimentIntensityAnalyzer()


def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "NLP Service Running 🚀"})

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "Text is required"}), 400

        raw_text = data["text"]

        if not isinstance(raw_text, str) or raw_text.strip() == "":
            return jsonify({"error": "Invalid or empty text"}), 400
        text = preprocess_text(raw_text)
        scores = analyzer.polarity_scores(text)
        score = scores["compound"]

        if score >= 0.4:
            predicted_mood = "Happy"
        elif score >= -0.2:
            predicted_mood = "Neutral"
        else:
            predicted_mood = "Sad"
        if score >= 0.5:
            severity = "Low"
        elif score >= -0.5:
            severity = "Moderate"
        else:
            severity = "High"

        return jsonify({
            "success": True,
            "original_text": raw_text,
            "cleaned_text": text,
            "score": score,
            "severity": severity,
            "predicted_mood": predicted_mood,  
            "details": scores
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
