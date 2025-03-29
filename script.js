var canvas = new handwriting.Canvas(document.getElementById("canvas"), 3);
canvas.setCallBack(function (data, err) {
    if (err) throw err;
    else {
        document.getElementById("recognition-result").innerText = "Распознано: " + data;
        sessionStorage.setItem('recognizedExpression', data);
    }
});

// Переключение между режимами "Лапы", "Нос", "Зубы", "Бинарный" и "AI Mode"
document.getElementById("paws-mode").addEventListener("click", () => {
    document.querySelector(".paws-mode").style.display = "block";
    document.querySelector(".nose-mode").style.display = "none";
    document.querySelector(".teeth-mode").style.display = "none";
    document.querySelector(".binary-mode").style.display = "none";
    document.querySelector(".ai-mode").style.display = "none";
    document.getElementById("paws-mode").classList.add("active");
    document.getElementById("nose-mode").classList.remove("active");
    document.getElementById("teeth-mode").classList.remove("active");
    document.getElementById("binary-mode").classList.remove("active");
    document.getElementById("ai-mode").classList.remove("active");
});

document.getElementById("nose-mode").addEventListener("click", () => {
    document.querySelector(".paws-mode").style.display = "none";
    document.querySelector(".nose-mode").style.display = "block";
    document.querySelector(".teeth-mode").style.display = "none";
    document.querySelector(".binary-mode").style.display = "none";
    document.querySelector(".ai-mode").style.display = "none";
    document.getElementById("nose-mode").classList.add("active");
    document.getElementById("paws-mode").classList.remove("active");
    document.getElementById("teeth-mode").classList.remove("active");
    document.getElementById("binary-mode").classList.remove("active");
    document.getElementById("ai-mode").classList.remove("active");
});

document.getElementById("teeth-mode").addEventListener("click", () => {
    document.querySelector(".paws-mode").style.display = "none";
    document.querySelector(".nose-mode").style.display = "none";
    document.querySelector(".teeth-mode").style.display = "block";
    document.querySelector(".binary-mode").style.display = "none";
    document.querySelector(".ai-mode").style.display = "none";
    document.getElementById("teeth-mode").classList.add("active");
    document.getElementById("paws-mode").classList.remove("active");
    document.getElementById("nose-mode").classList.remove("active");
    document.getElementById("binary-mode").classList.remove("active");
    document.getElementById("ai-mode").classList.remove("active");
});

document.getElementById("binary-mode").addEventListener("click", () => {
    document.querySelector(".paws-mode").style.display = "none";
    document.querySelector(".nose-mode").style.display = "none";
    document.querySelector(".teeth-mode").style.display = "none";
    document.querySelector(".binary-mode").style.display = "block";
    document.querySelector(".ai-mode").style.display = "none";
    document.getElementById("binary-mode").classList.add("active");
    document.getElementById("paws-mode").classList.remove("active");
    document.getElementById("nose-mode").classList.remove("active");
    document.getElementById("teeth-mode").classList.remove("active");
    document.getElementById("ai-mode").classList.remove("active");
});

document.getElementById("ai-mode").addEventListener("click", () => {
    document.querySelector(".paws-mode").style.display = "none";
    document.querySelector(".nose-mode").style.display = "none";
    document.querySelector(".teeth-mode").style.display = "none";
    document.querySelector(".binary-mode").style.display = "none";
    document.querySelector(".ai-mode").style.display = "block";
    document.getElementById("ai-mode").classList.add("active");
    document.getElementById("paws-mode").classList.remove("active");
    document.getElementById("nose-mode").classList.remove("active");
    document.getElementById("teeth-mode").classList.remove("active");
    document.getElementById("binary-mode").classList.remove("active");
});
canvas.setLineWidth(5);
canvas.setOptions({
    language: "en",
    numOfReturn: 1
});

// Операции для режима "Лапы"
function clearDisplay() {
    document.getElementById("display").value = '';
}

function appendToDisplay(value) {
    document.getElementById("display").value += value;
}

function calculate() {
    try {
        let expression = document.getElementById('display').value;
        expression = expression.replace(/(\d+)\s*%\s*([+-/*])\s*(\d+)/g, (match, p1, p2, p3) => {
            const percent = parseFloat(p1) / 100;
            return `(${p3} ${p2} (${p3} * ${percent}))`;
        });
        expression = expression.replace(/x/g, '*');
        expression = expression.replace(/:/g, '/');
        expression = expression.replace(/,/g, '.'); // Заменяем запятую на точку для вычисления
        document.getElementById('display').value = eval(expression);
    } catch (e) {
        document.getElementById('display').value = 'Ошибка';
    }
}

function calculateSqrt() {
    try {
        const currentValue = document.getElementById('display').value;
        const result = Math.sqrt(parseFloat(currentValue.replace(/,/g, '.'))); // Заменяем запятую на точку для вычисления
        document.getElementById('display').value = result;
    } catch (e) {
        document.getElementById('display').value = 'Ошибка';
    }
}

function toggleSign() {
    let display = document.getElementById("display");
    if (display.value.startsWith('-')) {
        display.value = display.value.slice(1);
    } else {
        display.value = '-' + display.value;
    }
}

function toggleTeethSign() {
    let display = document.getElementById("teeth-display");
    if (display.value.startsWith('-')) {
        display.value = display.value.slice(1);
    } else {
        display.value = '-' + display.value;
    }
}

function toggleBinarySign() {
    let display = document.getElementById("binary-display");
    if (display.value.startsWith('-')) {
        display.value = display.value.slice(1);
    } else {
        display.value = '-' + display.value;
    }
}

function calculatePercent() {
    let display = document.getElementById("display");
    let value = parseFloat(display.value) / 100;
    display.value = value;
}

function backspace() {
    let display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

// Функции для режима "Нос"
function recognize() {
    canvas.recognize();
}

function calculateRecognized() {
    const recognizedExpression = sessionStorage.getItem('recognizedExpression');
    if (recognizedExpression) {
        try {
            // Заменяем 'r' перед числом на 'Math.sqrt'
            let expression = recognizedExpression.replace(/v(\d+)/g, 'Math.sqrt($1)');

            // Прочие замены для обработки выражений
            expression = expression.replace(/x/g, '*').replace(/:/g, '/');
            expression = expression.replace(/(\d+)\s*%\s*([+-/*])\s*(\d+)/g, (match, p1, p2, p3) => {
                const percent = parseFloat(p1) / 100;
                return `(${p3} ${p2} (${p3} * ${percent}))`;
            });
            expression = expression.replace(/,/g, '.'); // Заменяем запятую на точку для вычисления

            // Обрабатываем выражение при помощи math.js
            const result = math.evaluate(expression);
            document.getElementById('calculation-result').innerHTML = `Результат: ${result}`;
        } catch (e) {
            console.error(e);
            document.getElementById('calculation-result').innerHTML = 'Ошибка в примере';
        }
    } else {
        document.getElementById('calculation-result').innerHTML = 'Сначала распознайте пример';
    }
}

function appendToTeethDisplay(value) {
    document.getElementById("teeth-display").value += value;
}

function clearTeethDisplay() {
    document.getElementById("teeth-display").value = '';
}

function calculateTeeth() {
    try {
        let expression = document.getElementById('teeth-display').value;

        // Логические операции
        expression = expression.replace('&', '&&');
        expression = expression.replace('|', '||');
        expression = expression.replace('^', '!==');
        expression = expression.replace('~', '!');

        expression = expression.replace(/x/g, '*');
        expression = expression.replace(/:/g, '/');
        expression = expression.replace(/,/g, '.'); // Заменяем запятую на точку для вычисления

        // Вычисляем результат
        document.getElementById('teeth-display').value = eval(expression);
    } catch (e) {
        document.getElementById('teeth-display').value = 'Ошибка';
    }
}

function backspaceTeeth() {
    let display = document.getElementById("teeth-display");
    display.value = display.value.slice(0, -1);
}

// Добавляем функции для x² и x³ в режим "Зубы"
function calculateSquare() {
    try {
        const currentValue = document.getElementById('teeth-display').value;
        const result = Math.pow(parseFloat(currentValue), 2); // Возведение в квадрат

        document.getElementById('teeth-display').value = result;
    } catch (e) {
        document.getElementById('teeth-display').value = 'Ошибка';
    }
}

function calculateCube() {
    try {
        const currentValue = document.getElementById('teeth-display').value;
        const result = Math.pow(parseFloat(currentValue), 3); // Возведение в куб

        document.getElementById('teeth-display').value = result;
    } catch (e) {
        document.getElementById('teeth-display').value = 'Ошибка';
    }
}

// Функции для режима "Бинарный"
function appendToBinaryDisplay(value) {
    document.getElementById("binary-display").value += value;
}

function clearBinaryDisplay() {
    document.getElementById("binary-display").value = '';
}

function calculateBinary() {
    try {
        let expression = document.getElementById('binary-display').value;
        expression = expression.replace(/,/g, '.'); // Заменяем запятую на точку для вычисления

        // Обрабатываем выражение при помощи math.js
        const result = math.evaluate(expression);
        document.getElementById('binary-result').innerHTML = `Результат: ${result.toString(2)}`;
    } catch (e) {
        document.getElementById('binary-result').innerHTML = 'Ошибка в примере';
    }
}

function backspaceBinary() {
    let display = document.getElementById("binary-display");
    display.value = display.value.slice(0, -1);
}

// Функция для отправки запроса на сервер и получения ответа
async function askAI(model) {
    const question = document.getElementById('ai-display').value;
    const response = await fetch('d3.aurorix.net:25013/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, model })
    });
    const data = await response.json();
    document.getElementById('ai-result').innerText = data.answer;
}

// Функция для отправки сообщения в чат
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;

    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML += `<div><strong>Вы:</strong> ${message}</div>`;
    input.value = '';

    try {
        const response = await fetch('https://bot.gulyatv.ru/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: message, model: 'barkgpt' })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received response from server:", data);
        messagesContainer.innerHTML += `<div><strong>BarkGPT Maths:</strong> ${data.answer}</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        messagesContainer.innerHTML += `<div><strong>Ошибка:</strong> Не удалось получить ответ от сервера.</div>`;
    }
}
