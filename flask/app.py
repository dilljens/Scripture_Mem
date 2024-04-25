from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

verses = [
    "For the land is full of silver and gold, and there is no end to their treasures.",
    "Their land is also full of horses, and there is no end to their chariots."
]
verse_index = 0
modes = ['visible', 'half', 'invisible']
current_mode = modes[0]

@app.route('/')
def index():
    print(verses[verse_index])
    # return render_template('index.html', current_mode=current_mode, modes=modes, verse=verses[verse_index])
    return render_template('index.html', verse=verses[verse_index])

@app.route('/next_verse', methods=['POST'])
def next_verse():
    global verse_index
    verse_index = (verse_index + 1) % len(verses)
    return jsonify(verse=verses[verse_index])

@app.route('/toggle_mode', methods=['POST'])
def toggle_mode():
    global current_mode
    current_mode_index = (modes.index(current_mode) + 1) % len(modes)
    current_mode = modes[current_mode_index]
    return jsonify(new_mode=current_mode)

@app.route('/check_input', methods=['POST'])
def check_input():
    user_input = request.json['input'].replace(" ", "").lower()
    words = verses[verse_index].split()
    results = []
    for i, word in enumerate(words):
        if len(user_input) > i and word[0].lower() == user_input[i]:
            results.append({'word': word, 'class': 'correct'})
        elif len(user_input) > i:
            results.append({'word': word, 'class': 'incorrect'})
        else:
            results.append({'word': word, 'class': 'default'})
    return jsonify(results=results)

if __name__ == '__main__':
    app.run(debug=True, port=5500)
