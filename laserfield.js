function LaserField(source) {
    this.source = source;
    this.myLasers = [];
};

LaserField.prototype.shootLaser = function(heading) {
    if (heading != undefined) {
        var angle = heading;
    } else {
        var angle = random(0, TWO_PI);
    }

    //create offset from vehicles so they can't shoot themselves
    var r = this.source.size + 3;
    var x = r * cos(angle);
    var y = r * sin(angle);
    var launchPos = createVector(this.source.pos.x + x, this.source.pos.y + y);
    this.myLasers.push(new Laser(launchPos, angle, this.source));
};

LaserField.prototype.updateMyLasers = function() {
    for (var j = this.myLasers.length - 1; j >= 0; j--) {
        this.myLasers[j].update();
        if (this.myLasers[j].offscreen()) {
            this.removeLaser(j);
        } else {
            this.notifyOthers(j);
        }
    }
};

LaserField.prototype.removeLaser = function(index) {
    this.myLasers.splice(index, 1);
};

LaserField.prototype.notifyOthers = function(index) {
    if (field.laserHit(this.myLasers[index])) {
        this.removeLaser(index);
    } else if (ship.laserHit(this.myLasers[index])) {
        this.removeLaser(index);
    } else if (ufo.laserHit(this.myLasers[index])) {
        this.removeLaser(index);
    }
};

LaserField.prototype.drawMyLasers = function() {
    for (var i = 0; i < this.myLasers.length; i++) {
        this.myLasers[i].display();
    }
};
