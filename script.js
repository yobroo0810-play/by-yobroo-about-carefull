
/* =================================================
   A LITTLE SURPRISE FOR YOU
   Interactive Storytelling - Version 3.0
================================================= */


/* =================================================
   1. SELECT HTML ELEMENTS
================================================= */

const progressBar = document.getElementById("progressBar");
const stepNumber = document.getElementById("stepNumber");

const pages = document.querySelectorAll(".page");

const startBtn = document.getElementById("startBtn");

const nameInput = document.getElementById("nameInput");
const nameNextBtn = document.getElementById("nameNextBtn");
const nameError = document.getElementById("nameError");

const moodButtons = document.querySelectorAll(".mood-btn");
const moodNextBtn = document.getElementById("moodNextBtn");
const moodResponse = document.getElementById("moodResponse");

const charmButtons = document.querySelectorAll(".charm-btn");
const charmNextBtn = document.getElementById("charmNextBtn");
const charmResponse = document.getElementById("charmResponse");

const starGameArea = document.getElementById("starGameArea");
const starScore = document.getElementById("starScore");
const starTime = document.getElementById("starTime");
const starFeedback = document.getElementById("starFeedback");
const starNextBtn = document.getElementById("starNextBtn");

const memoryGrid = document.getElementById("memoryGrid");
const matchedPairs = document.getElementById("matchedPairs");
const memoryAttempts = document.getElementById("memoryAttempts");
const memoryFeedback = document.getElementById("memoryFeedback");
const memoryNextBtn = document.getElementById("memoryNextBtn");

const quizButtons = document.querySelectorAll(".quiz-option");
const quizFeedback = document.getElementById("quizFeedback");
const quizNextBtn = document.getElementById("quizNextBtn");

const giftButtons = document.querySelectorAll(".gift-box");
const giftMessage = document.getElementById("giftMessage");
const giftCount = document.getElementById("giftCount");
const giftNextBtn = document.getElementById("giftNextBtn");

const envelope = document.getElementById("envelope");
const envelopeFeedback = document.getElementById("envelopeFeedback");
const letterNextBtn = document.getElementById("letterNextBtn");

const messageHeading = document.getElementById("messageHeading");
const specialMessage = document.getElementById("specialMessage");
const messageFeedback = document.getElementById("messageFeedback");
const heartGardenBtn = document.getElementById("heartGardenBtn");

const heartGarden = document.getElementById("heartGarden");
const heartCountElement = document.getElementById("heartCount");
const heartProgressBar = document.getElementById("heartProgressBar");
const heartFeedback = document.getElementById("heartFeedback");

const restartBtn = document.getElementById("restartBtn");
const shareBtn = document.getElementById("shareBtn");
const soundBtn = document.getElementById("soundBtn");


/* =================================================
   2. GLOBAL VARIABLES
================================================= */

const TOTAL_STEPS = 11;

let currentStep = 1;

let visitorName = "";

let selectedMood = "";

let selectedCharm = "";

let selectedCharmName = "";

let starScoreValue = 0;

let starTimeValue = 30;

let starInterval = null;

let starGameActive = false;

let memoryFirst = null;

let memorySecond = null;

let memoryLocked = false;

let memoryMatches = 0;

let memoryAttemptsValue = 0;

let memoryStarted = false;

let quizCompleted = false;

let openedGifts = new Set();

let envelopeOpened = false;

let typingInterval = null;

let heartCount = 0;

let soundEnabled = false;

let audioContext = null;


/* =================================================
   3. SOUND EFFECT SYSTEM
================================================= */

function playSound(frequency = 600, duration = 0.15) {

    if (!soundEnabled) return;

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();

        const gain = audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            frequency,
            audioContext.currentTime
        );

        gain.gain.setValueAtTime(
            0.12,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);

        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + duration
        );

    } catch (error) {

        console.log("Audio is not available.");

    }

}


/* =================================================
   4. PAGE NAVIGATION
================================================= */

function goToStep(step) {

    if (step < 1 || step > TOTAL_STEPS) return;

    pages.forEach(page => {

        page.classList.remove("active");

        page.setAttribute("aria-hidden", "true");

    });

    const selectedPage =
        document.getElementById("step" + step);

    selectedPage.classList.add("active");

    selectedPage.setAttribute("aria-hidden", "false");

    currentStep = step;

    const percentage = (step / TOTAL_STEPS) * 100;

    progressBar.style.width = percentage + "%";

    stepNumber.textContent =
        String(step).padStart(2, "0") +
        " / " +
        String(TOTAL_STEPS).padStart(2, "0");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    playSound(450 + step * 65);

    if (step === 6 && !memoryStarted) {
        initializeMemoryGame();
    }

    if (step === 11) {
        initializeHeartGarden();
        createConfetti();
    }

}


/* =================================================
   5. STEP 1: WELCOME
================================================= */

startBtn.addEventListener("click", () => {

    goToStep(2);

});


/* =================================================
   6. STEP 2: PERSONALIZATION
================================================= */

nameNextBtn.addEventListener("click", () => {

    const name = nameInput.value.trim();

    if (name.length === 0) {

        nameError.textContent =
            "Please enter your name first! 💗";

        nameInput.focus();

        playSound(250);

        return;

    }

    visitorName = name;

    nameError.textContent = "";

    goToStep(3);

});

nameInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        nameNextBtn.click();
    }

});


/* =================================================
   7. STEP 3: MOOD SELECTION
================================================= */

const moodMessages = {

    happy:
        "Wah, senang mendengarnya! Semoga hari-harimu dipenuhi banyak hal baik. 💗",

    normal:
        "Hari yang biasa juga bisa menjadi hari yang bermakna. Nikmati prosesnya. 🌷",

    tired:
        "Tidak apa-apa untuk beristirahat. Kamu juga berhak memberikan waktu untuk dirimu sendiri. ☁️",

    sad:
        "Tidak apa-apa jika hari ini terasa kurang menyenangkan. Semoga keadaan menjadi lebih baik. 💜"

};

moodButtons.forEach(button => {

    button.addEventListener("click", () => {

        moodButtons.forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedMood = button.dataset.mood;

        moodResponse.textContent =
            moodMessages[selectedMood];

        moodNextBtn.disabled = false;

        playSound(750);

    });

});

moodNextBtn.addEventListener("click", () => {

    if (!selectedMood) return;

    goToStep(4);

});


/* =================================================
   8. STEP 4: LUCKY CHARM
================================================= */

charmButtons.forEach(button => {

    button.addEventListener("click", () => {

        charmButtons.forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedCharm = button.dataset.charm;

        selectedCharmName = button.dataset.charmName;

        charmResponse.textContent =
            selectedCharm +
            " Your companion is " +
            selectedCharmName +
            "!";

        charmNextBtn.disabled = false;

        playSound(850);

    });

});

charmNextBtn.addEventListener("click", () => {

    if (!selectedCharm) return;

    goToStep(5);

});


/* =================================================
   9. STEP 5: CATCH THE STARS
================================================= */

function startStarGame() {

    clearInterval(starInterval);

    starScoreValue = 0;

    starTimeValue = 30;

    starGameActive = true;

    starNextBtn.disabled = true;

    starScore.textContent = "0 / 6";

    starTime.textContent = "30s";

    starFeedback.textContent =
        "Catch the stars! You have 30 seconds.";

    spawnStar();

    starInterval = setInterval(() => {

        starTimeValue--;

        starTime.textContent =
            starTimeValue + "s";

        if (starTimeValue <= 0) {

            clearInterval(starInterval);

            finishStarGame();

        }

    }, 1000);

}


function spawnStar() {

    if (!starGameActive) return;

    starGameArea.innerHTML = "";

    const star = document.createElement("button");

    star.className = "star-target";

    star.textContent = "⭐";

    star.setAttribute("aria-label", "Catch star");

    const maxX = Math.max(
        0,
        starGameArea.clientWidth - 48
    );

    const maxY = Math.max(
        0,
        starGameArea.clientHeight - 48
    );

    star.style.left =
        (Math.random() * maxX) + "px";

    star.style.top =
        (Math.random() * maxY) + "px";

    star.addEventListener("click", () => {

        if (!starGameActive) return;

        starScoreValue++;

        starScore.textContent =
            starScoreValue + " / 6";

        playSound(750 + starScoreValue * 80);

        if (starScoreValue >= 6) {

            clearInterval(starInterval);

            starGameActive = false;

            starTime.textContent = "DONE";

            finishStarGame();

        } else {

            starFeedback.textContent =
                "Amazing! Keep collecting those stars! ✨";

            spawnStar();

        }

    });

    starGameArea.appendChild(star);

}


function finishStarGame() {

    starGameActive = false;

    starGameArea.innerHTML = `
        <div class="game-intro">
            <span>${starScoreValue >= 6 ? "🏆" : "⏰"}</span>

            <p>
                ${
                    starScoreValue >= 6
                    ? "You collected all the stars!"
                    : "Time is up! Try once more."
                }
            </p>

            ${
                starScoreValue < 6
                ? '<button class="small-btn" id="retryStarBtn">Try Again</button>'
                : ""
            }
        </div>
    `;

    if (starScoreValue >= 6) {

        starFeedback.textContent =
            "Excellent! You unlocked the next level. 🌟";

        starNextBtn.disabled = false;

        playSound(1100, 0.3);

    } else {

        starFeedback.textContent =
            "Don't give up! You can try again.";

        document.getElementById("retryStarBtn")
            .addEventListener("click", startStarGame);

    }

}


document.getElementById("startStarGameBtn")
    .addEventListener("click", startStarGame);


starNextBtn.addEventListener("click", () => {

    if (starScoreValue < 6) return;

    clearInterval(starInterval);

    goToStep(6);

});


/* =================================================
   10. STEP 6: MEMORY MATCH
================================================= */

const memorySymbols = [
    "🌷",
    "🌙",
    "⭐",
    "🦋"
];

function initializeMemoryGame() {

    memoryStarted = true;

    memoryMatches = 0;

    memoryAttemptsValue = 0;

    memoryFirst = null;

    memorySecond = null;

    memoryLocked = false;

    memoryNextBtn.disabled = true;

    matchedPairs.textContent = "0 / 4";

    memoryAttempts.textContent = "0";

    memoryFeedback.textContent =
        "Find all four matching pairs!";

    // Setiap simbol muncul dua kali.

    let deck = [...memorySymbols, ...memorySymbols];

    // Acak posisi kartu.

    deck = deck.sort(() => Math.random() - 0.5);

    memoryGrid.innerHTML = "";

    deck.forEach((symbol, index) => {

        const card = document.createElement("button");

        card.className = "memory-card";

        card.type = "button";

        card.dataset.symbol = symbol;

        card.setAttribute(
            "aria-label",
            "Memory card " + (index + 1)
        );

        card.innerHTML = `
            <span class="card-inner">
                <span class="card-front">?</span>
                <span class="card-back">${symbol}</span>
            </span>
        `;

        card.addEventListener("click", () => {

            flipMemoryCard(card);

        });

        memoryGrid.appendChild(card);

    });

}


function flipMemoryCard(card) {

    if (memoryLocked) return;

    if (card.classList.contains("flipped")) return;

    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");

    playSound(650);

    if (!memoryFirst) {

        memoryFirst = card;

        return;

    }

    memorySecond = card;

    memoryAttemptsValue++;

    memoryAttempts.textContent =
        memoryAttemptsValue;

    checkMemoryMatch();

}


function checkMemoryMatch() {

    const firstSymbol = memoryFirst.dataset.symbol;

    const secondSymbol = memorySecond.dataset.symbol;

    if (firstSymbol === secondSymbol) {

        memoryFirst.classList.add("matched");

        memorySecond.classList.add("matched");

        memoryMatches++;

        matchedPairs.textContent =
            memoryMatches + " / 4";

        memoryFeedback.textContent =
            "Great! You found a matching pair! ✨";

        memoryFirst = null;

        memorySecond = null;

        playSound(950);

        if (memoryMatches === 4) {

            memoryFeedback.textContent =
                "Perfect! You found every matching pair! 🏆";

            memoryNextBtn.disabled = false;

            playSound(1150, 0.3);

        }

    } else {

        memoryLocked = true;

        memoryFeedback.textContent =
            "Not a match. Try another combination!";

        setTimeout(() => {

            memoryFirst.classList.remove("flipped");

            memorySecond.classList.remove("flipped");

            memoryFirst = null;

            memorySecond = null;

            memoryLocked = false;

        }, 850);

    }

}


memoryNextBtn.addEventListener("click", () => {

    if (memoryMatches !== 4) return;

    goToStep(7);

});


/* =================================================
   11. STEP 7: QUIZ
================================================= */

quizButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (quizCompleted) return;

        const answer = button.dataset.answer;

        if (answer === "correct") {

            button.classList.add("correct");

            quizFeedback.textContent =
                "That's right! Learning and trying again helps us grow. 🌷";

            quizCompleted = true;

            quizButtons.forEach(item => {
                item.disabled = true;
            });

            quizNextBtn.disabled = false;

            playSound(1000);

        } else {

            button.classList.add("wrong");

            quizFeedback.textContent =
                "Not quite! Think about a positive way to face challenges. 💜";

            playSound(250);

            setTimeout(() => {
                button.classList.remove("wrong");
            }, 650);

        }

    });

});


quizNextBtn.addEventListener("click", () => {

    if (!quizCompleted) return;

    goToStep(8);

});


/* =================================================
   12. STEP 8: MYSTERY GIFTS
================================================= */

const giftContents = [
    {
        icon: "🌟",
        message: "Gift 1: Remember that your small progress still matters!"
    },
    {
        icon: "🌷",
        message: "Gift 2: Make time for the things that make you feel happy!"
    },
    {
        icon: "💜",
        message: "Gift 3: Believe that you can keep learning and growing!"
    }
];


giftButtons.forEach(button => {

    button.addEventListener("click", () => {

        const index = Number(button.dataset.gift);

        if (openedGifts.has(index)) return;

        openedGifts.add(index);

        button.classList.add("opened");

        button.disabled = true;

        const gift = giftContents[index];

        button.querySelector("span").textContent = gift.icon;

        giftMessage.textContent = gift.message;

        giftCount.textContent =
            openedGifts.size + " of 3 gifts opened.";

        playSound(800 + index * 100);

        if (openedGifts.size === 3) {

            giftMessage.textContent =
                "All gifts are yours! You're ready for the secret letter. 💌";

            giftNextBtn.disabled = false;

            playSound(1150, 0.3);

        }

    });

});


giftNextBtn.addEventListener("click", () => {

    if (openedGifts.size !== 3) return;

    goToStep(9);

});


/* =================================================
   13. STEP 9: SECRET ENVELOPE
================================================= */

envelope.addEventListener("click", () => {

    if (envelopeOpened) return;

    envelopeOpened = true;

    envelope.classList.add("opened");

    envelopeFeedback.textContent =
        "Your special letter is ready to read! 💗";

    letterNextBtn.disabled = false;

    playSound(900, 0.3);

});


letterNextBtn.addEventListener("click", () => {

    if (!envelopeOpened) return;

    goToStep(10);

    displaySpecialMessage();

});


/* =================================================
   14. STEP 10: PERSONALIZED MESSAGE
================================================= */

function createMessage() {

    let moodOpening = "";

    switch (selectedMood) {

        case "happy":

            moodOpening =
                "Senang mengetahui bahwa kamu sedang merasa bahagia. Semoga kebahagiaan itu terus menemanimu.";

            break;

        case "normal":

            moodOpening =
                "Mungkin hari ini terasa seperti hari biasa. Namun, jangan lupa bahwa hari sederhana juga punya arti.";

            break;

        case "tired":

            moodOpening =
                "Aku tahu bahwa ada kalanya perjalanan terasa melelahkan. Tidak apa-apa untuk beristirahat dan mengambil waktu untuk dirimu sendiri.";

            break;

        case "sad":

            moodOpening =
                "Mungkin hari ini bukan hari yang paling mudah. Tidak apa-apa untuk memberi ruang bagi perasaanmu dan melangkah pelan-pelan.";

            break;

        default:

            moodOpening =
                "Semoga pesan kecil ini membuat harimu sedikit lebih baik.";

    }


    return (
        "Halo, " + visitorName + "! " + selectedCharm + "\n\n" +

        moodOpening + "\n\n" +

        "Jangan terlalu sibuk memikirkan seberapa jauh orang lain melangkah. Setiap orang memiliki proses dan waktunya masing-masing.\n\n" +

        "Teruslah belajar, berani mencoba hal baru, dan jangan takut membuat kesalahan. Kamu tidak harus sempurna untuk bisa berkembang.\n\n" +

        "Ingatlah bahwa langkah kecil yang kamu lakukan hari ini tetap bisa membawamu menuju sesuatu yang besar.\n\n" +

        "Semangat terus, " + visitorName + "! Kamu masih memiliki banyak kesempatan untuk menciptakan cerita yang indah.\n\n" +

        "Keep going. Your story is not over yet. 💗"
    );

}


function displaySpecialMessage() {

    clearInterval(typingInterval);

    const message = createMessage();

    messageHeading.textContent =
        "A Special Message For " + visitorName + " ✨";

    specialMessage.textContent = "";

    heartGardenBtn.disabled = true;

    messageFeedback.textContent =
        "A little message is being written for you...";

    let position = 0;

    typingInterval = setInterval(() => {

        if (position < message.length) {

            specialMessage.textContent +=
                message.charAt(position);

            position++;

        } else {

            clearInterval(typingInterval);

            messageFeedback.textContent =
                "Take a moment. This message is for you. 💜";

            heartGardenBtn.disabled = false;

            playSound(1050);

        }

    }, 25);

}


heartGardenBtn.addEventListener("click", () => {

    goToStep(11);

});


/* =================================================
   15. STEP 11: INITIALIZE HEART GARDEN
================================================= */

const heartSymbols = [
    "💗",
    "💖",
    "💕",
    "💓",
    "💜",
    "🩷",
    "💝"
];

function getRandomPosition() {

    return {

        x: 7 + Math.random() * 83,

        y: 8 + Math.random() * 76

    };

}


function initializeHeartGarden() {

    // Hapus hati dari sesi sebelumnya.

    heartGarden.querySelectorAll(
        ".heart-token, .heart-particle"
    ).forEach(element => {
        element.remove();
    });

    // Pastikan area hati tidak terhalang.

    heartCount = 0;

    heartCountElement.textContent = "0";

    heartProgressBar.style.width = "0%";

    heartFeedback.textContent =
        "Every little click creates a little surprise.";

    // Membuat 12 hati interaktif.

    for (let i = 0; i < 12; i++) {

        createHeart(i);

    }

}


function createHeart(index) {

    const heart = document.createElement("button");

    heart.className = "heart-token";

    heart.type = "button";

    heart.textContent =
        heartSymbols[index % heartSymbols.length];

    heart.setAttribute(
        "aria-label",
        "Click heart " + (index + 1)
    );

    const position = getRandomPosition();

    heart.style.left = position.x + "%";

    heart.style.top = position.y + "%";

    heart.addEventListener("click", () => {

        collectHeart(heart);

    });

    heartGarden.appendChild(heart);

}


/* =================================================
   16. HEART CLICK PARTICLES
================================================= */

function createHeartParticles(x, y) {

    const particles = [
        "💗",
        "💕",
        "✨",
        "♡",
        "💖"
    ];

    for (let i = 0; i < 5; i++) {

        const particle = document.createElement("span");

        particle.className = "heart-particle";

        particle.textContent =
            particles[Math.floor(Math.random() * particles.length)];

        particle.style.left = x + "px";

        particle.style.top = y + "px";

        particle.style.setProperty(
            "--move-x",
            (Math.random() * 100 - 50) + "px"
        );

        heartGarden.appendChild(particle);

        setTimeout(() => {

            particle.remove();

        }, 1300);

    }

}


/* =================================================
   17. HEART MOVEMENT
=============================================== */

function moveHeart(heart) {

    const position = getRandomPosition();

    heart.style.left = position.x + "%";

    heart.style.top = position.y + "%";

    // Mengulangi animasi pop.

    heart.classList.remove("pop");

    void heart.offsetWidth;

    heart.classList.add("pop");

    setTimeout(() => {

        heart.classList.remove("pop");

    }, 500);

}


/* =================================================
   18. HEART COLLECTION
================================================= */

function collectHeart(heart) {

    // Posisi hati sebelum berpindah.

    const gardenRect =
        heartGarden.getBoundingClientRect();

    const heartRect =
        heart.getBoundingClientRect();

    const x =
        heartRect.left -
        gardenRect.left +
        heartRect.width / 2;

    const y =
        heartRect.top -
        gardenRect.top +
        heartRect.height / 2;

    // Tambahkan jumlah klik hati.

    heartCount++;

    heartCountElement.textContent = heartCount;

    // Batasi progress pada 100%.

    const progress =
        Math.min((heartCount / 10) * 100, 100);

    heartProgressBar.style.width = progress + "%";

    // Munculkan partikel.

    createHeartParticles(x, y);

    // Pindahkan hati ke posisi baru.

    moveHeart(heart);

    playSound(700 + Math.min(heartCount, 10) * 50, 0.2);

    if (heartCount < 10) {

        heartFeedback.textContent =
            "Lovely! " +
            (10 - heartCount) +
            " more clicks to complete your garden. 💗";

    } else if (heartCount === 10) {

        heartFeedback.textContent =
            "🎉 Congratulations, " +
            visitorName +
            "! You completed the Heart Garden!";

        createConfetti();

        playSound(1200, 0.4);

    } else {

        heartFeedback.textContent =
            "Keep spreading little moments of happiness! 💕";

    }

}


/* =================================================
   19. CONFETTI EFFECT
================================================= */

function createConfetti() {

    const confettiSymbols = [
        "💗",
        "💕",
        "✨",
        "🌸",
        "⭐",
        "💜"
    ];

    for (let i = 0; i < 35; i++) {

        const particle = document.createElement("span");

        particle.className = "confetti";

        particle.textContent =
            confettiSymbols[
                Math.floor(Math.random() * confettiSymbols.length)
            ];

        particle.style.left =
            Math.random() * 100 + "vw";

        particle.style.animationDelay =
            Math.random() * 1.5 + "s";

        particle.style.fontSize =
            (12 + Math.random() * 18) + "px";

        document.body.appendChild(particle);

        setTimeout(() => {

            particle.remove();

        }, 4500);

    }

}


/* =================================================
   20. SOUND ON / OFF
================================================= */

soundBtn.addEventListener("click", () => {

    soundEnabled = !soundEnabled;

    soundBtn.textContent =
        soundEnabled ? "🔊" : "🔇";

    soundBtn.setAttribute(
        "aria-label",
        soundEnabled ? "Turn sound off" : "Turn sound on"
    );

    if (soundEnabled) {

        playSound(850);

    }

});


/* =================================================
   21. SHARE WEBSITE
================================================= */

shareBtn.addEventListener("click", async () => {

    const shareData = {

        title: "A Little Surprise For You",

        text:
            "Aku baru saja menyelesaikan perjalanan kecil yang menyenangkan! 💗",

        url: window.location.href

    };

    try {

        if (navigator.share) {

            await navigator.share(shareData);

        } else if (navigator.clipboard) {

            await navigator.clipboard.writeText(
                shareData.text + "\n" + shareData.url
            );

            shareBtn.textContent = "✓ Link Copied!";

            setTimeout(() => {

                shareBtn.textContent =
                    "↗ Share This Experience";

            }, 2000);

        } else {

            shareBtn.textContent =
                "Share is unavailable";

        }

    } catch (error) {

        console.log("Sharing cancelled or unavailable.");

    }

});


/* =================================================
   22. RESET EVERYTHING
================================================= */

function restartExperience() {

    // Hentikan seluruh timer dan animasi pengetikan.

    clearInterval(starInterval);

    clearInterval(typingInterval);

    starGameActive = false;

    // Reset navigasi.

    currentStep = 1;

    visitorName = "";

    // Reset personalisasi.

    nameInput.value = "";

    nameError.textContent = "";

    // Reset mood.

    selectedMood = "";

    moodButtons.forEach(button => {

        button.classList.remove("selected");

    });

    moodNextBtn.disabled = true;

    moodResponse.textContent = "";

    // Reset lucky charm.

    selectedCharm = "";

    selectedCharmName = "";

    charmButtons.forEach(button => {

        button.classList.remove("selected");

    });

    charmNextBtn.disabled = true;

    charmResponse.textContent =
        "Your choice will be remembered.";

    // Reset mini game.

    starScoreValue = 0;

    starTimeValue = 30;

    starScore.textContent = "0 / 6";

    starTime.textContent = "30s";

    starFeedback.textContent =
        "Collect 6 stars to unlock the next level!";

    starNextBtn.disabled = true;

    starGameArea.innerHTML = `
        <div class="game-intro">

            <span>🌠</span>

            <p>Ready to collect your stars?</p>

            <button class="small-btn" id="startStarGameBtn">
                Start Game
            </button>

        </div>
    `;

    document.getElementById("startStarGameBtn")
        .addEventListener("click", startStarGame);

    // Reset memory.

    memoryStarted = false;

    memoryMatches = 0;

    memoryAttemptsValue = 0;

    memoryFirst = null;

    memorySecond = null;

    memoryLocked = false;

    memoryGrid.innerHTML = "";

    matchedPairs.textContent = "0 / 4";

    memoryAttempts.textContent = "0";

    memoryFeedback.textContent =
        "Find all four matching pairs!";

    memoryNextBtn.disabled = true;

    // Reset quiz.

    quizCompleted = false;

    quizButtons.forEach(button => {

        button.disabled = false;

        button.classList.remove("correct", "wrong");

    });

    quizFeedback.textContent = "";

    quizNextBtn.disabled = true;

    // Reset gifts.

    openedGifts.clear();

    giftButtons.forEach(button => {

        button.disabled = false;

        button.classList.remove("opened");

        button.querySelector("span").textContent = "🎁";

    });

    giftMessage.textContent =
        "Your little gifts are waiting...";

    giftCount.textContent = "0 of 3 gifts opened.";

    giftNextBtn.disabled = true;

    // Reset envelope.

    envelopeOpened = false;

    envelope.classList.remove("opened");

    envelopeFeedback.textContent =
        "Tap the envelope to open it.";

    letterNextBtn.disabled = true;

    // Reset message.

    specialMessage.textContent = "";

    messageHeading.textContent = "Dear You...";

    messageFeedback.textContent =
        "Take your time and read it slowly.";

    heartGardenBtn.disabled = true;

    // Reset heart garden.

    heartCount = 0;

    heartCountElement.textContent = "0";

    heartProgressBar.style.width = "0%";

    heartFeedback.textContent =
        "Every little click creates a little surprise.";

    heartGarden.querySelectorAll(
        ".heart-token, .heart-particle"
    ).forEach(element => {
        element.remove();
    });

    // Reset confetti.

    document.querySelectorAll(".confetti").forEach(element => {
        element.remove();
    });

    // Kembali ke halaman awal.

    goToStep(1);

}


/* =================================================
   23. RESTART EVENT
================================================= */

restartBtn.addEventListener("click", restartExperience);


/* =================================================
   24. INITIALIZE APPLICATION
================================================= */

goToStep(1);

console.log(
    "A Little Surprise For You is ready! 💗"
);

