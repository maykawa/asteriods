function LaserField() {

    this.myLasers = [];

    this.shootLaser = function(pos) {
        var angle = random(0, TWO_PI);
        var launchPos = createVector(pos.x, pos.y);
        this.myLasers.push(new Laser(launchPos, angle));
    }

    this.updateMyLasers = function() {
        for (var j = this.myLasers.length - 1; j >= 0; j--) {
            this.myLasers[j].update();
            if (this.myLasers[j].offscreen()) {
                this.removeLaser(j);
            } else {
                this.notifyOthers(j);
            }
        }
    }

    this.notifyOthers = function(index) {
        if (field.laserHit(this.myLasers[index])) {
            this.removeLaser(index);
        } else if (ship.laserHit(this.myLasers[index])) {
            this.removeLaser(index);
        }
    }

    this.removeLaser = function(index) {
        this.myLasers.splice(index, 1);
    }

    this.drawMyLasers = function() {
        for (var i = 0; i < this.myLasers.length; i++) {
            this.myLasers[i].display();
        }
    }
}


function Laser(spos, angle) {
    this.pos = createVector(spos.x, spos.y);
    this.velocity = p5.Vector.fromAngle(angle);
    this.velocity.mult(6);

    this.update = function() {
        this.pos.add(this.velocity);
    }

    this.display = function() {
        push();
        stroke(255);
        strokeWeight(3);
        point(this.pos.x, this.pos.y);
        pop();
    }

    this.hits = function(obj) {
        var d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
        return (d < obj.size);
    }

    this.offscreen = function() {
        return (this.pos.x > width ||
            this.pos.x < 0 ||
            this.pos.y > height ||
            this.pos.y < 0);
    }
}
