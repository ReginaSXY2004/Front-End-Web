from flask import Flask, render_template, request, jsonify
from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Load the tokenizer and model
tokenizer = RobertaTokenizerFast.from_pretrained("arpanghoshal/EmoRoBERTa")
model = TFRobertaForSequenceClassification.from_pretrained("arpanghoshal/EmoRoBERTa")
emotion = pipeline('sentiment-analysis', model=model, tokenizer=tokenizer)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        texts = request.json.get('text', [])
        if not texts:
            return jsonify({"error": "No text provided"}), 400
        
        if isinstance(texts, str):
            texts = [texts]

        emotion_labels = emotion(texts)
        return jsonify(emotion_labels)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

