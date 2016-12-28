function Ship() {
    this.pos = createVector(width / 2, height / 2);
    this.size = 10;
    this.heading = 0;
    this.rotation = 0;
    this.thrust = 0;
    this.velocity = createVector(0, 0);
    this.shipColor = color(47, 225, 253);
    this.crashed = false;
    this.playExplosion = false;
    this.explodeRing = 255;
    this.myLasers = [];
    this.myLaserField = new LaserField(this);

    this.panicRingSize = this.size * 20;
    this.panicBomb = true;
    this.showPanicRing = false;
    this.panicRingCounter = 30;

    this.update = function() {
        this.pos.add(this.velocity);
        this.stayOnScreen();

        if (field.checkForCollision(this)) {
            this.explode();
        }

        if (this.crashed) {
            this.velocity.mult(0.95);
        } else {
            this.moveShip();
        }
        this.myLaserField.updateMyLasers();
    }

    this.explode = function() {
        this.crashed = true;
        score.endGame();
    }

    this.moveShip = function() {
        this.heading += this.rotation;
        if (this.thrust > 0) {
            var force = p5.Vector.fromAngle(this.heading);
            force.mult(this.thrust);
            this.velocity.add(force);
        }
    }

    this.fireLaser = function() {
        fireSound.play();
        this.myLaserField.shootLaser(this.heading);
    }

    this.laserHit = function(laser) {
        var d = dist(this.pos.x, this.pos.y, laser.pos.x, laser.pos.y);
        if (d < (this.size)) {
            this.explode();
            return true;
        }
    }

    this.stayOnScreen = function() {
        if (this.pos.x > width) {
            this.pos.x = 0;
        } else if (this.pos.x < 0) {
            this.pos.x = width;
        }

        if (this.pos.y > height) {
            this.pos.y = 0;
        } else if (this.pos.y < 0) {
            this.pos.y = height;
        }
    }

    this.usePanicBomb = function() {
        if (this.panicBomb && !this.crashed) {
            field.launchPanicBomb(this.pos);
            this.showPanicRing = true;
            this.panicBomb = false;
        }
    }

    this.reloadPanicBomb = function() {
        this.showPanicRing = false;
        this.panicRingCounter = 30;
        this.panicBomb = true;
        console.log('panic bomb reloaded');
    }

    this.drawPanicRing = function() {
        if (this.panicRingCounter > 0) {
            push()
            fill(255, this.panicRingCounter);
            stroke(this.shipColor);
            strokeWeight(1);
            ellipse(0, 0, this.panicRingSize);
            pop();
            this.panicRingCounter = this.panicRingCounter - 1;
        }
    }

    this.drawExplosion = function() {
        if (this.explodeRing > 0) {
            var dia = map(this.explodeRing, 255, 0, this.size * 2, 120);
            push()
            noFill();
            stroke(this.explodeRing, 0, 0);
            strokeWeight(2);
            ellipse(0, 0, dia * 0.8);
            ellipse(0, 0, dia);
            pop();
            this.explodeRing = this.explodeRing - 3;
        }
    }

    this.setRotation = function(a) {
        this.rotation = a;
    }

    this.startThrust = function() {
        thrustSound.play();
        this.thrust = 0.05;
    }

    this.stopThrust = function() {
        thrustSound.stop();
        this.thrust = 0;
    }

    this.display = function() {
        this.myLaserField.drawMyLasers();
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading);
        fill(0);
        stroke(this.shipColor);

        if (this.showPanicRing) {
            this.drawPanicRing();
        }

        if (this.crashed) {
            if (!this.playExplosion) {
                explodeSound.play();
                this.playExplosion = true;
            }
            this.drawExplosion();
        } else {
            triangle(-this.size, -this.size, this.size, 0, -this.size, this.size);
            line(-this.size - 3, -this.size + 4, -this.size - 3, this.size - 4);

            if (this.thrust > 0 && !this.crashed) {
                noStroke();
                fill(255, 150);
                var t = this.size / 1.8; //make rocket proportiaonal to ship
                var f = (t * 3) + 1; //offset to back of ship
                triangle(t - f, t, -t - f + (t / 2), 0, t - f, -t);
            }
        }
        pop();
    }
}
