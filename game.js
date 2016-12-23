var ship;
var ufo;
var field;
var lasers = [];
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
    doneImage = loadImage('yeah.gif');
}

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    score = new scoreBoard();
    ship = new Ship();
    field = new AsteriodField(5);

    gamePaused = false;
    gameOver = false;
    gameTimer = 0;

    //temp set up
    //asteriods[0].explosive = true;
    ufo = new Ufo();
}




function draw() {
    gameTimer += 1;
    background(0);
    if (!gamePaused) {
        field.update();
        updateLasers();
        ship.update();
        ufo.update();
    }
    field.display();
    lasers.forEach(drawLasers);
    ship.display();
    score.display();
    ufo.display();


}


function scoreBoard() {
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
            translate(40, 25);
            text("score " + this.score, 0, 0);
        }
        pop();
    }
}

function drawLasers(k) {
    k.display();
}

function updateLasers() {
    for (var j = lasers.length - 1; j >= 0; j--) {
        lasers[j].update();
        if (lasers[j].offscreen()) {
            lasers.splice(j, 1);
        } else {
            for (var i = field.asteriods.length - 1; i >= 0; i--) {
                if (lasers[j].hits(ufo)) {
                    ufo.shipHit();
                    score.updateScore(100);
                } else {




                    // if (lasers[j].hits(asteriods[i])) {
                    //     if (asteriods[i].explosive == true) {
                    //         explodeAllAsteriods();
                    //     } else {
                    //         if (asteriods[i].size > 10) {
                    //             var newAst = asteriods[i].breakup();
                    //             asteriods = asteriods.concat(newAst);
                    //         }
                    //         hitSound.play();
                    //         asteriods.splice(i, 1);
                    //         lasers.splice(j, 1);
                    //         score.updateScore(10);
                    //         score.checkEndOfGame();
                    //         break;
                    //     }
                    // }

                }
            }
        }
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
            ufo.shipLaunch();
            console.log('engage ufo');
        }
    }
}
