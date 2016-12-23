var ship;
var ufo;
var field;
//var lasers = [];
var score;
var fireSound;
var hitSound;
var explodeSound;
var thrustSound;
// var doneImage;
var gamePaused;
var gameOver;
var gameTimer;

function preload() {
    fireSound = loadSound('sounds/fire3.mp3');
    hitSound = loadSound('sounds/hit.mp3');
    thrustSound = loadSound('sounds/thrust.mp3');
    explodeSound = loadSound('sounds/exp.mp3');
    //  doneImage = loadImage('yeah.gif');
}

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    score = new ScoreBoard();
    ship = new Ship();
    field = new AsteriodField(5);
    ufo = new Ufo();

    gamePaused = false;
    gameOver = false;
    gameTimer = 0;
}


function draw() {
    gameTimer += 1;
    background(0);

    if (!gamePaused) {
        field.update();
        ship.update();
        ufo.update();
    }
    field.display();
    ship.display();
    score.display();
    ufo.display();

    this.progressLevel();
}

this.progressLevel = function() {
    if (gameTimer == 3000) {
        field.introduceExplosiveAsteriod = true;
    }

    if (gameTimer == 4000) {
        ufo.shipLaunch();
    }
}

function ScoreBoard() {
    this.score = 0;

    this.updateScore = function(amount) {
        this.score = this.score + amount;
    }

    this.checkEndOfGame = function() {
        if (field.isFieldEmpty()) {
            this.endGame();
        }
    }

    this.endGame = function() {
        console.log("game ended");
        gameOver = true;
    }

    this.convertTimerToTime = function(t) {
        //30FPS is default for p5.js
        var secs = gameTimer / 60;
        var mins = (secs / 60).toFixed(0);
        var displaySecs = (secs % 60).toFixed(2);
        return mins + ":" + displaySecs
    }

    this.display = function() {
        push();
        textAlign(CENTER);
        fill(255);
        if (gameOver) {
            translate(width / 2, height / 2);
            text("GAME OVER ", 0, 0);
            text("score " + this.score, 0, 15);
        } else if (gamePaused) {
            translate(width / 2, height / 2);
            text("GAME PAUSED ", 0, 0);
        } else {
            textAlign(LEFT);
            translate(30, 25);
            text("score: " + this.score + "   time: " + this.convertTimerToTime(), 0, 0);
        }
        pop();
    }
}




function keyReleased() {
    if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
        ship.setRotation(0);
    }
    if (keyCode == UP_ARROW) {
        ship.stopThrust();
    }
}

function keyPressed() {
    if (keyCode == 80) {
        gamePaused = !gamePaused;
    }

    if (!gamePaused && !ship.crashed) {
        if (key == ' ') {
            ship.fireLaser();
        } else if (keyCode == RIGHT_ARROW) {
            ship.setRotation(0.1);
        } else if (keyCode == LEFT_ARROW) {
            ship.setRotation(-0.1);
        } else if (keyCode == UP_ARROW) {
            ship.startThrust();
        } else if (keyCode == DOWN_ARROW) {
            //ufo.shipLaunch();
            //console.log('engage ufo');
        }
    }
}
