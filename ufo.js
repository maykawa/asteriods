function Ufo() {
    this.size = 16;
    this.shipColor = color(103, 248, 91);

    this.pos = createVector(-this.size, random(30, height - 30))
    this.heading = 0
    this.velocity = createVector(2, 0);
    this.waiting = true;

    this.crashed = false;
    this.playExplosion = false;
    this.explodeRingColor = 255;

    this.courseChangeTimer = 0;
    this.fireTimer = 0;
    this.myLasers = [];

    this.update = function() {
        if (!this.waiting && this.isOffScreen() || score.gameWin) {
            this.resetUfo();
            this.stopSound();
        } else if (!this.waiting && !this.crashed) {
            this.moveShip();
            this.updateMyLasers();
            this.fireLaser();
            this.shipChangeCourse();
            this.playSound();
        } else if (this.crashed) {
            this.velocity.mult(0.95);
            this.moveShip();
            this.stopSound();
        }
    }

    this.playSound = function() {
        if (!ufoLaserSound.isPlaying()) {
            ufoLaserSound.setVolume(0.5);
            ufoLaserSound.loop();
        }
    }

    this.stopSound = function() {
        ufoLaserSound.stop();
    }

    this.resetUfo = function() {
        this.pos = createVector(-this.size, random(30, height - 30));
        this.waiting = true;
    }

    this.moveShip = function() {
        this.pos.add(this.velocity);
        var force = p5.Vector.fromAngle(this.heading);
        this.velocity.add(force);
        this.velocity.limit(2);
    }

    this.updateMyLasers = function() {
        for (var j = this.myLasers.length - 1; j >= 0; j--) {
            this.myLasers[j].update();
            if (this.myLasers[j].offscreen() || this.isOffScreen()) {
                this.myLasers.splice(j, 1);
            } else {
                if (field.laserHit(this.myLasers[j])) {
                    this.myLasers.splice(j, 1);
                } else if (ship.laserHit(this.myLasers[j])) {
                    this.myLasers.splice(j, 1);
                }
            }
        }
    }

    this.laserHit = function(laser) {
        var d = dist(this.pos.x, this.pos.y, laser.pos.x, laser.pos.y);
        if (d < (this.size)) {
            this.explode();
            score.updateScore(1000);
            return true;
        }
    }

    this.explode = function() {
        this.stopSound();
        if (!this.playExplosion) {
            explodeSound.play();
            this.playExplosion = true;
        }
        this.crashed = true;
    }

    this.fireLaser = function() {
        if (this.fireTimer > 25) {
            this.shootLaser();
            this.fireTimer = 0;
        } else {
            this.fireTimer += 1;
        }
    }

    this.shootLaser = function() {
        var angle = random(0, TWO_PI);
        var launchPos = createVector(this.pos.x, this.pos.y);
        this.myLasers.push(new Laser(launchPos, angle));
    }

    this.shipChangeCourse = function() {
        if (this.courseChangeTimer > 100) {
            this.heading = random(-TWO_PI / 8, TWO_PI / 8);
            this.courseChangeTimer = 0;
        } else {
            this.courseChangeTimer += 1;
        }
    }

    this.isOffScreen = function() {
        var buffer = this.size * 3;
        if (this.pos.x > (width + buffer) ||
            this.pos.x < -buffer ||
            this.pos.y > (height + buffer) ||
            this.pos.y < -buffer) {
            return true
        }
        return false
    }

    this.shipLaunch = function() {
        this.velocity = createVector(2, 0);
        this.waiting = false;
    }

    this.display = function() {
        if (this.crashed) {
            this.drawExplosion();
        } else {
            this.drawMyLasers();
            this.drawShip();
        }
    }

    this.drawExplosion = function() {
        if (this.explodeRingColor > 0) {
            var ringDia = map(this.explodeRingColor, 255, 0, this.size * 2, 120);
            push()
            translate(this.pos.x, this.pos.y);
            noFill();
            stroke(this.explodeRingColor, 0, 0);
            strokeWeight(2);
            ellipse(0, 0, ringDia * 0.8);
            ellipse(0, 0, ringDia);
            pop();
            this.explodeRingColor = this.explodeRingColor - 3;
        }
    }

    this.drawMyLasers = function() {
        for (var i = 0; i < this.myLasers.length; i++) {
            this.myLasers[i].display();
        }
    }

    this.drawShip = function() {
        push();
        translate(this.pos.x, this.pos.y);
        fill(0);
        stroke(this.shipColor);
        ellipse(0, -1, this.size);
        beginShape();
        vertex(-this.size, 0);
        vertex(this.size, 0);
        vertex(this.size * 0.75, this.size * 0.5);
        vertex(-this.size * 0.75, this.size * 0.5)
        endShape(CLOSE);
        pop();
    }
}
