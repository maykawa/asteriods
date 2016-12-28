function Laser(spos, heading, source) {
    this.pos = createVector(spos.x, spos.y);
    this.heading = heading;
    this.source = source;

    this.velocity = p5.Vector.fromAngle(heading);
    this.myLaserSpeed = 6;
    this.velocity.mult(this.myLaserSpeed);
};

Laser.prototype.update = function() {
    this.pos.add(this.velocity);
};

Laser.prototype.offscreen = function() {
    return (this.pos.x > width ||
        this.pos.x < 0 ||
        this.pos.y > height ||
        this.pos.y < 0);
};

Laser.prototype.hits = function(obj) {
    var d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    return (d < obj.size);
};

Laser.prototype.display = function() {
    push();
    strokeWeight(3);
    if (this.source.constructor.name === "Ship") {
        for (var i = 0; i < 30; i = i + 10) {
            stroke(255 - (i * 3));
            point(this.pos.x - (i * cos(this.heading)), this.pos.y - (i * sin(this.heading)));
        }
    } else if (this.source.constructor.name === "Ufo") {
        stroke(103, 248, 91);
        point(this.pos.x, this.pos.y);
    }
    pop();
};
