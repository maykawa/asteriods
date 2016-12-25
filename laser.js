function LaserField(source) {
    this.myLasers = [];
    this.laserSource = source; //1 = ship, 2 = ufo

    this.shootLaser = function(pos, heading) {
        if (heading != undefined) {
            var angle = heading;
        } else {
            var angle = random(0, TWO_PI);
        }

        //create offset from vehicles so they can't shoot themselves
        var xr = 17;
        var yr = 17;
        var x = xr * cos(angle);
        var y = yr * sin(angle);

        var launchPos = createVector(pos.x + x, pos.y + y);
        this.myLasers.push(new Laser(launchPos, angle, this.laserSource));
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

    this.removeLaser = function(index) {
        this.myLasers.splice(index, 1);
    }

    this.notifyOthers = function(index) {
        if (field.laserHit(this.myLasers[index])) {
            this.removeLaser(index);
        } else if (ship.laserHit(this.myLasers[index])) {
            this.removeLaser(index);
        } else if (ufo.laserHit(this.myLasers[index])) {
            this.removeLaser(index);
        }
    }

    this.drawMyLasers = function() {
        for (var i = 0; i < this.myLasers.length; i++) {
            this.myLasers[i].display();
        }
    }
}

function Laser(spos, angle, src) {
    this.laserSource = src;
    this.myLaserSpeed = 6;
    this.pos = createVector(spos.x, spos.y);
    this.velocity = p5.Vector.fromAngle(angle);
    this.velocity.mult(this.myLaserSpeed);

    this.update = function() {
        this.pos.add(this.velocity);
    }

    this.display = function() {
        push();
        strokeWeight(3);

        if (this.laserSource == 1) {
            for (var i = 0; i < 30; i = i + 10) {
                stroke(255 - (i * 3));
                point(this.pos.x - (i * cos(angle)), this.pos.y - (i * sin(angle)));
            }
        } else if (this.laserSource == 2) {
            stroke(103, 248, 91);
            point(this.pos.x, this.pos.y);
        }
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
