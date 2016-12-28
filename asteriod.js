function Asteriod(pos, asize) {
    if (pos != undefined) {
        this.pos = pos.copy();
    } else {
        this.pos = createVector(random(width), random(height));
    }

    if (asize != undefined) {
        this.size = asize * 0.5;
    } else {
        this.size = floor(random(20, 50));
    }

    //create the number of sides and the offset
    this.facets = floor(random(7, 12));
    this.offset = [];
    for (var i = 0; i < this.facets; i++) {
        this.offset[i] = random(-this.size * 0.5, this.size * 0.5);
    }

    this.astColor = color(255, 255, 200);
    this.explosive = false;
    this.velocity = p5.Vector.random2D();
};

Asteriod.prototype.update = function() {
    this.pos.add(this.velocity);
    this.keepOnScreen();
};

Asteriod.prototype.keepOnScreen = function() {
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
};

Asteriod.prototype.breakup = function() {
    var newA = [];
    newA[0] = new Asteriod(this.pos, this.size);
    newA[0].velocity.mult(random(1.8, 2.1));
    newA[1] = new Asteriod(this.pos, this.size);
    newA[1].velocity.mult(random(1.4, 1.9));
    return newA;
};

Asteriod.prototype.display = function() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    strokeWeight(1);

    if (this.explosive) {
        stroke(200, 50, 200);
    } else {
        stroke(this.astColor);
    }

    beginShape();
    for (var i = 0; i < this.facets; i++) {
        var angle = map(i, 0, this.facets, 0, TWO_PI);
        var r = this.size + this.offset[i];
        var x = r * cos(angle);
        var y = r * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);
    pop();
};
