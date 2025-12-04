from flask import Flask, render_template, send_from_directory, request
import os

LANGUAGE = "ua"      #за замовчуванням
app = Flask(__name__, template_folder='../frontend')

# Підключення статичних файлів
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('../frontend/css', filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('../frontend/images', filename)

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('../frontend', filename)

# Шляхи
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/bio')
def bio():
    return render_template("bio.html")

@app.route('/highlights')
def highlights():
    return render_template("highlights.html")

@app.route('/memes')
def memes():
    return render_template("memes.html")

@app.route('/quiz')
def quiz():
    return render_template("quiz.html")

@app.route('/shotchart')
def shotchart():
    return render_template("shotchart.html")

@app.route('/stats')
def stats():
    return render_template('stats.html')

if __name__ == '__main__':
    app.run(debug=True)