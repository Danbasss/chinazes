from flask import Flask, render_template, send_from_directory, request
import os
import sqlite3

DATABASE = os.path.dirname(__file__) + '\\database.db'
CATEGORIES = None
# шляхи до задніх фонів
BACK_PHOTOS = ['https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649636/BACKGROUNDPIZZA_ndynaj.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649632/BACKGROUNDCROISSANT_ib7r5n.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649631/BACKGROUNDBURGER_qsobw3.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649638/BACKGROUNDSHAWARMA_lkwsu8.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649640/BACKGROUNDSALAD_u6jhpd.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649640/BACKGROUNDSOUP_b1ht4n.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649633/BACKGROUNDDUMPLING_wmjfre.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649634/BACKGROUNDGOFRA_rqaxb5.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649639/BACKGROUNDSIDEDISHES_r7b1ka.png', 
         'https://res.cloudinary.com/dwzalnlpv/image/upload/v1761649632/BACKGROUNDDESSERTS_fefhf1.png']
LANGUAGE = "ua"      #за замовчуванням

app = Flask(__name__, template_folder='')

conn = sqlite3.connect(DATABASE, check_same_thread=False)
cursor = conn.cursor()

# Головна сторінка
@app.route('/rif-caffe/')
def index():
    global LANGUAGE
    if(request.args.get('per') != None):
        LANGUAGE = request.args.get('per')
    update_categories()
    print(LANGUAGE)
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
                                 WHERE {depends_on_lang("section")} = "{category}" ''')
    
    dishes = []
    for row in cursor.fetchall():
        dishes.append({'name': row[0], 'price': row[1], "discount": row[2], "ingredients": row[3], "icon_path": row[4]})

    back_photo_true_path = list(BACK_PHOTOS)
    for n in range(len(back_photo_true_path)):
        back_photo_true_path[n] = back_photo_true_path[n]


    return render_template('menu.html', category=category, dishes=dishes, sections=CATEGORIES, back_photos=back_photo_true_path)

#loading categories for index.html
def update_categories():
    global CATEGORIES
    cursor.execute(f"SELECT DISTINCT {depends_on_lang("section")} FROM food_menu") 
    CATEGORIES = cursor.fetchall()
    CATEGORIES = [row[0] for row in CATEGORIES]

# повертає column залежно від мови
def depends_on_lang(needed_col):
    global LANGUAGE
    needed_col += "_" + LANGUAGE
    return needed_col

if __name__ == '__main__':
    update_categories()
    app.run(debug=True)
