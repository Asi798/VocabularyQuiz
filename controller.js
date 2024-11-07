window.onload = function () {
  let flashcard;
  let katakana = document.getElementById("katakana");
  let hiragana = document.getElementById("hiragana");
  let vocabulary = document.getElementById("vocabulary");
  let multi = document.getElementById("multiple");
  let container = document.getElementById("quiz-container");
  let head = document.getElementById("head");
  let flashcards;
  let currentFlashcardIndex;
  let next;
  let response;
  let word;
  let words;
  let multiContainer;

  katakana.addEventListener("click", function () {
    let respuesta = container.querySelector("input");
    word = container.querySelector("h2");
    multiContainer = document.getElementById("multi-answer");
    if (!respuesta) {
      response = document.createElement("input");
      next = document.createElement("button");
      flashcard = document.createElement("img");
      flashcard.className = "flashcard";
      flashcard.id = "flashcard";
      next.className = "next-button";
      next.id = "keep";
      next.innerHTML = "Next";
      response.className = "answer";
      response.id = "answer";
      if (word) {
        word.remove();
        multiContainer.remove();
      }
      container.appendChild(flashcard);
      container.appendChild(response);
      container.appendChild(next);
    }
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

  multi.addEventListener("click", function () {
    head.textContent = "Multiple Choice Vocab Quiz";
    let checkWord = document.querySelector("h2");
    if (!checkWord) {
      word = document.createElement("h2");
      container.appendChild(word);
    }

    if (flashcard) {
      flashcard.remove();
      next.remove();
      response.remove();
    }

    let indexs = new Set();
    let buttonsContainer = document.createElement("div"); // Container for buttons
    buttonsContainer.id = "multi-answer";
    container.appendChild(buttonsContainer); // Add the container to your main quiz area

    readTextFile("vocab.json", function (text) {
      words = JSON.parse(text);

      function getUniqueRandomIndex() {
        let currentFlashcardIndexx;
        do {
          currentFlashcardIndexx = Math.floor(Math.random() * words.length);
        } while (indexs.has(currentFlashcardIndexx));
        indexs.add(currentFlashcardIndexx);
        return currentFlashcardIndexx;
      }

      function loadNextQuestion() {
        // Clear previous question and buttons
        word.innerHTML = "";
        buttonsContainer.innerHTML = ""; // Clear previous buttons

        if (indexs.size < words.length) {
          let uniqueIndex = getUniqueRandomIndex();
          let correctAnswer = words[uniqueIndex].eng;

          // Display the question
          word.innerHTML = words[uniqueIndex].jap;

          // Randomize correct answer position
          let correctPosition = Math.floor(Math.random() * 4);
          let usedIndexes = new Set([uniqueIndex]); // Start with the correct answer's index

          for (let i = 0; i < 4; ++i) {
            let respuesta = document.createElement("button");
            respuesta.className = "respuesta";

            if (i === correctPosition) {
              respuesta.innerHTML = correctAnswer;
              respuesta.id = "correct";
            } else {
              let randomIndex;
              do {
                randomIndex = Math.floor(Math.random() * words.length);
              } while (
                usedIndexes.has(randomIndex) ||
                randomIndex === uniqueIndex
              );
              respuesta.innerHTML = words[randomIndex].eng;
              respuesta.id = "fake";
            }

            respuesta.addEventListener("click", function () {
              if (respuesta.id === "correct") {
                console.log("Correct Answer!");
                loadNextQuestion(); // Load a new question if correct
              } else {
                console.log("Incorrect Answer. Try Again!");
                respuesta.remove();
              }
            });

            buttonsContainer.appendChild(respuesta);
          }
        } else {
          console.log("All unique words have been used.");
          word.innerHTML = "Congratulations! You've completed the quiz.";
          buttonsContainer.innerHTML = ""; // Clear the buttons at the end
        }
      }

      // Load the first question
      loadNextQuestion();
    });
  });

  vocabulary.addEventListener("click", function () {
    let respuesta = container.querySelector("input");
    word = container.querySelector("h2");
    multiContainer = document.getElementById("multi-answer");
    if (!respuesta) {
      response = document.createElement("input");
      next = document.createElement("button");
      flashcard = document.createElement("img");
      flashcard.className = "flashcard";
      flashcard.id = "flashcard";
      next.className = "next-button";
      next.id = "keep";
      next.innerHTML = "Next";
      response.className = "answer";
      response.id = "answer";
      if (word) {
        word.remove();
        multiContainer.remove();
      }
      container.appendChild(flashcard);
      container.appendChild(response);
      container.appendChild(next);
    }
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
