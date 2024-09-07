import datetime

from flask import Flask, request, make_response, render_template, url_for, jsonify, redirect
import sqlite3
import bcrypt

app = Flask(__name__)
app.secret_key = 'your_secret_key'

def create():
    db = sqlite3.connect('database.db')
    c = db.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER,
            login TEXT,
            password TEXT,
            email TEXT
        )
    ''')
    db.commit()
    db.close()

create()


@app.route('/', methods=['GET'])
def index():
    login = request.cookies.get('Login')
    password = request.cookies.get('Password')
    if login is None or password is None:
        login_html = False
    else:
        db = sqlite3.connect('database.db')
        c = db.cursor()
        c.execute("SELECT login, password FROM users WHERE login = ?", (login,))
        user = c.fetchone()
        if user is None:
            login_html = False
            return render_template("index.html", login=login_html)
        db.commit()
        db.close()
        if password == str(user[1]):
            login_html = True
        else:
            login_html = False

    return render_template("index.html", login=login_html)


@app.route('/auth/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        nickname = request.form.get('nickname')
        email = request.form.get('email')
        password = request.form.get('password')
        password_2 = request.form.get('password_2')

        if not nickname or not password or not password_2 or not email or "@" not in email or password != password_2:
            error = "Некорректная ошибка"

        if not error:
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            db = sqlite3.connect('database.db')
            c = db.cursor()
            c.execute("SELECT MAX(id) FROM users")
            last_user_id = c.fetchone()[0]
            if last_user_id is None:
                next_user_id = 1
            else:
                next_user_id = last_user_id + 1
            expires = datetime.datetime.now() + datetime.timedelta(days=365)  # 1 год
            resp = make_response(redirect('/'))
            resp.set_cookie('Password', str(hashed_password), expires=expires)
            resp.set_cookie('Login', str(nickname), expires=expires)
            c.execute("INSERT INTO users (id, login, password, email) VALUES (?, ?, ?, ?)", (next_user_id, nickname, hashed_password, email))
            db.commit()
            db.close()
            return resp

    return render_template("register.html", error=error)

@app.route('/auth/profile')
def profile():
    return render_template("profile.html")

@app.route('/auth/login')
def login():
    error = None
    if request.method == 'POST':
        nickname = request.form.get('login')
        email = request.form.get('email')
        password = request.form.get('password')
        if not nickname or not password or not email or "@" not in email:
            error = "Некорректная ошибка"

    return render_template("login.html")

if __name__ == "__main__":
    app.run(debug=False)
