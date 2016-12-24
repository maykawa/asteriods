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

var fieldSize = 10;
var explosiveAstTimer = random(500,1200);
var ufoTimer = randome(1000, 2000);

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
    score = new ScoreBoard();
    ship = new Ship();
    field = new AsteriodField(fieldSize);
    ufo = new Ufo();
}

function draw() {
    background(0);
    score.progressLevel();
    if (score.gameStarted && !score.gamePaused) {
        field.update();
        ship.update();
        ufo.update();
    }
    field.display();
    score.display();
    ufo.display();
    ship.display();
}

function ScoreBoard() {
    this.score = 0
    this.gamePaused = false;
    this.gameStarted = false;
    this.gameOver = false;
    this.gameTimer = 0;
    this.gameWin = false;
    this.fire = new FireWorkSky();
    this.winnerSoundPlayed = false;

    this.startGame = function() {
        if (!bedSound.isPlaying()) {
            bedSound.setVolume(0.3);
            bedSound.loop();
        }
        this.gameStarted = true;
    }

    this.updateScore = function(amount) {
        this.score = this.score + amount;
    }

    this.progressLevel = function() {
        this.gameTimer += 1;

        if (!this.gameOver && !this.gameWin) {
            if (this.gameTimer == explosiveAstTimer) {
                field.introduceExplosiveAsteriod();
            }
            if (this.gameTimer == ufoTimer) {
                ufo.shipLaunch();
            }
        }
    }

    this.checkEndOfGame = function() {
        if (field.isFieldEmpty()) {
            console.log('winner');
            this.gameWin = true;
            bedSound.stop();
        }
    }

    this.endGame = function() {
        console.log("game ended");
        this.gameOver = true;
        bedSound.stop();
    }

    this.convertTimerToTime = function(t) {
        //60FPS is default for p5.js
        var secs = this.gameTimer / 60;
        var mins = (secs / 60).toFixed(0);
        var displaySecs = (secs % 60).toFixed(2);
        return mins + ":" + displaySecs
    }

    this.display = function() {
        push();
        textAlign(CENTER);
        fill(255);
        if (!this.gameStarted) {
            translate(width / 2, height / 3);
            text("PRESS 'S' TO BEGIN ", 0, 0);
        } else if (this.gameOver) {
            translate(width / 2, height / 2);
            text("GAME OVER ", 0, 0);
            text("score " + this.score, 0, 20);
        } else if (this.gameWin) {
            translate(width / 2, height / 2);
            if (!this.winnerSoundPlayed) {
                winnerSound.play();
                this.winnerSoundPlayed = true;
            }
            this.fire.display();
            text("YOU WIN !! ", 0, 0);
            text("score " + this.score, 0, 20);
        } else if (this.gamePaused) {
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

function FireWorkSky() {
    this.blasts = [];
    this.done = false;
    for (var i = 0; i < 20; i++) {
        this.blasts.push(new FireWork());
    }

    this.display = function() {
        for (var i = 0; i < this.blasts.length; i++) {
            this.blasts[i].explodeFireWork();
        }
    }
}

function FireWork() {
    this.explodeRing = random(255);
    this.size = random(15);
    this.pos = createVector(random(-width / 3, width / 3), random(-height / 3, height / 3));

    this.explodeFireWork = function() {
        if (this.explodeRing > 0) {
            var dia = map(this.explodeRing, 255, 0, this.size, 220);
            push()
            noFill();

            stroke(this.explodeRing, this.explodeRing, 100);
            strokeWeight(1);
            ellipse(this.pos.x, this.pos.y, dia * 0.3);

            stroke(this.explodeRing, 0, 0);
            strokeWeight(2);
            ellipse(this.pos.x, this.pos.y, dia * 0.8);

            stroke(100, 120, 100);
            strokeWeight(1);
            ellipse(this.pos.x, this.pos.y, dia);

            pop();
            this.explodeRing = this.explodeRing - 1;
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
        score.gamePaused = !score.gamePaused;
    }

    if (!score.gamePaused && !ship.crashed) {
        if (key == ' ') {
            ship.fireLaser();
        } else if (keyCode == RIGHT_ARROW) {
            ship.setRotation(0.1);
        } else if (keyCode == LEFT_ARROW) {
            ship.setRotation(-0.1);
        } else if (keyCode == UP_ARROW) {
            ship.startThrust();
        } else if (keyCode == 83) {
            //'s' key
            score.startGame();
            //ufo.shipLaunch();
            //console.log('engage ufo');
        }
    }
}
