// variables
const startPlayBtn = document.querySelector("#start-play"),
  goBackBtn = document.querySelector(".go-back"),
  goHomeBtn = document.querySelector(".go-home"),
  againPlayBtn = document.querySelector(".again-play"),
  welcomePage = document.querySelector(".welcome-page"),
  questionsPage = document.querySelector(".questions-page"),
  endGamePage = document.querySelector(".end-game-page"),
  endGameIcon = document.querySelector(".end-game-icon i"),
  endGamePageScore = document.querySelector(".end-game-score"),
  endGameTitle = document.querySelector(".end-game-title"),
  correctAnswer = document.querySelector(".correct-answer"),
  questions = document.querySelector("#questions"),
  optionFiftyBtn = document.querySelector(".option-fifty-fifty"),
  optionPassBtn = document.querySelector(".option-pass"),
  score = document.querySelector(".score-content"),
  countdownUi = document.querySelector(".question-countdown");

let scoreCounter = 0,
  second = 16,
  countdownSecond = second,
  countdown;
score.innerHTML = scoreCounter;
endGamePageScore.innerHTML = scoreCounter;

// events
startPlayBtn.addEventListener("click", startPlay);
goBackBtn.addEventListener("click", goBack);
goHomeBtn.addEventListener("click", goHome);
againPlayBtn.addEventListener("click", againPlay);
optionPassBtn.addEventListener("click", optionPass);

// start play
function startPlay() {
  welcomePage.classList.add("hide");
  questionsPage.classList.add("show");
  optionFiftyBtn.classList.remove("passive");
  optionPassBtn.classList.remove("passive");
  countdownSecond = second;
  countdown = setInterval(questionCountdown, 1000);
}

// go back
function goBack() {
  welcomePage.classList.remove("hide");
  questionsPage.classList.remove("show");
  clearInterval(countdown);
  resetQuestion();
}

// go home
function goHome() {
  welcomePage.classList.remove("hide");
  endGamePage.classList.remove("show");
  questionsPage.classList.remove("show");
  setTimeout(() => {
    scoreCounter = 0;
    endGamePageScore.innerHTML = scoreCounter;
    correctAnswer.innerHTML = "";
  }, 300);
}

// again play
function againPlay() {
  countdownSecond = second;
  countdown = setInterval(questionCountdown, 1000);
  endGamePage.classList.remove("show");
  optionFiftyBtn.classList.remove("passive");
  optionPassBtn.classList.remove("passive");
  setTimeout(() => {
    scoreCounter = 0;
    endGamePageScore.innerHTML = scoreCounter;
    correctAnswer.innerHTML = "";
  }, 300);
}

// option pass
function optionPass() {
  questionSlides.slideNext();
  optionPassBtn.classList.add("passive");
  scoreCounter = scoreCounter - 100;
  score.innerHTML = scoreCounter;
  countdownSecond = second;
  resetAnswer(200);
}

// get questions
function getQuestions() {
  fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
      data.questions.forEach((question, q) => {
        let questionWrapper = document.createElement("div"),
          questionTitle = document.createElement("div"),
          questionAnswers = document.createElement("ul"),
          questionSlide = document.createElement("div");

        questionWrapper.className = "question";
        questionTitle.className = "question-title";
        questionAnswers.className = "question-answers";
        questionSlide.className = "swiper-slide";

        // title
        questionTitle.append(question.title);

        // answers
        question.answers.forEach((answer, index) => {
          let questionAnswerItem = document.createElement("li");

          questionAnswerItem.append(answer);
          questionAnswers.append(questionAnswerItem);

          questionAnswerItem.addEventListener("click", () => {
            // correct - wrong control
            if (index == question.correctIndex) {
              questionAnswerItem.classList.add("correct");

              scoreCounter = scoreCounter + 100;
              score.innerHTML = scoreCounter;
              endGamePageScore.innerHTML = scoreCounter;
              score.classList.add("active");

              countdownSecond = second;

              setTimeout(() => {
                questionSlides.slideNext();
                score.classList.remove("active");
              }, 600);
            } else {
              questionAnswerItem.classList.add("incorrect");
              endGamePage.classList.add("show");
              correctAnswer.innerHTML = `
                            "${question.answers[question.correctIndex]}"
                            <span>olacaktı.</span>
                        `;
              endGame("Oops", "Yanlıs cevap!", "icon-wrong");
              clearInterval(countdown);
              resetQuestion();
            }

            // all questions true
            if (q == data.questions.length - 1) {
              endGamePage.classList.add("show");
              if (index !== question.correctIndex) {
                endGame("Oops", "Yanlıs cevap!", "icon-wrong");
              } else {
                endGame("Iste bu", "Oyun bitti!", "icon-winner");
              }
              clearInterval(countdown);
              resetQuestion();
            }

            resetAnswer(800);
          });
        });

        // option fifty fifty
        optionFiftyBtn.addEventListener("click", () => {
          let correctAnswerIndex = question.answers[question.correctIndex],
            findCorrectEl = question.answers.indexOf(correctAnswerIndex),
            removeCorrectEl,
            randomRemoveWrongEl;

          optionFiftyBtn.classList.add("passive");

          if (findCorrectEl !== -1) {
            removeCorrectEl = question.answers.splice(findCorrectEl, 1);
            randomRemoveWrongEl = question.answers.splice(
              Math.floor(Math.random() * question.answers.length),
              1
            );
          }

          // random deleted 2 answer
          question.answers.forEach((wrongAnswer) => {
            let answersEl = document.querySelectorAll(".question-answers li");

            answersEl.forEach((el) => {
              if (el.textContent === wrongAnswer) {
                el.classList.add("hidden");
              }
            });
          });

          // undo splice
          setTimeout(() => {
            question.answers.splice(0, 0, ...randomRemoveWrongEl);
            question.answers.splice(findCorrectEl, 0, ...removeCorrectEl);
          }, 50);
        });

        questionWrapper.append(questionTitle);
        questionWrapper.append(questionAnswers);

        questionSlide.append(questionWrapper);
        questions.append(questionSlide);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// questions carousel
let questionSlides = new Swiper(".questions-container", {
  spaceBetween: 30,
  noSwipingClass: "questions-container",
});

setTimeout(() => {
  questionSlides.update();
}, 500);

// countdown
function questionCountdown() {
  countdownSecond = countdownSecond - 1;

  if (countdownSecond < 1) {
    countdownSecond = 0;
    endGamePage.classList.add("show");
    countdownUi.classList.remove("last-times");
    endGame("Oops", "Sure bitti!", "icon-hourglass");
    clearInterval(countdown);
    resetQuestion();
  } else if (countdownSecond <= 5) {
    countdownUi.classList.add("last-times");
  } else {
    countdownUi.classList.remove("last-times");
  }

  countdownUi.innerHTML = countdownSecond;
}

// reset question
function resetQuestion() {
  setTimeout(() => {
    questionSlides.slideTo(0);
    scoreCounter = 0;
    score.innerHTML = scoreCounter;
  }, 300);
}

// reset answer
function resetAnswer(time) {
  let answersEl = document.querySelectorAll(".question-answers li");
  setTimeout(() => {
    answersEl.forEach((el) => {
      el.className = "";
    });
  }, time);
}

// end game
function endGame(title, text, icon) {
  endGameIcon.className = icon;
  endGameTitle.innerHTML = `${title}, <span>${text}</span>`;
}

// modal
function openModal(id) {
  let modal = document.getElementById(id);
  modal.parentElement.classList.add("show");
}

// close modal
function closeModal(id) {
  let modal = document.getElementById(id);
  modal.parentElement.classList.remove("show");
}

getQuestions();
