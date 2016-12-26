function AsteriodField(num) {
    this.number = num;
    this.asteriods = [];
    for (var i = 0; i < this.number; i++) {
        this.asteriods.push(new Asteriod());
    }
    this.explosiveAsteriod = false;

    this.introduceExplosiveAsteriod = function() {
        this.explosiveAsteriod = true;
    }

    this.update = function() {
        this.asteriods.forEach(updateAsteriods);
    }

    function updateAsteriods(a) {
        a.update();
    }

    this.display = function() {
        this.asteriods.forEach(drawAsteriods);
    }

    function drawAsteriods(a) {
        a.display();
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

    this.launchPanicBomb = function(locale) {
        for (var i = this.asteriods.length - 1; i >= 0; i--) {
            //figure out if it is close to ship, then delete it
            var d = dist(this.asteriods[i].pos.x, this.asteriods[i].pos.y, locale.x, locale.y);
            if (d < (ship.size * 20)) {

                if (this.asteriods[i].size > 10) {
                    if (this.asteriods[i].explosive == true) {
                        this.explodeAllAsteriods();
                    } else {
                        var newAst = this.asteriods[i].breakup();
                        this.asteriods = this.asteriods.concat(newAst);
                    }
                }
                hitSound.play();
                this.asteriods.splice(i, 1);
                score.checkEndOfGame();
            }
        }
    }

    this.isFieldEmpty = function() {
        return (this.asteriods.length < 1);
        bedSound.stop();
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
            if (d < (this.asteriods[i].size * 1.10)) {
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
            if (this.explosiveAsteriod) {
                newAst[0].explosive = true;
                this.explosiveAsteriod = false;
            }
            this.asteriods = this.asteriods.concat(newAst);
        }
        this.asteriods.splice(i, 1);
    }
}
