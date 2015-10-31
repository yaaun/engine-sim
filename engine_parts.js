/*  This object is designed to work with Animator. It times the movement of the
    other parts of the engine (like its real analogue).
*/
function TimingBelt(period, startAngle) {
    this.callbacks = [];
    this.period = period;
    
    this.ownTime = 0;
    this.running = true;
    this.startAngle = startAngle || -Math.PI / 2;
    
    Object.seal(this);
}

TimingBelt.prototype.add = function (cb) {
    this.callbacks.push(cb);
};

TimingBelt.prototype.animate = function (t, dt) {    
    if (this.running) {
        this.ownTime += dt;
        this.ownTime %= 2 * this.period;
        
        var i;
        var alpha = this.ownTime / this.period * Math.PI * 2 + this.startAngle;
        
        for (i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i](alpha);
        }
    }
};

TimingBelt.prototype.pause = function () {
    this.running = false;
};

TimingBelt.prototype.resume = function () {
    this.running = true;
};

TimingBelt.prototype.setPeriod = function (p) {
    if (p) {
        var oldAlpha = this.ownTime / this.period * Math.PI * 2 + this.startAngle;
        var newAlpha = this.ownTime / p * Math.PI * 2 + this.startAngle;
        
        this.period = p;
        
        //  Make sure that the angle is the same after the change.
        this.startAngle = (newAlpha - oldAlpha);
    }
};


function PistonMovement(pistonObject, centerX, topY, travel) {
    var bbox = pistonObject.getBBox();
    
    this.centerX = centerX;
    this.topY = topY;
    this.width = bbox.width;
    this.height = bbox.height;
    this.travel = travel;
    
    this.object = pistonObject;
    
    var x = this.centerX - this.width / 2;
    this.object.attr("x", x);
}

PistonMovement.prototype.update = function (alpha) {
    var y = this.topY + this.travel / 2;
    var shift = this.travel * Math.sin(alpha) / 2;
    
    this.object.attr("y", y + shift);
};
