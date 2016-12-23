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
