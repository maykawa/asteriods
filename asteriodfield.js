function AsteriodField(num) {
    this.number = num;
    this.asteriods = [];
    for (var i = 0; i < this.number; i++) {
        this.asteriods.push(new Asteriod());
    }
    this.introduceExplosiveAsteriod = false;

    this.update = function() {
        this.asteriods.forEach(updateAsteriods);
    }

    this.display = function() {
        this.asteriods.forEach(drawAsteriods);
    }

    function drawAsteriods(a) {
        a.display();
    }

    function updateAsteriods(a) {
        a.update();
    }

    this.explodeAllAsteriods = function() {
        for (var i = this.asteriods.length - 1; i >= 0; i--) {
            if (this.asteriods[i].size > 10) {
                var newAst = this.asteriods[i].breakup();
                this.asteriods = this.asteriods.concat(newAst);
            }
            this.asteriods.splice(i, 1);
        }
    }

    this.isFieldEmpty = function() {
        return (this.asteriods.length < 1);
    }

    this.checkForCollision = function(obj) {
        for (var i = 0; i < this.asteriods.length; i++) {
            var d = dist(this.asteriods[i].pos.x, this.asteriods[i].pos.y, obj.pos.x, obj.pos.y);
            if (d < (this.asteriods[i].size + obj.size * 0.95)) {
                return true;
            }
        }
        return false;
    }

    this.laserHit = function(laser) {
        for (var i = this.asteriods.length - 1; i >= 0; i--) {
            var d = dist(this.asteriods[i].pos.x, this.asteriods[i].pos.y, laser.pos.x, laser.pos.y);
            if (d < (this.asteriods[i].size)) {
                hitSound.play();
                this.asteriodBreakup(i);
                score.updateScore(10);
                score.checkEndOfGame();
                return true;
            }
        }
    }

    this.asteriodBreakup = function(i) {
        if (this.asteriods[i].explosive == true) {
            this.explodeAllAsteriods();
        } else if (this.asteriods[i].size > 10) {
            var newAst = this.asteriods[i].breakup();
            if (this.introduceExplosiveAsteriod) {
                newAst[0].explosive = true;
                this.introduceExplosiveAsteriod = false;
            }
            this.asteriods = this.asteriods.concat(newAst);
        }
        this.asteriods.splice(i, 1);
    }
}
