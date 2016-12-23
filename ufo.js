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
        if (!this.waiting && this.isOffScreen()) {
            this.pos = createVector(-this.size, random(30, height - 30))
            this.waiting = true;
        } else if (!this.waiting && !this.crashed) {
            this.moveShip();
            this.fireLaser();
            this.shipChangeCourse();
        } else if (this.crashed) {
            this.velocity.mult(0.95);
        }
    }

    this.shipChangeCourse = function() {
        if (this.courseChangeTimer > 80) {
            this.heading = random(-TWO_PI / 8, TWO_PI / 8);
            this.courseChangeTimer = 0;
        } else {
            this.courseChangeTimer += 1;
        }

    }

    this.moveShip = function() {
        this.pos.add(this.velocity);
        var force = p5.Vector.fromAngle(this.heading);
        this.velocity.add(force);
        this.velocity.limit(2);
    }

    this.fireLaser = function() {
        if (this.fireTimer > 20) {
            this.shootLaser();
            this.fireTimer = 0;
        } else {
            this.fireTimer += 1;
        }
    }

    this.shootLaser = function() {
        var angle = random(0, TWO_PI);
        var distAwayFromShip = this.size * 2; //offset
        var x = distAwayFromShip * cos(angle);
        var y = distAwayFromShip * sin(angle);
        var launchPos = createVector(this.pos.x + x, this.pos.y + y)
        this.myLasers.push(new Laser(launchPos, angle));
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

    this.shipHit = function() {
        this.crashed = true;
    }

    this.shipLaunch = function() {
        this.velocity = createVector(2, 0);
        this.waiting = false;
    }

    this.display = function() {
        if (this.crashed) {
            if (!this.playExplosion) {
                explodeSound.play();
                this.playExplosion = true;
            }
            this.drawExplosion();
        } else {
            this.drawShip();
        }
    }

this.drawMyLasers = function(){


  
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
