// Функция для получения куки по имени
function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split('=');
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// Функция для установки куки
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Устанавливаем время истечения куки
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Функция для добавления ID пиццы и количества в куки
function addPizzaToCookie(pizzaId, quantity) {
    let existingData = getCookie('pizza_data');
    let dataObject = existingData ? JSON.parse(existingData) : {}; // Преобразуем строку в объект

    if (dataObject[pizzaId]) {
        dataObject[pizzaId] = Math.min(dataObject[pizzaId] + quantity, 99); // Увеличиваем количество, не превышая 99
    } else {
        dataObject[pizzaId] = quantity; // Устанавливаем начальное количество
    }

    setCookie('pizza_data', JSON.stringify(dataObject), 30); // Сохраняем обновленный список (на 30 дней)
}

// Функция для уменьшения количества пиццы в куках
function updatePizzaQuantityInCookie(pizzaId, quantity) {
    let existingData = getCookie('pizza_data');
    let dataObject = existingData ? JSON.parse(existingData) : {};

    if (dataObject[pizzaId]) {
        dataObject[pizzaId] = Math.max(dataObject[pizzaId] - quantity, 0); // Уменьшаем количество, не меньше 0
        if (dataObject[pizzaId] === 0) {
            delete dataObject[pizzaId]; // Удаляем пиццу, если количество стало 0
        }
        setCookie('pizza_data', JSON.stringify(dataObject), 30); // Сохраняем обновленный список
    }
}

// Переключение класса для анимации
document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', function() {
        const pizzaPost = this.closest('.pizza-post'); // Получаем родительский элемент .pizza-post
        const pizzaImage = pizzaPost.querySelector('.pizza-image'); // Ищем .pizza-image внутри .pizza-post
        pizzaImage.classList.toggle('flipped'); // Переключаем класс для анимации
    });
});

// Открытие модального окна при нажатии на кнопку "Заказать"
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pizzaModal');
    const closeModal = modal.querySelector('.close-modal');
    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pizzaPost = this.closest('.pizza-post');
            const pizzaId = pizzaPost.getAttribute('data-id');
            const pizzaTitle = pizzaPost.querySelector('.pizza-title').textContent;
            const pizzaPrice = pizzaPost.querySelector('.pizza-price').textContent;

            addPizzaToCookie(pizzaId, 1); // Добавляем 1 пиццу

            // Открытие модального окна
            modal.style.display = 'flex';

            // Вставка данных в модальное окно
            modal.querySelector('.modal-pizza-title').textContent = pizzaTitle;
            modal.querySelector('.modal-pizza-price').textContent = `Цена: ${pizzaPrice}`;
        });
    });

    // Закрытие модального окна при нажатии на крестик
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Открытие модального окна при нажатии на кнопку "Корзина"
document.addEventListener('DOMContentLoaded', () => {
    const modalCart = document.getElementById('cartModal');
    const closeModalCart = modalCart.querySelector('.close-modal-cart');
    const cartButtons = document.querySelectorAll('.cart-button');

    const pizzaData = {
        "1": { name: "Маргарита", price: "199 руб.", imageUrl: "icon_8.png" },
        "2": { name: "Пепперони", price: "249 руб.", imageUrl: "icon_8.png" },
        "3": { name: "Гавайская", price: "299 руб.", imageUrl: "icon_8.png" },
        "4": { name: "Четыре сыра", price: "349 руб.", imageUrl: "icon_8.png" },
        "5": { name: "BBQ Chicken", price: "399 руб.", imageUrl: "icon_8.png" }
    };

    function displayPizzaInfo(pizzaDataObject) {
        const cartItemsContainer = document.getElementById('cartItems');

        // Очищаем контейнер
        cartItemsContainer.innerHTML = '';

        // Проверяем наличие каждого элемента и выводим данные
        for (const [id, quantity] of Object.entries(pizzaDataObject)) {
            const pizza = pizzaData[id];
            if (pizza) {
                const totalPrice = parseInt(pizza.price.replace(/\D/g, '')) * quantity; // Расчитываем общую цену
                cartItemsContainer.innerHTML += `
                    <div class="cart-pizza-item">
                        <img src="${imageBasePath + pizza.imageUrl}" alt="${pizza.name}" class="cart-pizza-image">
                        <div class="cart-pizza-info">
                            <p class="cart-pizza-title">${pizza.name}${quantity > 1 ? ` <span class="pizza-quantity">x${quantity}</span>` : ''}</p>
                            <p class="cart-pizza-price">${totalPrice} руб.</p>
                        </div>
                        <button class="remove-pizza-button" data-id="${id}"><img src="${imageBasePath}remove_icon.png" alt="Удалить" class="remove-icon"></button>
                    </div>`;
            }
        }

        // Если нет заказов
        if (Object.keys(pizzaDataObject).length === 0) {
            cartItemsContainer.innerHTML = `<h2 class="cart-text-dont-pizza">У вас нет заказов.</h2>`;
        }

        // Обработчик для кнопок удаления
        document.querySelectorAll('.remove-pizza-button').forEach(button => {
            button.addEventListener('click', function() {
                const pizzaId = this.getAttribute('data-id');
                updatePizzaQuantityInCookie(pizzaId, 1); // Уменьшаем количество на 1

                // Обновляем отображение корзины
                const updatedData = getCookie('pizza_data');
                const pizzaDataObject = updatedData ? JSON.parse(updatedData) : {};
                displayPizzaInfo(pizzaDataObject);
            });
        });
    }

    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pizzaDataString = getCookie('pizza_data');
            const pizzaDataObject = pizzaDataString ? JSON.parse(pizzaDataString) : {};

            modalCart.style.display = 'flex';

            // Отображаем информацию о пиццах в корзине
            displayPizzaInfo(pizzaDataObject);
        });
    });

    // Закрытие модального окна при нажатии на крестик
    closeModalCart.addEventListener('click', () => {
        modalCart.style.display = 'none';
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modalCart) {
            modalCart.style.display = 'none';
        }
    });
});
