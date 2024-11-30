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

    practiceModeButton.addEventListener("mouseover", () => {
        modeDescription.textContent = "Practice:\nNo time pressure or anything. You can even select specific notes you want to train.";
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
        if (selectedStrings.length > 0) {
            stringSelection.classList.add("hidden");
            startGame("practice", selectedStrings);
        }
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

    function startGame(mode, selectedStrings) {
        score = 0;
        timer = 180;
        gameRunning = true;

        gameInterface.classList.remove("hidden");
        scoreDisplay.textContent = `Punkte: ${score}`;

        if (mode === "practice") {
            timerDisplay.classList.add("hidden");
        } else {
            timerDisplay.classList.remove("hidden");
            startTimer();
        }

        const fretboardMap = document.querySelector("map[name='image-map']");
        fretboardMap.addEventListener("click", (e) => handleFretboardClick(e, selectedStrings));

        generateNoteAndString(selectedStrings);

        if (mode === "classic") {
            const interval = setInterval(() => {
                if (!gameRunning) {
                    clearInterval(interval);
                    return;
                }

                timer--;
                timerDisplay.textContent = `Zeit: ${Math.floor(timer / 60)}:${("0" + (timer % 60)).slice(-2)}`;

                if (timer <= 0) {
                    clearInterval(interval);
                    endGame();
                }
            }, 1000);
        }
    }

    function handleFretboardClick(e, strings) {
        if (!gameRunning) return;
    
        if (e.target.tagName === "AREA") {
            e.preventDefault();
            const selectedNote = e.target.dataset.note;
            const selectedString = e.target.dataset.string;
    
            if (isCorrect(shownNote, shownString, selectedNote, selectedString)) {
                score++;
                scoreDisplay.textContent = `Punkte: ${score}`;
            } else {
                timer -= 5;
            }
    
            generateNoteAndString(strings); // Lokale Variable verwenden
        }
    }    

    function generateNoteAndString(selectedStrings) {
        const note = generateRandomNote();
        const string = generateRandomString(selectedStrings);

        noteDisplay.textContent = `Note: ${note}`;
        stringDisplay.textContent = `Saite: ${string}`;

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
        timerDisplay.textContent = `Zeit: 3:00`;
    }

    function endGame() {
        gameRunning = false;
        alert(`Spiel vorbei! Dein Score: ${score}`);
        resetGame();
    }

    function resetGame() {
        gameInterface.classList.add("hidden");
        timerDisplay.textContent = "Zeit: 3:00";
        scoreDisplay.textContent = "Punkte: 0";
        noteDisplay.textContent = "";
        stringDisplay.textContent = "";
        timer = 180;
        score = 0;
    }
});