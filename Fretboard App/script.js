document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const modeSelectionMenu = document.getElementById("mode-selection-menu");
    const classicModeButton = document.getElementById("classic-mode-button");
    const practiceModeButton = document.getElementById("practice-mode-button");
    const modeDescription = document.getElementById("mode-description");
    const stringSelection = document.getElementById("string-selection");
    const confirmButton = document.getElementById("confirm-button");
    const gameInterface = document.getElementById("game-interface");
    const scoreDisplay = document.getElementById("score-display");
    const timerDisplay = document.getElementById("timer");
    const noteDisplay = document.getElementById("note-display");
    const stringDisplay = document.getElementById("string-display");
    const menuButton = document.getElementById("menu-button");
    const replayButton = document.getElementById("replay-button");
    const endScreen = document.getElementById("end-screen");
    const mainMenuButton = document.getElementById("main-menu-button");
    const feedbackContainer = document.getElementById("feedback-container");
    const feedbackImage = document.getElementById("feedback-image");

    let score = 0;
    let timer = 180;
    let gameRunning = false;

    const allStrings = ["6", "5", "4", "3", "2", "1"];
    const allNotes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

    startButton.addEventListener("click", () => {
        startButton.classList.add("hidden");
        modeSelectionMenu.classList.remove("hidden");
    });

    classicModeButton.addEventListener("mouseover", () => {
        modeDescription.textContent = "Classic:\nA note is shown and you will have to select the correct spot on the fretboard.\nTry to do as many as possible within 3 minutes!";
    });

    classicModeButton.addEventListener("mouseout", () => {
        modeDescription.textContent = "";
    });

    practiceModeButton.addEventListener("mouseover", () => {
        modeDescription.textContent = "Practice:\nNo time pressure or anything. You can even select specific notes you want to train.";
    });

    practiceModeButton.addEventListener("mouseout", () => {
        modeDescription.textContent = "";
    });

    classicModeButton.addEventListener("click", () => {
        modeSelectionMenu.classList.add("hidden");
        startGame("classic", allStrings);
    });

    practiceModeButton.addEventListener("click", () => {
        modeSelectionMenu.classList.add("hidden");
        stringSelection.classList.remove("hidden");
    });

    confirmButton.addEventListener("click", () => {
        const selectedStrings = getSelectedStrings();
        if (selectedStrings.length === 0) {
            alert("Please select at least one string.");
            return;
        }
        stringSelection.classList.add("hidden");
        startGame("practice", selectedStrings);
    });    

    menuButton.addEventListener("click", () => {
        const confirmBack = confirm("Do you really want to exit to the main menu?");
        if (confirmBack) {
            resetGame();
            modeSelectionMenu.classList.remove("hidden");
            gameInterface.classList.add("hidden");
            menuButton.classList.add("hidden");
        }
    });

    replayButton.addEventListener("click", () => {
        endScreen.classList.add("hidden");
        startGame("classic", allStrings);
    });

    function getSelectedStrings() {
        const checkboxes = stringSelection.querySelectorAll("input[type='checkbox']");
        const selectedStrings = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedStrings.push(checkbox.value);
            }
        });
        return selectedStrings;
    }

    let timerInterval;

    function startGame(mode, selectedStrings) {
        score = 0;
        timer = 20;
        gameRunning = true;
    
        gameInterface.classList.remove("hidden");
        menuButton.classList.remove("hidden");
        scoreDisplay.textContent = `Punkte: ${score}`;
    
        if (mode === "practice") {
            timerDisplay.classList.add("hidden");
            scoreDisplay.classList.add("hidden");
        } else {
            timerDisplay.classList.remove("hidden");
            startTimer();
        }
    
        const fretboardMap = document.querySelector("map[name='image-map']");
        fretboardMap.addEventListener("click", (e) => handleFretboardClick(e, selectedStrings));
        fretboardMap.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
        fretboardMap.style.userSelect = 'none';
    
        generateNoteAndString(selectedStrings);
    
        if (mode === "classic") {
            timerInterval = setInterval(() => {
                if (!gameRunning) {
                    clearInterval(timerInterval);
                    return;
                }
    
                timer--;
                const minutes = Math.floor(timer / 60);
                const seconds = ("0" + (timer % 60)).slice(-2);
                timerDisplay.textContent = `Time: ${minutes}:${seconds}`;
    
                if (timer <= 0) {
                    clearInterval(timerInterval);
                    endGame();
                }
            }, 1000);
        }
    }    

    let feedbackActive = false;

    function handleFretboardClick(e, strings) {
        if (!gameRunning || feedbackActive) return;

        if (!feedbackContainer || !feedbackImage) {
            console.error("Feedback container or image not found in DOM.");
            return;
        }

        if (e.target.tagName === "AREA") {
            e.preventDefault();

            const selectedNote = e.target.dataset.note;
            const selectedString = e.target.dataset.string;

            feedbackActive = true; // Prevent overlapping feedback
            if (isCorrect(shownNote, shownString, selectedNote, selectedString)) {
                feedbackImage.src = "correct.png";
                feedbackImage.className = 'correct-feedback'; // Simpler way to reset classes
                feedbackContainer.style.display = "block";
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            } else {
                feedbackImage.src = "incorrect.png";
                feedbackImage.className = 'incorrect-feedback';
                feedbackContainer.style.display = "block";
                timer -= 5; // Penalize user
            }

            setTimeout(() => {
                feedbackContainer.style.display = "none";
                feedbackActive = false;
            }, 1000);

            generateNoteAndString(strings);
        }
    }

    
    
    

    function generateNoteAndString(selectedStrings) {
        const note = generateRandomNote();
        const string = generateRandomString(selectedStrings);

        noteDisplay.textContent = `Note: ${note}`;
        const stringNames = ["e", "B", "G", "D", "A", "E"];
        stringDisplay.textContent = `String: ${stringNames[string - 1]}`;

        shownNote = note;
        shownString = string;
    }

    function generateRandomNote() {
        return allNotes[Math.floor(Math.random() * allNotes.length)];
    }

    function generateRandomString(strings) {
        return strings[Math.floor(Math.random() * strings.length)];
    }

    function isCorrect(shownNote, shownString, selectedNote, selectedString) {
        return shownNote === selectedNote && shownString === selectedString;
    }

    function startTimer() {
        timerDisplay.textContent = `Time: 3:00`;
    }

    function endGame() {
        gameRunning = false;
        clearInterval(timerInterval);
        gameInterface.classList.add("hidden");
        menuButton.classList.add("hidden");
        endScreen.classList.remove("hidden");
    
        const resultsDiv = document.getElementById("results");
        resultsDiv.textContent = `Dein End-Score: ${score}`;
    
        const highscoreDiv = document.getElementById("highscore");
        const savedHighscore = localStorage.getItem("highscore") || 0;
        if (isNaN(savedHighscore) || score > savedHighscore) {
            localStorage.setItem("highscore", score);
            highscoreDiv.textContent = `Neuer Highscore: ${score}`;
        } else {
            highscoreDiv.textContent = `Dein Highscore: ${savedHighscore}`;
        }
    
        
        replayButton.textContent = "Nochmal spielen";
        replayButton.onclick = () => {
            endScreen.classList.add("hidden");
            startGame("classic", allStrings);
        };
    
        mainMenuButton.textContent = "Zurück zum Hauptmenü";
        mainMenuButton.onclick = () => {
            endScreen.classList.add("hidden");
            modeSelectionMenu.classList.remove("hidden");
            resetGame();
        };
    }
    
    function resetGame() {
        gameInterface.classList.add("hidden");
        timerDisplay.textContent = "Time: 3:00";
        scoreDisplay.textContent = "Score: 0";
        noteDisplay.textContent = "";
        stringDisplay.textContent = "";
        timer = 180;
        score = 0;
    }
});