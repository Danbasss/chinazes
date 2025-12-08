const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreCounter = document.getElementById('score-counter');
const quizWrapper = document.getElementById('quiz-wrapper');
const resultScreen = document.getElementById('result-screen');
const finalScoreText = document.getElementById('final-score');

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const countSelect = document.getElementById('question-count');
const difficultyLabel = document.getElementById('difficulty-label');
const autoNextCheckbox = document.getElementById('auto-next');

const topRestartBtn = document.getElementById('top-restart-btn');

let currentQuestionIndex = 0;
let score = 0;
let allQuestions = [];
let activeQuestions = [];

// Відновлення налаштувань
const savedCount = localStorage.getItem('quiz_question_count');
if (savedCount) countSelect.value = savedCount;

const savedAutoNext = localStorage.getItem('quiz_auto_next');
if (savedAutoNext === 'true') autoNextCheckbox.checked = true;

topRestartBtn.addEventListener('click', () => location.reload());

function updateDifficultyLabel() {
    const val = parseInt(countSelect.value);
    difficultyLabel.className = '';
    if (val === 5) {
        difficultyLabel.innerText = "ЛЕГКИЙ";
        difficultyLabel.classList.add('diff-easy');
    } else if (val === 10) {
        difficultyLabel.innerText = "СЕРЕДНІЙ";
        difficultyLabel.classList.add('diff-medium');
    } else if (val === 15) {
        difficultyLabel.innerText = "ВАЖКИЙ";
        difficultyLabel.classList.add('diff-hard');
    } else if (val === 20) {
        difficultyLabel.innerText = "THE GOAT";
        difficultyLabel.classList.add('diff-goat');
    }
}

countSelect.addEventListener('change', () => {
    updateDifficultyLabel();
    localStorage.setItem('quiz_question_count', countSelect.value);
});

autoNextCheckbox.addEventListener('change', () => {
    localStorage.setItem('quiz_auto_next', autoNextCheckbox.checked);
});

async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json'); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allQuestions = await response.json();
        startBtn.disabled = false;
        updateDifficultyLabel();
    } catch (error) {
        console.error("Помилка:", error);
        questionElement.innerText = "Помилка завантаження питань.";
    }
}

startBtn.addEventListener('click', () => {
    let count = parseInt(countSelect.value);
    if (count > allQuestions.length) count = allQuestions.length;
    activeQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
    startScreen.style.display = 'none';
    quizWrapper.style.display = 'block';
    startQuiz();
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreCounter.innerText = `Рахунок: 0`;
    nextButton.innerHTML = "Наступне питання";
    resultScreen.style.display = "none";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = activeQuestions[currentQuestionIndex];
    document.querySelector('.score-display').innerHTML = 
        `Питання: <span id="current-q">${currentQuestionIndex + 1}</span>/${activeQuestions.length}`;
    questionElement.innerHTML = currentQuestion.question;
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add('btn');
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = 'none';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
        scoreCounter.innerText = `Рахунок: ${score}`;
    } else {
        selectedBtn.classList.add('wrong');
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") button.classList.add('correct');
        button.disabled = true;
    });
    nextButton.style.display = 'block';
    if (autoNextCheckbox.checked) setTimeout(() => nextButton.click(), 1000);
}

function showScore() {
    quizWrapper.style.display = "none";
    const total = activeQuestions.length;
    const percentage = Math.round((score / total) * 100);
    finalScoreText.innerHTML = `Набрано ${score} з ${total} (${percentage}%)`;
    resultScreen.style.display = "block";
    document.getElementById('restart-btn').style.display = "inline-block";
    playReaction(percentage >= 50);
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuestions.length) showQuestion();
    else showScore();
});

loadQuestions();

const videoCorrect = document.getElementById("video-correct");
const videoWrong = document.getElementById("video-wrong");

function playReaction(isWin) {
    const video = isWin ? videoCorrect : videoWrong;
    videoCorrect.classList.add("hidden");
    videoCorrect.classList.remove("show");
    videoWrong.classList.add("hidden");
    videoWrong.classList.remove("show");
    video.currentTime = 0;
    video.classList.remove("hidden");
    video.classList.add("show");
    video.play();
}

// Логіка меню
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("main-nav");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove("active");
            }
        });
    }
});