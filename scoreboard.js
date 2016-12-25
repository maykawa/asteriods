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
