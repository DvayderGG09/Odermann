const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('database.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Для обработки JSON запросов

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).send('Ошибка базы данных');
        } else {
            res.json(rows); // Возвращаем данные в формате JSON
        }
    });
});


document.getElementById('LoginForm').addEventListener('submit', function(event) {
    const nickname = document.getElementById('loginInput').value;
    const email = document.querySelector('input[name="email"]').value; // Получаем значение email
    const password = document.querySelector('input[name="password"]').value; // Получаем значение пароля

    // Массив проверок
    const checks = [
        { condition: !nickname, message: 'Введите никнейм' },
        { condition: !email, message: 'Введите email' },
        { condition: !password, message: 'Введите пароль' },
        { condition: password !== password_2, message: 'Пароль неправильный' },
    ];

    // Проверка условий
    for (const check of checks) {
        if (check.condition) {
            event.preventDefault(); // Отменяем отправку формы
            document.getElementById('modalMessage').innerText = check.message; // Устанавливаем сообщение
            document.getElementById('modal').style.display = 'flex'; // Открываем модальное окно
            break; // Прерываем цикл при первой ошибке
        }
    }
});

function closeModal() {
    document.getElementById('modal').style.display = 'none'; // Закрываем модальное окно
}
