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
    const timer = document.getElementById("timer");

    let score = 0;
    let timerStart = 180;
    const shownNoteAndString = [];  //contains string & note

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
        gameInterface.classList.remove("hidden");
        if (mode === "practice") {
            timer.classList.add("hidden");
        } else {
            startTimer();
        }
        while (timer > 0) {
            shownNote = generateRandomNote(selectedStrings);
            /*test if clicked note === shownNote
        }
    }
});