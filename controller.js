window.onload = function () {
  let flashcard = document.getElementById("flashcard");
  let next = document.getElementById("keep");
  let response = document.getElementById("answer");
  let flashcards;
  let currentFlashcardIndex;

  function displayFlashcard() {
    if (flashcards.length > 0) {
      // Get a random index
      currentFlashcardIndex = Math.floor(Math.random() * flashcards.length);
      console.log(flashcards[currentFlashcardIndex].res);
      flashcard.src = flashcards[currentFlashcardIndex].res; // Set the image source
    } else {
      console.log("No more flashcards available.");
    }
  }

  readTextFile("resources.json", function (text) {
    flashcards = JSON.parse(text);
    console.log(flashcards.length);

    // Display the first flashcard
    displayFlashcard();

    next.addEventListener("click", function () {
      functionality();
    });

    response.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the form from submitting or reloading the page
        functionality(); // Call the same function as for the button click
      }
    });
  });

  function functionality() {
    console.log("Current Index:", currentFlashcardIndex);
    console.log("User Response:", response.value);
    let container = document.getElementById("quiz-container");

    let existingMessage = container.querySelector("span");
    if (existingMessage) {
      container.removeChild(existingMessage);
    }

    // Check if the user's answer is correct
    if (response.value.toLowerCase() == flashcards[currentFlashcardIndex].code) {
      console.log("Correct Answer!");

      // Remove the answered flashcard from the array
      flashcards.splice(currentFlashcardIndex, 1);
      console.log(
        "Flashcard removed. Remaining flashcards:",
        flashcards.length
      );

      // Display the next flashcard
      displayFlashcard();
    } else {
      // Create a new span element for the message
      let message = document.createElement("span");
      message.textContent = "Incorrect Answer. Try Again!";
      message.style.color = "red"; // Optional: Add some styling

      // Append the message to the container
      container.appendChild(message);
    }
    response.value = "";
  }

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
