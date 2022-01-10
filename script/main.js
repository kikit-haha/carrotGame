"use strict";

window.addEventListener("load", loadEvent);

function loadEvent() {
  const carrotRect = 80;

  const usingGround = document.querySelector(".using_ground");
  const ground_wrap = document.querySelector(".ground_wrap");
  const timer = document.querySelector(".timer");

  let width = usingGround.getBoundingClientRect().width - carrotRect;
  let height = usingGround.getBoundingClientRect().height - carrotRect;

  const button = document.querySelector(".button");
  const play_button = document.querySelector(".play_btn");
  const alert = document.querySelector(".alert");
  const countdown_carrots = document.querySelector(".count_carrots");
  let _timer;

  //상태관리변수
  let PLAY = false;
  const PLAY_TIME = 10;
  let CARROT_COUNT = 10;

  //게임의 상태를 기억하는 변수
  let score = 0;

  let carrots = document.querySelectorAll(".carrot");
  let bugs;
  let replay_btn = document.querySelector(".fa-redo");
  timer.innerText = PLAY_TIME;

  const bg = new Audio("sound/bg.mp3");
  const bug_pull = new Audio("sound/bug_pull.mp3");
  const carrot_pull = new Audio("sound/carrot_pull.mp3");
  const winning = new Audio("sound/game_win.mp3");
  const alert_sound = new Audio("sound/alert.wav");

  window.addEventListener("resize", () => {
    width = usingGround.getBoundingClientRect().width;
    height = usingGround.getBoundingClientRect().height;
  });

  button.addEventListener("click", () => {
    if (play_button.classList.contains("pause_btn")) {
      play_button.setAttribute(
        "class",
        "far fa-caret-square-right btn play_btn",
      );
      game_end(_timer, "You lose", alert_sound);
      return;
    }
    start_game();
  });

  ground_wrap.addEventListener("click", (e) => {
    if (!PLAY) {
      return;
    }
    const target = e.target;

    if (target.matches(".carrot")) {
      playSound(carrot_pull);
      target.remove();
      score++;
      updateScore();

      if (score === CARROT_COUNT) {
        game_end(_timer, "you win!", winning);
      }
    } else if (target.matches(".bug")) {
      game_end(_timer, "You clicked the bug!", bug_pull);
    }
  });

  //시작버튼
  function start_game() {
    PLAY = true;
    initGame();
    playSound(bg);

    makeElements("carrot", 10);
    makeElements("bug", 10);
    timer_handler();
  }

  function initGame() {
    countdown_carrots.innerText = CARROT_COUNT;
    score = 0;
    play_button.style.display = "block";
    timer.style.display = "flex";
    countdown_carrots.style.display = "flex";
    countdown_carrots.style.opacity = 1;

    play_button.setAttribute("class", "far fa-stop-circle btn pause_btn");
  }

  function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  function makeElements(elem, num) {
    for (let i = 0; i < num; i++) {
      let randomLeft = Math.random() * width;
      let randomTop = Math.random() * height;

      let elementName;

      elementName = document.createElement("img");
      elementName.setAttribute("src", `./img/${elem}.png`);
      elementName.setAttribute("class", `${elem}`);
      elementName.setAttribute("data-id", i);
      elementName.style.transform = `translate(${randomLeft}px, ${randomTop}px)`;

      usingGround.append(elementName);
    }
  }

  //타이머

  function timer_handler() {
    let t = PLAY_TIME;
    updateTimerText(t);
    _timer = setInterval(() => {
      if (t == 0) {
        game_end(_timer, "You lose!", alert_sound);
        return;
      }
      updateTimerText(--t);
    }, 1000);
  }

  function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timer.innerText = `${minutes} : ${seconds}`;
  }

  //시간끝나면
  function timeout() {
    delete_elem();
  }

  //중지버튼,시간종료, 벌레누름, 다 잡음(당근==0)
  function finish_message(word) {
    const text = `
      <div class="restart">
        <i class="fas fa-redo"></i>
        <div class="comment">Replay?</div>
      </div>
      <div class="status">${word}</div>
    `;
    alert.style.display = "block";
    alert.innerHTML = text;
  }

  //다시시작
  function redo() {
    alert.style.display = "none";
    start_game();
    timer_handler();
  }

  //게임 끝나고 벌레,당근 삭제
  function delete_elem() {
    carrots = document.querySelectorAll(".carrot");
    bugs = document.querySelectorAll(".bug");

    carrots.forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });

    bugs.forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });
  }

  function game_end(_timer, message, sound) {
    PLAY = false;
    clearInterval(_timer);
    bg.pause();
    playSound(sound);

    play_button.style.display = "none";
    countdown_carrots.style.display = "none";
    timer.style.display = "none";

    delete_elem();
    finish_message(message);
    //다시시작

    replay_btn = document.querySelector(".fa-redo");
    replay_btn.addEventListener("click", () => {
      alert.style.display = "none";
      start_game();
    });
  }

  function updateScore() {
    countdown_carrots.innerText = CARROT_COUNT - score;
  }
}
