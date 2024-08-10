document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', function() {
        const pizzaImage = this.previousElementSibling; // Получаем .pizza-image
        pizzaImage.classList.toggle('flipped'); // Переключаем класс для анимации
    });
});
