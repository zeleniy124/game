// GENERAL VARIABLES
var cnv;
var score, points = 0;
var lives, x = 0;
var isPlay = false;
var isGameOver = false; // Add a flag for game over state
var gravity = 0.1;
var sword;
var fruit = [];

var fruitsList = ['apple', 'banana', 'peach', 'strawberry', 'watermelon', 'boom'];
var fruitsImgs = [], slicedFruitsImgs = [];
var livesImgs = [], livesImgs2 = [];
var boom, spliced, missed, over, start; // sounds
var bg, fruitLogo, ninjaLogo, scoreImg, newGameImg, fruitImg, gameOverImg; // images
let appleLinkArea, bananaLinkArea, peachLinkArea, strawberryLinkArea, watermelonLinkArea;
let facebookLinkArea, twitterLinkArea, instagramLinkArea;
let facebookImg, twitterImg, instagramImg;
let backButton;

// Base URL for the server
const SERVER_URL = 'http://localhost:5000'; // Dynamically determine the server URL


// Generate or retrieve session ID from local storage
let sessionId = localStorage.getItem('sessionId');
if (!sessionId) {
    sessionId = Math.random().toString(36).substring(7);
    localStorage.setItem('sessionId', sessionId);
}


function preload() {
    // LOAD SOUNDS
    boom = loadSound('sounds/boom.mp3');
    spliced = loadSound('sounds/splatter.mp3');
    missed = loadSound('sounds/missed.mp3');
    start = loadSound('sounds/start.mp3');
    over = loadSound('sounds/over.mp3');

    // LOAD IMAGES
    for (var i = 0; i < fruitsList.length - 1; i++) {
        slicedFruitsImgs[2 * i] = loadImage('images/' + fruitsList[i] + '-1.png');
        slicedFruitsImgs[2 * i + 1] = loadImage('images/' + fruitsList[i] + '-2.png');
    }
    for (var i = 0; i < fruitsList.length; i++) {
        fruitsImgs[i] = loadImage('images/' + fruitsList[i] + '.png');
    }
    for (var i = 0; i < 3; i++) {
        livesImgs[i] = loadImage('images/x' + (i + 1) + '.png');
    }
    for (var i = 0; i < 3; i++) {
        livesImgs2[i] = loadImage('images/xx' + (i + 1) + '.png');
    }
    bg = loadImage('images/bg.png');
    fruitLogo = loadImage('images/fruit.png');
    ninjaLogo = loadImage('images/ninja.png');
    scoreImg = loadImage('images/score.png');
    newGameImg = loadImage('images/new-game.png');
    fruitImg = loadImage('images/fruitMode.png');
    gameOverImg = loadImage('images/game-over.png');

    // LOAD SOCIAL MEDIA IMAGES
    facebookImg = loadImage('images/pump.png');
    twitterImg = loadImage('images/x.png');
    instagramImg = loadImage('images/telegram.png');

    customFont = loadFont('go3v2.ttf');

}

function setup() {
    cnv = createCanvas(800, 635);
    sword = new Sword(color("#FFFFFF"));
    frameRate(60);
    score = 0;
    lives = 3;

    // Attach the mouseClicked event handler to the canvas
    cnv.mouseClicked(check);

    // Fetch and display the scoreboard
    fetchScores();

    textFont(customFont); // Set the custom font


    // Define clickable areas for fruit images
    appleLinkArea = { x: 50, y: 500, w: 90, h: 90 };
    bananaLinkArea = { x: 150, y: 500, w: 90, h: 90 };
    peachLinkArea = { x: 250, y: 500, w: 90, h: 90 };
    strawberryLinkArea = { x: 350, y: 500, w: 90, h: 90 };
    watermelonLinkArea = { x: 450, y: 500, w: 90, h: 90 };

    // Define clickable areas for social media images
    facebookLinkArea = { x: 330, y: 260, w: 50, h: 50 };
    twitterLinkArea = { x: 390, y: 260, w: 50, h: 50 };
    instagramLinkArea = { x: 450, y: 260, w: 50, h: 50 };
}

function draw() {
    clear();
    background(bg);

    if (!isPlay && !isGameOver) {
        // Draw main screen images
        image(fruitLogo, 40, 20, 358, 195);
        image(ninjaLogo, 420, 50, 318, 165);
        image(newGameImg, 310, 360, 200, 200);
        image(fruitImg, 365, 415, 90, 90);

        // Draw social media images
        image(facebookImg, facebookLinkArea.x, facebookLinkArea.y, facebookLinkArea.w, facebookLinkArea.h);
        image(twitterImg, twitterLinkArea.x, twitterLinkArea.y, twitterLinkArea.w, twitterLinkArea.h);
        image(instagramImg, instagramLinkArea.x, instagramLinkArea.y, instagramLinkArea.w, instagramLinkArea.h);
    } else if (isPlay) {
        game();
    } else if (isGameOver) {
        drawGameOver();
    }
}

function check() { // Check for game start
    if (!isPlay && !isGameOver && mouseX > 310 && mouseX < 510 && mouseY > 360 && mouseY < 560) {
        start.play();
        isPlay = true;
    }

    // Check for fruit image clicks and redirect
    if (!isPlay && !isGameOver) {
        if (mouseX > appleLinkArea.x && mouseX < appleLinkArea.x + appleLinkArea.w &&
            mouseY > appleLinkArea.y && mouseY < appleLinkArea.y + appleLinkArea.h) {
            window.open('https://example.com/apple', '_blank');
        } else if (mouseX > bananaLinkArea.x && mouseX < bananaLinkArea.x + bananaLinkArea.w &&
            mouseY > bananaLinkArea.y && mouseY < bananaLinkArea.y + bananaLinkArea.h) {
            window.open('https://example.com/banana', '_blank');
        } else if (mouseX > peachLinkArea.x && mouseX < peachLinkArea.x + peachLinkArea.w &&
            mouseY > peachLinkArea.y && mouseY < peachLinkArea.y + peachLinkArea.h) {
            window.open('https://example.com/peach', '_blank');
        } else if (mouseX > strawberryLinkArea.x && mouseX < strawberryLinkArea.x + strawberryLinkArea.w &&
            mouseY > strawberryLinkArea.y && mouseY < strawberryLinkArea.y + strawberryLinkArea.h) {
            window.open('https://example.com/strawberry', '_blank');
        } else if (mouseX > watermelonLinkArea.x && mouseX < watermelonLinkArea.x + watermelonLinkArea.w &&
            mouseY > watermelonLinkArea.y && mouseY < watermelonLinkArea.y + watermelonLinkArea.h) {
            window.open('https://example.com/watermelon', '_blank');
        }

        // Check for social media image clicks and redirect
        if (mouseX > facebookLinkArea.x && mouseX < facebookLinkArea.x + facebookLinkArea.w &&
            mouseY > facebookLinkArea.y && mouseY < facebookLinkArea.y + facebookLinkArea.h) {
            window.open('https://pump.fun/board', '_blank');
        } else if (mouseX > twitterLinkArea.x && mouseX < twitterLinkArea.x + twitterLinkArea.w &&
            mouseY > twitterLinkArea.y && mouseY < twitterLinkArea.y + twitterLinkArea.h) {
            window.open('https://x.com/pumpninjaonsol', '_blank');
        } else if (mouseX > instagramLinkArea.x && mouseX < instagramLinkArea.x + instagramLinkArea.w &&
            mouseY > instagramLinkArea.y && mouseY < instagramLinkArea.y + instagramLinkArea.h) {
            window.open('https://t.me/pumpninjatoken', '_blank');
        }
    }
}

function game() {
    clear();
    background(bg);
    if (mouseIsPressed) { // Draw sword
        sword.swipe(mouseX, mouseY);
    }
    if (frameCount % 5 === 0) {
        if (noise(frameCount) > 0.69) {
            fruit.push(randomFruit()); // Display new fruit
        }
    }
    points = 0;
    for (var i = fruit.length - 1; i >= 0; i--) {
        fruit[i].update();
        fruit[i].draw();
        if (!fruit[i].visible) {
            if (!fruit[i].sliced && fruit[i].name != 'boom') { // Missed fruit
                image(livesImgs2[0], fruit[i].x, fruit[i].y - 120, 50, 50);
                missed.play();
                lives--;
                x++;
            }
            if (lives < 1) { // Check for lives
                gameOver();
            }
            fruit.splice(i, 1);
        } else {
            if (fruit[i].sliced && fruit[i].name == 'boom') { // Check for bomb
                boom.play();
                gameOver();
            }
            if (sword.checkSlice(fruit[i]) && fruit[i].name != 'boom') { // Sliced fruit
                spliced.play();
                points++;
                fruit[i].update();
                fruit[i].draw();
            }
        }
    }
    if (frameCount % 2 === 0) {
        sword.update();
    }
    sword.draw();
    score += points;
    drawScore();
    drawLives();
}

function drawLives() {
    image(livesImgs[0], width - 110, 20, livesImgs[0].width, livesImgs[0].height);
    image(livesImgs[1], width - 88, 20, livesImgs[1].width, livesImgs[1].height);
    image(livesImgs[2], width - 60, 20, livesImgs[2].width, livesImgs[2].height);
    if (lives <= 2) {
        image(livesImgs2[0], width - 110, 20, livesImgs2[0].width, livesImgs2[0].height);
    }
    if (lives <= 1) {
        image(livesImgs2[1], width - 88, 20, livesImgs2[1].width, livesImgs2[1].height);
    }
    if (lives === 0) {
        image(livesImgs2[2], width - 60, 20, livesImgs2[2].width, livesImgs2[2].height);
    }
}

function drawScore() {
    image(scoreImg, 10, 10, 40, 40);
    textAlign(LEFT);
    noStroke();
    fill(255, 147, 21);
    textSize(50);
    text(score, 50, 50);
}

function gameOver() {
    noLoop();
    over.play();
    isGameOver = true;

    saveScore(sessionId, score);

    drawGameOver();
}

function saveScore(sessionId, score) {
    fetch(`${SERVER_URL}/api/score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId, score })
    }).then(response => response.text())
      .then(data => {
          console.log(data);
          fetchScores(); // Update scores after saving
      })
      .catch(error => console.error('Error:', error));
}

function fetchScores() {
    fetch(`${SERVER_URL}/api/scores`)
        .then(response => response.json())
        .then(scores => {
            let scoreboard = document.getElementById('scoreboard');
            scoreboard.innerHTML = '<h2>Top Scores</h2>';
            scores.forEach((score, index) => {
                let scoreItem = document.createElement('div');
                scoreItem.classList.add('score-item');
                if (score.sessionId === sessionId) {
                    scoreItem.innerText = `${index + 1}. ${score.sessionId} (you): ${score.score}`;
                    scoreItem.classList.add('you'); // Highlight the player's score
                } else {
                    scoreItem.innerText = `${index + 1}. ${score.sessionId}: ${score.score}`;
                }
                scoreboard.appendChild(scoreItem);
            });
        })
        .catch(error => console.error('Error:', error));
}


function drawGameOver() {
    clear();
    background(bg);
    image(gameOverImg, 155, 260, 490, 85);
    lives = 0;

    // Create "Go Back to Menu" button
    if (!backButton) {
        backButton = createButton('Go Back to Menu');
        backButton.position(cnv.position().x + 250, cnv.position().y + 350); // Adjust the position to be within the canvas
        backButton.mousePressed(resetGame);
        backButton.class('btn'); // Add a class for styling
    }
    console.log("lost");
}

function resetGame() {
    // Reset game state
    score = 0;
    points = 0;
    lives = 3;
    x = 0;
    fruit = [];
    isPlay = false;
    isGameOver = false;

    // Remove the button
    if (backButton) {
        backButton.remove();
        backButton = null;
    }

    // Restart the game
    loop();
}