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
            login_yes BOOLEAN,
            nickname TEXT,
            password TEXT,
            email TEXT
        )
    ''')
    db.commit()
    db.close()

create()

@app.route('/', methods=['GET'])
def index():
    login_to_tipy_site = request.cookies.get('LoginToTipySite')
    id_to_tipy_site = request.cookies.get('id_ToTipySite')
    login_to_tipy_site = login_to_tipy_site == 'True'
    if login_to_tipy_site and id_to_tipy_site:
        int(id_to_tipy_site)
        db = sqlite3.connect('database.db')
        c = db.cursor()
        c.execute("SELECT login_yes FROM users WHERE id = ?", (id_to_tipy_site,))
        user = c.fetchone()
        db.commit()
        db.close()
        if user:
            if user[0] == login_to_tipy_site:
                login_html = True
            else:
                login_html = False
        else:
            login_html = False
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
            login_yes = True
            expires = datetime.datetime.now() + datetime.timedelta(days=365)  # 1 год
            print(next_user_id, login_yes)
            resp = make_response(redirect('/'))
            resp.set_cookie('id_ToTipySite', str(next_user_id), expires=expires)
            resp.set_cookie('LoginToTipySite', str(login_yes), expires=expires)
            c.execute("INSERT INTO users (id, login_yes, nickname, password, email) VALUES (?, ?, ?, ?, ?)", (next_user_id, login_yes, nickname, hashed_password, email))
            db.commit()
            db.close()
            return resp

    return render_template("register.html", error=error)

if __name__ == "__main__":
    app.run(debug=False)
