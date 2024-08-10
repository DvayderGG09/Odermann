document.getElementById('registerForm').addEventListener('submit', function(event) {
    const nickname = document.getElementById('nicknameInput').value;
    const email = document.querySelector('input[name="email"]').value; // Получаем значение email
    const password = document.querySelector('input[name="password"]').value; // Получаем значение пароля
    const password_2 = document.querySelector('input[name="password_2"]').value; // Получаем значение подтверждения пароля

    // Массив проверок
    const checks = [
        { condition: !nickname, message: 'Введите никнейм' },
        { condition: nickname.length > 18, message: 'Ваш никнейм слишком длинный' },
        { condition: nickname.length < 3, message: 'Ваш никнейм слишком короткий' },
        { condition: !email, message: 'Введите email' },
        { condition: !email.includes('@'), message: 'Ваш email некорректный' },
        { condition: email.length > 40, message: 'Ваш email слишком длинный' },
        { condition: email.length < 8, message: 'Ваш email слишком короткий' },
        { condition: !password, message: 'Введите пароль' },
        { condition: password.length > 30, message: 'Ваш пароль слишком длинный' },
        { condition: password.length < 8, message: 'Ваш пароль слишком короткий' },
        { condition: !password_2, message: 'Потвердите свой пароль' },
        { condition: password !== password_2, message: 'Ваш пароль и повторный пароль не совпадают' },
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
