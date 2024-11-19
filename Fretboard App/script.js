document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const modeSelectionMenu = document.getElementById("mode-selection-menu");
    const classicModeButton = document.getElementById("classic-mode-button");
    const practiceModeButton = document.getElementById("practice-mode-button");
    const modeDescription = document.getElementById("mode-description");
    const stringSelection = document.getElementById("stringSelection");
    const lowEString = document.getElementById("E-string");
    const aString = document.getElementById("A-string");
    const dString = document.getElementById("D-string");
    const gString = document.getElementById("G-string");
    const bString = document.getElementById("B-string");
    const highEString = document.getElementById("e-string");
    const confirmButton = document.getElementById("confirm-button");
    const gameInterface = document.getElementById("game-interface");
    const scoreDisplay = document.getElementById("score-display");
    const timerDisplay = document.getElementById("timer");
    const noteDisplay = document.getElementById("note-display");
    const stringDisplay = document.getElementById("string-display");

    let score = 0;
    let timerStart = 180;
    let shownNote = "";
    let shownString = "";
    let selectedNote = "";
    let selectedString = "";

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
        modeSelection.classList.add("hidden");
        gameInterface.classList.remove("hidden");
        startGame("classic");
    });

    practiceModeButton.addEventListener("click", () => {
        modeSelection.classList.add("hidden");
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
        gameInterface.classList.remove("hidden");
        if (mode === "practice") {
            timer.classList.add("hidden");
        } else {
            startTimer();
        }

        while (timer > 0) {
            generateNoteAndString(selectedStrings);
            
            // wait for click on field -> save as selectedNote and selectedString


            if (isCorrect(shownNote, shownString, selectedNote, selectedString)) {
                score++;    // 1 point for correct selection
            } else {
                if (mode === "classic") {
                    timer -= 5; // -5 seconds for false selection
                }
            }
        }
    }
    
    function generateNoteAndString(selectedStrings) {
        shownNote = generateRandomNote();
        shownString = generateRandomString(selectedStrings);
        noteDisplay.textContent = '${shownNote}';
        stringDisplay.textContent = '${shownString}';
    }

    // returns random note as string (e.g. "c", "c-sharp", "d-flat", ...)
    function generateRandomNote() {
        const allNotes = ["c", "c-sharp", "d-flat", "d", "d-sharp", "e-flat", "e", "f", "f-sharp", "g-flat", "g", "g-sharp", "a-flat", "a", "a-sharp", "b-flat", "b"];
        return allNotes[Math.floor(Math.random() * allNotes.length)];
    }

    // returns random string as integer, only considering selected strings (1 = highest, 6 = lowest string)
    function generateRandomString(selectedStrings) {
        return selectedStrings[Math.floor(Math.random() * selectedStrings.length)];
    }

    function isCorrect(shownNote, shownString, selectedNote, selectedString) {
        return (shownNote === selectedNote) && (shownString === selectedString);
    }

    function startTimer() {
        timerDisplay.classList.remove("hidden");
        interval = setInterval(() => {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = ("0" + (timer % 60)).slice(-2);
            timerDisplay.textContent = `Zeit: ${minutes}:${seconds}`;
            if (timer <= 0) {
                clearInterval(interval);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(interval);
        resetGame();
    }

    function resetGame() {
        gameInterface.classList.add("hidden");
        timer = 180;
        score = 0;
    }
});