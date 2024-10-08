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
      console.log("Current Index:", currentFlashcardIndex);
      console.log("User Response:", response.value);

      // Check if the user's answer is correct
      if (response.value == flashcards[currentFlashcardIndex].code) {
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
        console.log("Incorrect Answer. Try Again!");
      }

      response.value = "";
    });
  });

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
