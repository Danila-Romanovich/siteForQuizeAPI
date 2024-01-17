'strict'

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById('start-btn');
    const leftPanel = document.querySelector('.left-panel');
    const gameBoard = document.querySelector('.game-board');
    const param = document.querySelector('.param');
    const answersContainer = document.querySelector('.game-board--buttons');
    const navBtns = document.querySelector('.game-board--nav-btn');

    btn.addEventListener('click', () => {
        updateGameParameters();
        paramGame();
    })

    function updateGameParameters() {
        const categorySelect = document.getElementById('category');
        const difficultySelect = document.getElementById('difficulty');
        const answerTypeSelect = document.getElementById('answerType');

        const selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
        const selectedDifficulty = difficultySelect.options[difficultySelect.selectedIndex].text;
        const selectedAnswerType = answerTypeSelect.options[answerTypeSelect.selectedIndex].text;

        // Обновление текста в блоке "Параметры игры"
        const categoryText = document.querySelector('.left-panel--text:nth-child(1) span');
        const difficultyText = document.querySelector('.left-panel--text:nth-child(2) span');
        const answerTypeText = document.querySelector('.left-panel--text:nth-child(3) span');

        categoryText.textContent = selectedCategory;
        difficultyText.textContent = selectedDifficulty;
        answerTypeText.textContent = selectedAnswerType;

        // Показ блока "Параметры игры", если он скрыт
        leftPanel.classList.remove('hide');
    }

    function paramGame() {
        // Получите значения параметров из формы
        const category = document.getElementById('category').value;
        const difficulty = document.getElementById('difficulty').value;
        const answerType = document.getElementById('answerType').value;

        // Формируйте URL-запрос с полученными параметрами
        const baseUrl = 'http://localhost:8080/api/trivia/question';
        const queryParams = `?category=${category}&difficulty=${difficulty}&type=${answerType}`;
        var url = baseUrl + queryParams;

        fetch(url)
            .then(response => response.json())
            .then(questions => {
                console.log(questions);
                startGame(questions);
            })
            .catch(error => console.error('Ошибка:', error));
    }

    function startGame(questions) {
        let currentQuestionIndex = 0;

        const totalQuestions = questions.length;
        const results = [];


        param.classList.add('hide');

        gameBoard.classList.remove('hide');


        function displayQuestion() {

            const currentQuestion = questions[currentQuestionIndex];

            const questionNumber = document.querySelector('#question-num');
            questionNumber.textContent = `Вопрос №${currentQuestionIndex + 1}`;

            // Отображение вопроса
            const questionContainer = document.querySelector('.game-board--question');
            questionContainer.textContent = `${currentQuestion.question}`;

            // Объединение правильного ответа и неверных ответов, а затем перемешивание массива
            const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
            const shuffledAnswers = shuffleArray(allAnswers);
            answersContainer.innerHTML = '';

            shuffledAnswers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.classList.add('button');
                button.textContent = answer;
                button.addEventListener('click', () => handleAnswer(answer, index));
                answersContainer.appendChild(button);
            });


        }

        // Функция для перемешивания массива
        function shuffleArray(array) {
            const shuffledArray = array.slice();
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray;
        }


        function handleAnswer(selectedAnswer, selectedIndex) {
            const currentQuestion = questions[currentQuestionIndex];

            // Проверка правильности ответа
            const isCorrect = selectedAnswer === currentQuestion.correct_answer;

            if (isCorrect) {
                results.push(true);
            } else {
                results.push(false);
            }

            // Подсветка кнопок
            const buttons = document.querySelectorAll('.game-board--buttons button');

            buttons.forEach((button, index) => {
                button.disabled = true;

                if (index === selectedIndex) {
                    button.classList.add(isCorrect ? 'button_correct' : 'button_incorrect');
                } else if (button.textContent === currentQuestion.correct_answer) {
                    button.classList.add('button_correct');
                }

            });

            setTimeout(() => {

                currentQuestionIndex++;

                if (currentQuestionIndex < totalQuestions) {
                    displayQuestion();
                } else {
                    displayStatistics();
                }
            }, 2000);
        }

        function displayStatistics() {
            const correctAnswers = results.filter(result => result).length;
            const incorrectAnswers = totalQuestions - correctAnswers;

            const questionNumber = document.querySelector('#question-num');
            questionNumber.textContent = ``;
            const questionContainer = document.querySelector('.game-board--question');
            questionContainer.textContent = `Вы ответили правильно на ${correctAnswers} из ${totalQuestions}`;

            answersContainer.innerHTML = '';
            navBtns.innerHTML = '';

            const backBtn = document.createElement('button');
            backBtn.classList.add('button');
            backBtn.textContent = "Сыграть снова";
            backBtn.addEventListener('click', () => {
                leftPanel.classList.add('hide');
                gameBoard.classList.add('hide');
                param.classList.remove('hide');
            });
            answersContainer.appendChild(backBtn);


        }

        // Начало игры
        displayQuestion();


    }

})



