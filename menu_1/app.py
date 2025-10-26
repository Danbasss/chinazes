from flask import Flask, render_template, send_from_directory, abort, json, g
import os
import sqlite3

DATABASE = os.path.dirname(__file__) + '\\database.db'
CATEGORIES = None
# шляхи до задніх фонів
BACK_PHOTOS = ['BACKGROUNDPIZZA.png', 'BACKGROUNDCROISSANT.png', 
         'BACKGROUNDBURGER.png', 'BACKGROUNDSHAWARMA.png', 
         'BACKGROUNDSHAWARMA.png', 'BACKGROUNDSALAD.png', 
         'BACKGROUNDSOUP.png', 'BACKGROUNDDUMPLING.png', 
         'BACKGROUNDGOFRA.png', 'BACKGROUNDSIDEDISHES.png', 
         'BACKGROUNDDESSERTS.png']
LANGUAGE = "ua"      #за замовчуванням

app = Flask(__name__, template_folder='')

conn = sqlite3.connect(DATABASE, check_same_thread=False)
cursor = conn.cursor()

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
    cursor.execute( f'''SELECT {depends_on_lang("name")}, price, discount, {depends_on_lang("ingredients")}, icon_path
                                 FROM food_menu
                                 WHERE section_ua = "{category}" ''')
    
    dishes = []
    for row in cursor.fetchall():
        dishes.append({'name': row[0], 'price': row[1], "ingredients": row[2], "icon_path": f"images/{row[3]}"})
    print(dishes)
    back_photo_true_path = list(BACK_PHOTOS)
    for n in range(len(back_photo_true_path)):
        back_photo_true_path[n] = f"images/{back_photo_true_path[n]}"

    return render_template('menu.html', dishes=dishes, sections=CATEGORIES, back_photos=back_photo_true_path)

def depends_on_lang(needed_col):
    needed_col += "_" + LANGUAGE
    return needed_col

if __name__ == '__main__':
    cursor.execute(f"SELECT DISTINCT {depends_on_lang("section")} FROM food_menu") 
    CATEGORIES = cursor.fetchall()
    CATEGORIES = [row[0] for row in CATEGORIES]
    app.run(debug=True)
