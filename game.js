// asteriods: an old style video shooter game
// original framework of the game provided by Daniel Shiffman
// highly leverage P5.js libararies
// sound files all taken from creative commons internet sources
// the rest was all me, Matt Mayfeld, Dec 2016

var ship;
var ufo;
var field;
var score;

var fireSound;
var hitSound;
var explodeSound;
var thrustSound;
var winnerSound;
var ufoLaserSound;
var bedSound;

function preload() {
    fireSound = loadSound('sounds/fire3.mp3');
    hitSound = loadSound('sounds/hit.mp3');
    thrustSound = loadSound('sounds/thrust.mp3');
    explodeSound = loadSound('sounds/exp.mp3');
    winnerSound = loadSound('sounds/winner.wav');
    ufoLaserSound = loadSound('sounds/ufo_highpitch.wav');
    bedSound = loadSound('sounds/bed.mp3');
}

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    score = new ScoreBoard(); //this first to start the game
    field = new AsteriodField(score.fieldSize);
    ship = new Ship();
    ufo = new Ufo();
}

function resetGame() {
    field = new AsteriodField(score.fieldSize);
    ufo = new Ufo();
}

function draw() {
    background(0);
    if (score.gameInPlay()) {
        score.updateGame();
        field.update();
        ufo.update();
        ship.update();
    }
    field.display();
    ufo.display();
    ship.display();
    score.display();
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
    if (keyCode == 80 && !score.gameOver) { //'p' key
        score.gamePaused = !score.gamePaused;
    }

    if (keyCode == 83) { //'s ' key
        if (!score.gameWin && !score.gameOver) {
            score.startGame();
            console.log('  start game');
        } else if (score.gameInPlay() && score.gameWin) {
            score.startNextLevel();
            console.log('advance game');
        }
    }

    if (keyCode == 66) { //'b' key
        ship.usePanicBomb();
    }

    if (score.gameInPlay() && !ship.crashed) {
        if (key == ' ') {
            ship.fireLaser();
        } else if (keyCode == RIGHT_ARROW) {
            ship.setRotation(0.1);
        } else if (keyCode == LEFT_ARROW) {
            ship.setRotation(-0.1);
        } else if (keyCode == UP_ARROW) {
            ship.startThrust();
        } else if (keyCode == DOWN_ARROW) {
            //score.startNextLevel();
            //ship.reloadPanicBomb();
        }
    }
}
