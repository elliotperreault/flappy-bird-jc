const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// general settings
let gamePlaying = false;
let bestScore = localStorage.getItem('bestScore') || 0;
const gravity = 0.65;
const speed = 2.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

const goodAudio = new Audio('./good.mp3');
const badAudio = new Audio('./wrong.mp3');

let index = 0,
  flight,
  flyHeight,
  currentScore,
  pipe;

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  if (gamePlaying != "paused") {
    // make the pipe and bird moving 
    index++;

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background first part 
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    // background second part
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

    // pipe display
    if (gamePlaying) {
      pipes.map(pipe => {
        // pipe moving
        pipe[0] -= speed;

        // top pipe
        ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
        // bottom pipe
        ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

        // give 1 point & create new pipe
        if (pipe[0] <= -pipeWidth) {
          currentScore++;
          if (currentScore % 3 === 0) {
            gamePlaying = "paused"
            askRandomQuestion()

          }
          // check if it's the best score
          bestScore = Math.max(bestScore, currentScore);
          localStorage.setItem('bestScore', bestScore);

          // remove & create new pipe
          pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
        }

        // if hit the pipe, end
        if ([
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
        ].every(elem => elem)) {
          document.getElementsByClassName('parent')[0].style.gridTemplateColumns = '2fr 1fr'
          document.getElementById("leftSide").style.display = "grid";
          gamePlaying = false;
          setup();
        }
      })
    }

    // draw bird
    if (gamePlaying) {
      ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
      flight += gravity;
      flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);


    }
    else {
      ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
      flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
      ctx.fillText(`Best score : ${bestScore}`, 85, 245);
      ctx.fillText('Space to start', 90, 535);
      ctx.font = "bold 30px courier";

    }

    document.getElementById('bestScore').innerHTML = `Best : ${localStorage.getItem('bestScore') || 0}`;
    document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

    // tell the browser to perform animation
    window.requestAnimationFrame(render);
  } else {

  }
}

// launch setup
setup();
img.onload = render;

// start game
window.onclick = () => flight = jump;

window.onkeydown = (e) => {
  if (e.code === 'Space') {
    scrollTo(0, 0)
    if (document.getElementById('centeredDiv') == null) {
      if (Object.keys(JSON.parse(localStorage.getItem('question'))) != 0) {
        if (gamePlaying == false) {
          document.getElementById("leftSide").style.display = "none";
          gamePlaying = true;
          document.getElementsByClassName('parent')[0].style.gridTemplateColumns = '2fr 1fr 2fr'

        }

        flight = jump;
      } else {
        alert("Please add questions first")
      }
    }
  } else if (e.code === 'Enter') {
    try {
      document.getElementById('button').click()
    }
    catch (e) {
      document.getElementById('OKButton').click()
    }
  }
}


function askRandomQuestion() {
  questions = JSON.parse(localStorage.getItem("question"))
  randomNumber = Math.floor(Math.random() * Object.keys(questions).length)
  question = Object.keys(questions)[randomNumber]
  answer = questions[question]
  // Create a custom alert with an input and an OK button


  // Call the customAlert function
  const centeredDiv = document.createElement('div');
  centeredDiv.id = 'questionCenteredDiv';



  const p = document.createElement('p');
  p.textContent = question



  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter your answer';
  input.style.marginBottom = '10px';
  input.id = 'AnswerInput';
  input.autofocus = true

  const button = document.createElement('button');
  button.textContent = 'OK';
  button.style.padding = '5px 10px';
  button.style.cursor = 'pointer';

  button.id = 'OKButton'

  centeredDiv.append(p)
  centeredDiv.appendChild(input);
  centeredDiv.appendChild(button);

  document.body.appendChild(centeredDiv);

  document.getElementById(button.id).addEventListener('click', (e) => {

    if (input.value == answer) {
      goodAudio.play()
      gamePlaying = true
      render()
    } else {
      badAudio.play()
      setTimeout(() => {
        location.reload()
      }, 400)
    }

    centeredDiv.remove();
  });


}



