document.addEventListener("DOMContentLoaded", () => {
 


// calendar
    flatpickr("#datepicker", {
        enableTime: false,
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
        onChange: function (selectedDates, dateStr, instance) {
            console.log("Selected date:", dateStr);
        },
    });
    // music on/off
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');

    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.textContent = 'MUSIC ON';
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = 'MUSIC OFF';
        }
    });
    
    // title animation
    const title = document.getElementById("dynamic-title");
    let interval;

    function glitchEffect() {
        title.style.clipPath = `inset(${randomPercentage()}% ${randomPercentage()}% ${randomPercentage()}% ${randomPercentage()}%)`;
        title.style.opacity = Math.random();
    }

    function randomPercentage() {
        return Math.floor(Math.random() * 80);
    }

    interval = setInterval(glitchEffect, 200);

    setTimeout(() => {
        clearInterval(interval);
        title.style.clipPath = "none";
        title.style.opacity = 1;
    }, 5000);

    // click sound when click
    const analyzeButton = document.getElementById("analyze-btn");
    const clickSound = document.getElementById("click-sound");
    const responseButton = document.getElementById("AiResponse-btn");

    analyzeButton.addEventListener("click", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play();
        }

        analyzeAndGenerateArt();
    });
    responseButton.addEventListener("click", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    });

    // clear
    const artContainer = document.getElementById("art-container");

    function clearArt() {
        artContainer.innerHTML = '';
    }

    // use emotion API and generate art
    function analyzeAndGenerateArt() {
        const text = document.getElementById("input-text").value.trim();

        if (!text) {
            alert("Please enter some text!");
            return;
        }

        // connected to API
        fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Response data:", data);

                const label = data[0]?.label || "Unknown";
                const score = (data[0]?.score || 0).toFixed(2);

                // show the result
                document.getElementById("result").innerText = `Emotion: ${label}, Score: ${score}`;

                generateArt(label.toLowerCase());
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("result").innerText = "An error occurred while analyzing.";
            });
    }


const analyzeBtn = document.getElementById('analyze-btn');
const aiResponseBtn = document.getElementById('AiResponse-btn');
const diaryText = document.getElementById('diary-text');
const gptText = document.getElementById('GPT-text');
const inputText = document.getElementById('input-text').value;  // 获取输入框的内容

// GPT API
const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const GPT_API_KEY = "1";

async function getGPTResponse(inputText) {
    const response = await fetch(GPT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GPT_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant.You speaks in a more colloquial manner. You're funny and you're kind."
                },
                {
                    role: "user",
                    content: inputText
                }
            ],
            temperature: 0.2,
            max_tokens: 60,
            top_p: 1,
            frequency_penalty: 0.8,
            presence_penalty: 0.8,

        }),
    }).catch(evt => console.error(evt));

    console.log(" api key: ", GPT_API_KEY);

    const data = await response.json();
    if (data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim();
    } else {
        throw new Error("No response from GPT-4");
    }
}


// generate response after click the response button
aiResponseBtn.addEventListener('click', async () => {
    const inputText = document.getElementById('input-text').value;  // get the input text
    if (inputText.trim()) {
        gptText.value = 'Loading...';
        const response = await getGPTResponse(inputText);
        gptText.value = response; // Fill GPT responses into the text box
        speakText(response);
    }
});
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; 
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 3;
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Speech failed.');
    }
}







  // differnet emotions relate to different colors and shapes
const emotionColors = {
    anger: ['black', 'red', 'lines'],
    sadness: ['black', 'blue', 'dots'],
    joy: ['black', 'yellow', 'shapes'],
    neutral: ['black', 'gray', 'neutral'],
    fear: ['black', 'purple', 'waves'],
    disapproval: ['black', 'red', 'crosses']
};

let currentEmotion = "neutral";

function generateArt(emotion) {
    currentEmotion = emotion;
    const artContainer = document.getElementById('art-container');
    if (!artContainer) {
        console.error("Art container not found in the DOM.");
        return;
    }

    clearArt();
    const canvas = document.createElement('canvas');
    artContainer.appendChild(canvas);
    canvas.width = artContainer.clientWidth;
    canvas.height = artContainer.clientHeight;

    const ctx = canvas.getContext('2d');
    animate(canvas);
}

function generateAbstractArt(ctx, canvas, bgColor, fgColor, style) {
    // BG color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // generate random
    const numElements = 100;
    for (let i = 0; i < numElements; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        if (style === 'dots') {
            drawDot(ctx, x, y, fgColor);
        } else if (style === 'lines') {
            drawLine(ctx, x, y, fgColor, canvas);
        } else if (style === 'shapes') {
            drawShape(ctx, x, y, fgColor, canvas);
        } else if (style === 'waves') {
            drawWave(ctx, x, y, fgColor, canvas);
        } else if (style === 'crosses') {
            drawCross(ctx, x, y, fgColor, canvas);
        }
    }
}

// Draw animated dots (falling effect)
function drawDot(ctx, x, y, color, canvas) {
    const radius = Math.random() * 4.5 + 1;
    let velocityY = Math.random() * 0.05;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;
    ctx.fill();

    y += velocityY;

    if (y > artContainer.height) {
        y = 0;
    }
}


// draw lines
function drawLine(ctx, x, y, color, canvas) {
    const x2 = Math.random() * canvas.width;
    const y2 = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;
    ctx.stroke();
}

// draw shapes
function drawShape(ctx, x, y, color, canvas) {
    const size = Math.random() * 50 + 20;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size / 2);
    ctx.lineTo(x, y + size);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;
    ctx.fill();
}
// Draw wavy lines (fear)
function drawWave(ctx, x, y, color, canvas) {
    ctx.beginPath();
    const amplitude = Math.random() * 20 + 10;
    const frequency = Math.random() * 0.05 + 0.05;

    for (let i = 0; i < canvas.width; i += 10) {
        const waveY = y + Math.sin(i * frequency + performance.now() / 100) * amplitude;
        ctx.lineTo(i, waveY);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;
    ctx.stroke();
}

// Draw crosses (disapproval)
function drawCross(ctx, x, y, color, canvas) {
    const size = Math.random() * 20 + 10;
    const shake = Math.sin(performance.now() / 100) * 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;

    
    ctx.beginPath();
    ctx.moveTo(x - size / 2 + shake, y - size / 2 + shake);
    ctx.lineTo(x + size / 2 + shake, y + size / 2 + shake);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + size / 2 + shake, y - size / 2 + shake);
    ctx.lineTo(x - size / 2 + shake, y + size / 2 + shake);
    ctx.stroke();
}

function animate(canvas) {
    const ctx = canvas.getContext('2d');

    function draw() {
        const [bgColor, fgColor, style] = emotionColors[currentEmotion] || emotionColors['neutral'];

        generateAbstractArt(ctx, canvas, bgColor, fgColor, style);

        requestAnimationFrame(draw);
    }

    draw();
}

})


