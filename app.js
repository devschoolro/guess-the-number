const scoreContainer = document.querySelector("#bestScore");
const triesContainer = document.querySelector("#tries");
const historyContainer = document.querySelector("#history");
const numberContainer = document.querySelector("#number");
const messageContainer = document.querySelector("#message");

// Fix problem for numbers between 1 and 9 in romanian language
const lowNumbersMap = new Map();
lowNumbersMap.set("unu", 1);
lowNumbersMap.set("doi", 2);
lowNumbersMap.set("trei", 3);
lowNumbersMap.set("patru", 4);
lowNumbersMap.set("cinci", 5);
lowNumbersMap.set("șase", 6);
lowNumbersMap.set("șapte", 7);
lowNumbersMap.set("opt", 8);
lowNumbersMap.set("nouă", 9);

// Init best score
let currentScore = 0;
const bestScore = localStorage.getItem("score");
scoreContainer.innerText = bestScore || "-";

// Init number of tries
const numberOfTries = 10;
triesContainer.innerText = numberOfTries;

// Init Speech Recognition
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.lang = "ro-RO";
recognition.start();

// Event that handles the result of a speech
recognition.addEventListener("result", (event) => {
  const audioMessage = event["results"][0][0].transcript;
  const numberValue = lowNumbersMap.get(audioMessage) || audioMessage;
  numberContainer.innerText = numberValue;
  checkNumber(numberValue);
});

// Needed for Speech Recognition to stay active after first try
recognition.addEventListener("end", () => recognition.start());

// Generate random number
const randomNumber = Math.floor(Math.random() * 100) + 1;
console.log(`Random number: ${randomNumber}`);

function checkNumber(value) {
  // Check if it is a valid number
  if (isNaN(value)) {
    messageContainer.innerHTML = `<b>${value}</b> nu este un numar valid`;
    return;
  }

  const integerValue = parseInt(value);

  // Check if it is in the range 1-100
  if (integerValue < 1 || integerValue > 100) {
    messageContainer.innerText = "Numarul trebuie sa fie in intervalul 1-100";
    return;
  }

  currentScore += 1;

  // Update numbers in history
  if (historyContainer.textContent.length > 0) {
    historyContainer.innerText += ", ";
  }
  historyContainer.innerText += integerValue;

  // Check if it is the correct number
  if (integerValue === randomNumber) {
    document.body.innerHTML =
      "<h1 class='title'>Felicitari, ai ghicit numarul 😎</h1>";
    document.body.innerHTML += `<p class='subtitle'>Scorul tau este: ${currentScore}</p>`;
    document.body.innerHTML += "<button id='playBtn'>Joaca din nou</button>";

    if (bestScore === null || currentScore < bestScore) {
      localStorage.setItem("score", currentScore);
    }
  } else if (integerValue < randomNumber) {
    messageContainer.innerText = "Incearca un numar mai mare";
  } else {
    messageContainer.innerText = "Incearca un numar mai mic";
  }

  // Update number of tries
  triesContainer.innerText = numberOfTries - currentScore;

  if (numberOfTries === currentScore) {
    document.body.innerHTML =
      "<h1 class='title'>Din pacate nu ai reusit sa ghicesti numarul 😥</h1>";
    document.body.innerHTML += "<button id='playBtn'>Joaca din nou</button>";
  }
}

// Event for Play Again
document.addEventListener("click", (event) => {
  if (event.target.id === "playBtn") {
    window.location.reload();
  }
});
