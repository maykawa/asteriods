function ScoreBoard() {

    this.gameLevel = 1;
    this.score = 0
    this.gameTimer = 0;

    this.gameStarted = false;
    this.gamePaused = false;
    this.gameOver = false;
    this.gameWin = false;

    //Initial values reset for each level
    this.fieldSize = 4; //starting number of asteriods
    this.explosiveAstTimer = floor(random(700, 1200));
    this.ufoTimer = floor(random(1200, 2000));
    this.fire = new FireWorkSky();
    this.winnerSoundPlayed = false;

    this.gameInPlay = function() {
        if (this.gameStarted && !this.gamePaused) {
            return true;
        } else {
            return false;
        }
    }

    this.startGame = function() {
        if (!bedSound.isPlaying()) {
            bedSound.setVolume(0.3);
            bedSound.loop();
        }
        this.gameStarted = true;
    }

    this.updateGame = function() {
        if (!this.gameOver && !this.gameWin && !this.gamePaused) {
            this.gameTimer += 1;
            if (this.gameTimer == this.explosiveAstTimer) {
                field.introduceExplosiveAsteriod();
            }

            if (this.gameTimer == this.ufoTimer) {
                ufo.shipLaunch();
            }
        }
    }

    this.startNextLevel = function() {
        //advances the round
        this.gameLevel += 1;
        this.fieldSize += floor(this.fieldSize / 2);
        this.explosiveAstTimer = this.gameTimer + floor(random(700, 1200));
        this.ufoTimer = this.gameTimer + floor(random(1200, 2000));

        //reset ship capabilities
        ship.reloadPanicBomb();

        //resets the score object
        this.gameWin = false;
        winnerSound.stop();
        this.winnerSoundPlayed = false;
        this.fire = new FireWorkSky();

        //restart
        window.resetGame();
        this.startGame();
    }

    this.checkEndOfGame = function() {
        if (field.isFieldEmpty()) {
            console.log('complete level');
            this.gameWin = true;
            bedSound.stop();
            this.finishLevel();
        }
    }

    this.finishLevel = function() {
        if (!this.winnerSoundPlayed) {
            winnerSound.play();
            this.winnerSoundPlayed = true;
        }
        this.fire.display();
    }

    this.endGame = function() {
        console.log("game ended");
        this.gameOver = true;
        bedSound.stop();
    }

    this.updateScore = function(amount) {
        this.score = this.score + amount;
    }

    this.display = function() {
        push();
        textAlign(CENTER);
        fill(255);
        if (!this.gameStarted) {
            translate(width / 2, height / 2);
            text("PRESS 'S' TO BEGIN ", 0, 30);
        } else if (this.gameOver) {
            translate(width / 2, height / 2);
            text("GAME OVER ", 0, 0);
            text("score " + this.score + " at level " + this.gameLevel, 0, 20);
        } else if (this.gameWin) {
            translate(width / 2, height / 2);
            text(">>  LEVEL " + (this.gameLevel + 1) + "  <<", 0, 0);
            text("score " + this.score, 0, 20);
            text("PRESS 'S' TO BEGIN ", 0, 50);
        } else if (this.gamePaused) {
            translate(width / 2, height / 2);
            text("GAME PAUSED ", 0, 0);
        } else {
            textAlign(LEFT);
            translate(30, 25);
            text("level: " + this.gameLevel + "   score: " + this.score + "   time: " + this.convertTimerToTime(), 0, 0);
        }
        pop();
    }

    this.convertTimerToTime = function(t) {
        //60FPS is default for p5.js
        var secs = this.gameTimer / 60;
        var mins = (secs / 60).toFixed(0);
        var displaySecs = (secs % 60).toFixed(2);
        return mins + ":" + displaySecs;
    }

}




///------------------

function FireWorkSky() {
    this.blasts = [];
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
    this.size = random(5, 30);
    this.pos = createVector(random(-width / 3, width / 3), random(-height / 3, height / 3));
};

FireWork.prototype.explodeFireWork = function() {
    if (this.explodeRing > 0) {
        var dia = map(this.explodeRing, 300, 0, this.size, 220);
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
};
