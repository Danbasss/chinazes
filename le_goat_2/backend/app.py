from flask import Flask, render_template, send_from_directory, request
import os
from flask_sqlalchemy import SQLAlchemy

LANGUAGE = "ua"      #за замовчуванням
app = Flask(__name__, template_folder='../frontend')


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:nigga911@localhost:5432/lebron'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class RegularSeasonStats(db.Model):
    __tablename__ = 'regular_season_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    season = db.Column(db.String(9))
    team = db.Column(db.String(3))
    gp = db.Column(db.Integer)
    gs = db.Column(db.Integer)
    minutes = db.Column(db.Numeric)
    fg = db.Column(db.String(20))
    fg_pct = db.Column(db.Numeric)
    three_pt = db.Column(db.String(20))
    three_pt_pct = db.Column(db.Numeric)
    ft = db.Column(db.String(20))
    ft_pct = db.Column(db.Numeric)
    ofens_reb = db.Column(db.Numeric)
    dr = db.Column(db.Numeric)
    reb = db.Column(db.Numeric)
    ast = db.Column(db.Numeric)
    blk = db.Column(db.Numeric)
    stl = db.Column(db.Numeric)
    pf = db.Column(db.Numeric)
    turnovers = db.Column(db.Numeric)
    pts = db.Column(db.Numeric)

class PlayoffStats(db.Model):
    __tablename__ = 'postseason_stats'  
    id = db.Column(db.Integer, primary_key=True)
    season = db.Column(db.String(9))
    team = db.Column(db.String(3))
    gp = db.Column(db.Integer)
    gs = db.Column(db.Integer)
    minutes = db.Column(db.Numeric)
    fg = db.Column(db.String(20))
    fg_pct = db.Column(db.Numeric)
    three_pt = db.Column(db.String(20))
    three_pt_pct = db.Column(db.Numeric)
    ft = db.Column(db.String(20))
    ft_pct = db.Column(db.Numeric)
    ofens_reb = db.Column(db.Numeric)
    dr = db.Column(db.Numeric)
    reb = db.Column(db.Numeric)
    ast = db.Column(db.Numeric)
    blk = db.Column(db.Numeric)
    stl = db.Column(db.Numeric)
    pf = db.Column(db.Numeric)
    turnovers = db.Column(db.Numeric)
    pts = db.Column(db.Numeric)


COLUMNS = [
    'season', 'team', 'gp', 'gs', 'minutes',
    'fg', 'fg_pct', 'three_pt', 'three_pt_pct',
    'ft', 'ft_pct', 'ofens_reb', 'dr', 'reb',
    'ast', 'blk', 'stl', 'pf', 'turnovers', 'pts'
]


COLUMN_NAMES_UA = {
    'season': 'SEASON',
    'team': 'TEAM',
    'gp': 'GP',
    'gs': 'GS',
    'minutes': 'MIN',
    'fg': 'FG',
    'fg_pct': 'FG%',
    'three_pt': '3PT',
    'three_pt_pct': '3PT%',
    'ft': 'FT',
    'ft_pct': 'FT%',
    'ofens_reb': 'OR',
    'dr': 'DR.',
    'reb': 'REB.',
    'ast': 'ASY',
    'blk': 'BLK',
    'stl': 'STL.',
    'pf': 'PF',
    'turnovers': 'TO',
    'pts': 'PTS'
}

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
    table = request.args.get('table', 'regular')  

    if table == 'playoff':
        model = PlayoffStats
        title = "Плей-офф"
    else:
        model = RegularSeasonStats
        title = "Регулярний сезон"

    data = model.query.order_by(model.season.desc()).all()


    data_list = [row.__dict__ for row in data]
    for row in data_list:
        row.pop('_sa_instance_state', None)

    return render_template(
        'stats.html',
        data=data_list,
        selected_table=table
    )

if __name__ == '__main__':
    app.run(debug=True)