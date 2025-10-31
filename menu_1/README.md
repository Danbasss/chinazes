# MENU_1 – Flask Cafe Menu Website

**MENU_1** is a web application built with Flask that displays a cafe menu.  
Dish data is stored in a **SQLite** database `database.db`, and images are uploaded via **Cloudinary**.  
The interface supports multiple languages (files `lang/en.json` and `lang/ua.json`).  

---

## How to Run the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/your-repo.git
cd menu_1
```

### 2. Create and activate a virtual environment
```bash
py -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Flask server
```bash
py app.py
```

After running, open in your browser:  
[http://localhost:5000/rif-caffe/](http://localhost:5000/rif-caffe/)

---

## Project Structure
```
MENU_1/
│
├── app.py              # Main Flask server
├── database.db         # SQLite database
├── requirements.txt    # Python dependencies
│
├── css/
│   └── style.css       # Main styles
│
├── js/
│   └── index.js        # Client-side scripts
│
├── lang/
│   ├── en.json         # English language
│   └── ua.json         # Ukrainian language
│
├── images/
│   └── mif.png         # Logo image
│
├── index.html          # Main page
└── menu.html           # Menu page
```

---

## Technologies Used

- **Python 3.x**  
- **Flask**  
- **SQLite3**  
- **HTML5 / CSS3 / JavaScript**  
- **Cloudinary** (image hosting)  
- **JSON localization files**  

---

## Notes

- The `.db` file is not included in the repository (you can connect your own SQLite database).  
