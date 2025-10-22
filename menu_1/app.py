from flask import Flask, render_template, send_from_directory, abort, json
import os

app = Flask(__name__, template_folder='')

CATEGORIES = None
# шляхи до задніх фонів
BACK_PHOTOS = ['BACKGROUNDPIZZA.png', 'BACKGROUNDCROISSANT.png', 
         'BACKGROUNDBURGER.png', 'BACKGROUNDSHAWARMA.png', 
         'BACKGROUNDSHAWARMA.png', 'BACKGROUNDSALAD.png', 
         'BACKGROUNDSOUP.png', 'BACKGROUNDDUMPLING.png', 
         'BACKGROUNDGOFRA.png', 'BACKGROUNDSIDEDISHES.png', 
         'BACKGROUNDDESSERTS.png']

# Головна сторінка
@app.route('/rif-caffe/')
def index():
    return render_template('index.html', categories=CATEGORIES)

# Підключення статичних файлів
@app.route('/rif-caffe/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/rif-caffe/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

@app.route('/rif-caffe/<path:filename>')
def serve_static(filename):
    return send_from_directory('', filename)

# Сторінка категорії
@app.route('/rif-caffe/menu/<category>/')
def menu_category(category):
    data = load_menu()
    # Знаходимо відповідну категорію без урахування регістру
    matched = next((k for k in data.keys() if k.lower() == category.lower()), None)
    if not matched:
        abort(404)

    dishes = data[matched]

    # Повний шлях до іконок
    for dish in dishes:
        dish['icon_path'] = f"images/{dish['icon_path']}"

    back_photo_true_path = list(BACK_PHOTOS)
    for n in range(len(back_photo_true_path)):
        back_photo_true_path[n] = f"images/{back_photo_true_path[n]}"

    return render_template('menu.html', category=matched, dishes=dishes, sections=CATEGORIES, back_photos=back_photo_true_path)

def load_menu():
    with open( os.path.dirname(__file__) + '\\menu.json', 'r', encoding='utf-8') as f:
        return json.load(f)

if __name__ == '__main__':
    data = load_menu()
    CATEGORIES = list(k for k in data.keys())
    app.run(debug=True)
