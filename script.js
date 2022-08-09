//HTML Element Selectors
const gameContainer = document.getElementById("game");
let feedbackSelect = document.querySelector("#feedBack");
let triesSelect = document.querySelector("#score");
let startScreen = document.querySelector("#start-screen");
let restartButtonSelect = document.querySelector("#button-restart");
let bodySelect = document.querySelector("body");
let randomColorText = document.querySelectorAll(".random-color-text span");

let scoreLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

let numOfTries = 0;
let openColors = 0;
let firstChoice,
  secondChoice = "";
let firstCard, secondCard;
let correctCounter = 0;

const COLORS = colorPicker(5);

let shuffledColors = shuffle(COLORS);
let counterArray = 0;
let pairCount = 0;

setInterval(function () {
  for (let i of randomColorText) {
    i.style.color = `rgb(${Math.random() * 256},${Math.random() * 256},${
      Math.random() * 256
    })`;
  }
}, 250);

startScreen.addEventListener("click", function (e) {
  startScreen.remove();
});

for (let i of scoreLeaderboard) {
  let tempElement = document.createElement("p");
  if (scoreLeaderboard.indexOf(i) === 0) {
    tempElement.style.color = "gold";
    tempElement.innerText = "#1 ";
  } else if (scoreLeaderboard.indexOf(i) === 1) {
    tempElement.style.color = "silver";
    tempElement.innerText = "#2 ";
  } else if (scoreLeaderboard.indexOf(i) === 2) {
    tempElement.style.color = "sienna";
    tempElement.innerText = "#3 ";
  } else if (scoreLeaderboard.indexOf(i) === 3) {
    tempElement.innerText = "#4 ";
  } else if (scoreLeaderboard.indexOf(i) === 4) {
    tempElement.innerText = "#5 ";
  }
  tempElement.innerText += `${i.name} .......... ${i.score}`;
  startScreen.append(tempElement);
}

restartButtonSelect.addEventListener("click", function (e) {
  window.location.reload("Refresh");
});

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

createDivsForColors(shuffledColors);

function colorPicker(n) {
  let temp = [];
  let tempColor = "";
  for (let i = 0; i < n; i++) {
    tempColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
      Math.random() * 256
    )},${Math.floor(Math.random() * 256)})`;
    temp.push(tempColor);
    temp.push(tempColor);
  }
  return temp;
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("card");
    newDiv.classList.add(color);
    newDiv.classList.add(counterArray++);
    newDiv.style.transition = "100ms";
    newDiv.addEventListener("click", function (e) {
      triesSelect.innerText = `Tries: ${numOfTries}`;
      if (!newDiv.classList.contains("solved")) {
        if (openColors === 0) {
          numOfTries++;
          newDiv.style.backgroundColor = color;
          firstChoice = color;
          firstCard = newDiv;
          openColors++;
        } else if (openColors === 1) {
          newDiv.style.backgroundColor = color;
          secondChoice = color;
          secondCard = newDiv;
          openColors++;
          if (firstChoice !== secondChoice) {
            reactToIncorrect(firstCard, secondCard);
            feedbackSelect.classList.add("negative-feedback");
            feedbackSelect.innerText = "wrong! try again";
            setTimeout(function () {
              firstCard.style.backgroundColor = "black";
              secondCard.style.backgroundColor = "black";
              feedbackSelect.classList.remove("negative-feedback");
              feedbackSelect.innerText = "Select two cards!";
              openColors = 0;
            }, 2000);
          } else if (firstCard.classList.value !== secondCard.classList.value) {
            reactToCorrect(firstCard, secondCard);
            feedbackSelect.classList.add("positive-feedback");
            feedbackSelect.innerText = "That's Correct. Let's go";
            firstCard.classList.add("solved");
            secondCard.classList.add("solved");
            setTimeout(function () {
              feedbackSelect.classList.remove("positive-feedback");
              feedbackSelect.innerText = "Select two cards!";
              openColors = 0;
            }, 2000);
          } else {
            feedbackSelect.classList.remove("positive-feedback");
            feedbackSelect.innerText = "Select two cards!";
            openColors = 0;
            firstCard.style.backgroundColor = "black";
          }
        }
      }
    });
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  console.log("you just clicked", event.target);
}

function reactToCorrect(elementSelect1, elementSelect2) {
  elementSelect1.style.border = "5px";
  elementSelect2.style.border = "5px";
  elementSelect1.style.borderStyle = "solid";
  elementSelect2.style.borderStyle = "solid";
  elementSelect1.style.borderColor = "green";
  elementSelect2.style.borderColor = "green";

  correctCounter++;
  setTimeout(function () {
    if (correctCounter > 4) {
      let tempElement;
      let winScreenSelect = document.createElement("div");
      winScreenSelect.id = "win-screen";
      tempElement = document.createElement("h1");
      tempElement.innerText = "Good Job!";
      winScreenSelect.append(tempElement);
      tempElement = document.createElement("p");
      tempElement.innerText = "Please enter your name:";
      winScreenSelect.append(tempElement);

      winInputText = document.createElement("input");
      winInputText.type = "text";
      winInputText.id = "win-screen-input-text";
      winInputText.placeholder = "Your Name";
      winScreenSelect.append(winInputText);

      tempElement = document.createElement("button");
      tempElement.id = "win-screen-button";
      tempElement.innerText = "Submit";
      tempElement.addEventListener("click", function () {
        updateLeaderBoard(winInputText.value, numOfTries);
      });
      winScreenSelect.append(tempElement);

      bodySelect.appendChild(winScreenSelect);
    }
  }, 2000);
}

function updateLeaderBoard(playerName, playerScore) {
  console.log("1");
  let inHand = { name: playerName, score: playerScore };
  let temp;
  if (scoreLeaderboard.length < 5) {
    scoreLeaderboard.push(inHand);
  } else {
    for (let i = 0; i < scoreLeaderboard.length; i++) {
      if (inHand.score < scoreLeaderboard[i].score) {
        temp = scoreLeaderboard[i];
        scoreLeaderboard[i] = inHand;
        inHand = temp;
      }
    }
  }
  localStorage.setItem("leaderboard", JSON.stringify(scoreLeaderboard));
  window.location.reload("Refresh");
}

function reactToIncorrect(elementSelect1, elementSelect2) {
  setTimeout(function () {
    elementSelect1.style.left = "10px";
    elementSelect2.style.left = "10px";
    setTimeout(function () {
      elementSelect1.style.left = "-10px";
      elementSelect2.style.left = "-10px";
      setTimeout(function () {
        elementSelect1.style.left = "10px";
        elementSelect2.style.left = "10px";
        setTimeout(function () {
          elementSelect1.style.left = "-10px";
          elementSelect2.style.left = "-10px";
          setTimeout(function () {
            elementSelect1.style.left = "0px";
            elementSelect2.style.left = "0px";
          }, 50);
        }, 50);
      }, 50);
    }, 50);
  }, 50);
}
