window.onload = function () {
  let flashcard = document.getElementById("flashcard");
  let next = document.getElementById("keep");
  let katakana = document.getElementById("katakana");
  let hiragana = document.getElementById("hiragana");
  let vocabulary = document.getElementById("vocabulary");
  let response = document.getElementById("answer");
  let head = document.getElementById("head");
  let flashcards;
  let currentFlashcardIndex;

  katakana.addEventListener("click", function () {
    head.textContent = "Katakana Quiz";
    readTextFile("katakana.json", function (text) {
      flashcards = JSON.parse(text);
      console.log(flashcards.length);

      // Display the first katakana flashcard
      displayFlashcard();

      next.addEventListener("click", function () {
        functionality(); // Check user response when pressing the button
      });

      response.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          functionality(); // Call the same function when pressing Enter
        }
      });
    });
  });

  vocabulary.addEventListener("click", function () {
    head.textContent = "Vocabulary Quiz";
    readTextFile("resources.json", function (text) {
      flashcards = JSON.parse(text);
      console.log(flashcards.length);

      // Display the first vocabulary flashcard
      displayFlashcard();

      next.addEventListener("click", function () {
        functionality(); // Check user response when pressing the button
      });

      response.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          functionality(); // Call the same function when pressing Enter
        }
      });
    });
  });

  // Function to display the flashcard
  function displayFlashcard() {
    let container = document.getElementById("quiz-container");
    // Remove existing message (if any)
    let existingMessage = container.querySelector("span");
    if (existingMessage) {
      container.removeChild(existingMessage);
    }
    if (flashcards.length > 0) {
      currentFlashcardIndex = Math.floor(Math.random() * flashcards.length);
      flashcard.src = flashcards[currentFlashcardIndex].res;
    } else {
      endGame();
      console.log("No more flashcards available.");
    }
  }

  // Function to handle user response
  function functionality() {
    let container = document.getElementById("quiz-container");
    // Remove existing message (if any)
    let existingMessage = container.querySelector("span");
    if (existingMessage) {
      container.removeChild(existingMessage);
    }

    // Check if the user's answer is correct
    if (
      response.value.toLowerCase() === flashcards[currentFlashcardIndex].code
    ) {
      console.log("Correct Answer!");
      clearMessage();

      // Remove the correct flashcard from the array
      flashcards.splice(currentFlashcardIndex, 1);

      // Display the next flashcard
      displayFlashcard();
    } else {
      // Show the incorrect message and do NOT move to the next flashcard
      let message = document.createElement("span");
      message.textContent = "Incorrect Answer. Try Again!";
      message.style.color = "red";
      container.appendChild(message);
    }

    // Clear the input field
    response.value = "";
  }

  function clearMessage() {
    let container = document.getElementById("quiz-container");
    let existingMessage = container.querySelector("span");
    if (existingMessage) {
      container.removeChild(existingMessage);
    }
  }

  function endGame() {
    let container = document.getElementById("quiz-container");
    container.innerHTML = ""; // Clear the quiz container
    let message = document.createElement("p");
    message.textContent = "Congratulations! You've finished the quiz.";
    message.style.fontSize = "1.5em";
    message.style.color = "green";
    container.appendChild(message);

    let restartButton = document.createElement("button");
    restartButton.textContent = "Play Again";
    restartButton.className = "next-button";
    restartButton.addEventListener("click", function () {
      location.reload(); // Reload the page to start a new game
    });
    container.appendChild(restartButton);
  }

  // Function to read the JSON file
  function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status === 200) {
        callback(rawFile.responseText);
      }
    };
    rawFile.send(null);
  }
};
