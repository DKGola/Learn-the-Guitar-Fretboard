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
    const penaltyElement = document.getElementById("penalty");
    const fretboardMap = document.querySelector("map[name='image-map']");

    let score = 0;
    let timer = 180;
    let gameRunning = false;
    let feedbackActive = false;
    let mode = "classic";

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

    // classic mode: starts game with all strings
    classicModeButton.addEventListener("click", () => {
        modeSelectionMenu.classList.add("hidden");
        mode = "classic";
        startGame(allStrings);
    });

    // practice mode: select strings to practices
    practiceModeButton.addEventListener("click", () => {
        modeSelectionMenu.classList.add("hidden");
        stringSelection.classList.remove("hidden");
    });

    // select 1 or more strings to practice
    confirmButton.addEventListener("click", () => {
        const selectedStrings = getSelectedStrings();
        if (selectedStrings.length === 0) {
            alert("Please select at least one string.");
            return;
        }
        stringSelection.classList.add("hidden");
        mode = "practice";
        startGame(selectedStrings);
    });    

    // menu button in the corner to return to the main menu
    menuButton.addEventListener("click", () => {
        const confirmBack = confirm("Do you really want to exit to the main menu?");
        if (confirmBack) {
            resetGame();
            modeSelectionMenu.classList.remove("hidden");
            gameInterface.classList.add("hidden");
            menuButton.classList.add("hidden");
        }
    });

    // replay button on the end screen to start a new game
    replayButton.addEventListener("click", () => {
        endScreen.classList.add("hidden");
        startGame(allStrings);
    });

    // return the selected strings as an array (practice mode only)
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

    let timerInterval;  // used by startGame() and endGame()

    // initialize game and start timer
    function startGame(selectedStrings) {
        score = 0;
        timer = 180;
        gameRunning = true;
    
        gameInterface.classList.remove("hidden");
        menuButton.classList.remove("hidden");
        scoreDisplay.textContent = `Punkte: ${score}`;
    
        if (mode === "practice") {  // no timer or score in practice mode
            timerDisplay.classList.add("hidden");
            scoreDisplay.classList.add("hidden");
            
            penaltyElement.classList.add("invisible");
        } else {
            timerDisplay.textContent = `Time: 3:00`;
            timerDisplay.classList.remove("hidden");
        }
    
        fretboardMap.addEventListener("click", (e) => handleFretboardClick(e, selectedStrings));
        fretboardMap.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
        fretboardMap.style.userSelect = 'none';
    
        generateNoteAndString(selectedStrings);     // update note and string variables
    
        // timer
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
                    endGame();
                }
            }, 1000);
        }
    }    

    // handles a click on the fretboard and checks if the clicked note is correct
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

            feedbackActive = true; // prevent overlapping feedback
            // visualize if click was right or wrong
            if (isCorrect(shownNote, shownString, selectedNote, selectedString)) {  
                feedbackImage.src = "correct.png";
                feedbackImage.className = 'correct-feedback';
                feedbackContainer.style.display = "block";
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            } else {
                feedbackImage.src = "incorrect.png";
                feedbackImage.className = 'incorrect-feedback';
                feedbackContainer.style.display = "block";
                if (mode === "classic") {
                    timer -= 5; // Subtract 5 seconds from timer if wrong
                    showPenalty("-5");
                }
            }

            setTimeout(() => {
                feedbackContainer.style.display = "none";
                feedbackActive = false;
            }, 1000);

            generateNoteAndString(strings);
        }
    }

    // show red "-5" for 1 second when player clicks wrong note
    function showPenalty(text) {
        penaltyElement.textContent = text;
        penaltyElement.classList.remove("invisible");

        setTimeout(() => {
            penaltyElement.classList.add("invisible");
        }, 1000);
    }

    // generate and display a random note and string the user has to find
    function generateNoteAndString(selectedStrings) {
        const note = generateRandomNote();
        const string = generateRandomString(selectedStrings);

        noteDisplay.textContent = `Note: ${note}`;
        const stringNames = ["e", "B", "G", "D", "A", "E"];
        stringDisplay.textContent = `String: ${stringNames[string - 1]}`;

        shownNote = note;
        shownString = string;
    }

    // generate a random note
    function generateRandomNote() {
        return allNotes[Math.floor(Math.random() * allNotes.length)];
    }

    // generate a random string (practice mode: selected strings only)
    function generateRandomString(strings) {
        return strings[Math.floor(Math.random() * strings.length)];
    }

    // returns true if the shown and selected string and note match
    function isCorrect(shownNote, shownString, selectedNote, selectedString) {
        return shownNote === selectedNote && shownString === selectedString;
    }

    // end game and show results with option to replay or quit
    function endGame() {
        gameRunning = false;
        clearInterval(timerInterval);
        gameInterface.classList.add("hidden");
        menuButton.classList.add("hidden");
        endScreen.classList.remove("hidden");
    
        const resultsDiv = document.getElementById("results");
        resultsDiv.textContent = `Final Score: ${score}`;
    
        const highscoreDiv = document.getElementById("highscore");
        const savedHighscore = localStorage.getItem("highscore") || 0;
        if (isNaN(savedHighscore) || score > savedHighscore) {
            localStorage.setItem("highscore", score);
            highscoreDiv.textContent = `New Highscore!`;
        } else {
            highscoreDiv.textContent = `Your Highscore: ${savedHighscore}`;
        }
    
        
        replayButton.textContent = "Try again";
        replayButton.onclick = () => {
            endScreen.classList.add("hidden");
            resetGame();
            startGame(allStrings);
        };
    
        mainMenuButton.textContent = "Main Menu";
        mainMenuButton.onclick = () => {
            endScreen.classList.add("hidden");
            modeSelectionMenu.classList.remove("hidden");
            resetGame();
        };
    }
    
    // reset game state when replaying or returning to main menu
    function resetGame() {
        gameRunning = false;
        feedbackActive = false;
        gameInterface.classList.add("hidden");
        timerDisplay.textContent = "Time: 3:00";
        scoreDisplay.textContent = "Score: 0";
        noteDisplay.textContent = "";
        stringDisplay.textContent = "";
        clearInterval(timerInterval);
        timer = 180;
        score = 0;
    }
});