from flask import Flask, render_template, request, jsonify
import openai
import base64
import os

app = Flask(__name__)

# Replace this with your actual API key or use environment variable securely
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    circuit_text = request.form.get('circuit_text')
    image = request.files.get('circuit_image')
    follow_up = request.form.get('follow_up')

    messages = [
        {"role": "system", "content": "You are a helpful circuit explainer AI. Explain the behavior of circuits and suggest improvements if asked."}
    ]

    if circuit_text:
        messages.append({
            "role": "user",
            "content": f"Describe this circuit and detect any errors: {circuit_text}"
        })

    elif image:
        image_bytes = image.read()
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        messages.append({
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this circuit and detect any errors."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}
            ]
        })

    if follow_up and follow_up.lower() == "yes":
        messages.append({
            "role": "user",
            "content": "Can you suggest some improvements or alternatives to this circuit?"
        })

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # or "gpt-3.5-turbo" if image not needed
            messages=messages,
            max_tokens=800
        )
        reply = response.choices[0].message['content']
        return jsonify({"response": reply})
    except Exception as e:
        print("Error:", e)
        return jsonify({"response": f"⚠️ Error getting response from OpenAI: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
