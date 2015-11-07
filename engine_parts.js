/*  This object is designed to work with Animator. It times the movement of the
    other parts of the engine (like its real analogue).
*/
"use strict";


function TimingBelt(period, startAngle) {
    this.callbacks = [];
    this.period = period;
    
    this.ownTime = 0;
    this.running = true;
    this.startAngle = startAngle || 0;
    
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

TimingBelt.prototype.setAngle = function (a) {
    var i;
    for (i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i](a + this.startAngle);
    }
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
}

PistonMovement.prototype.update = function (alpha) {
    var shift = this.travel * -Math.cos(alpha) / 2 + this.travel / 2;
    this.object.transform("T 0 " + shift);
};


function PushrodMovement(pushrodObject, centerX, topY, travel, length) {
    var bbox = pushrodObject.getBBox();
    
    this.centerX = centerX;
    this.topY = topY;
    this.travel = travel;
    this.length = length;
    this.object = pushrodObject;
    
    console.log(bbox);
    
    this.maxAngle = Math.atan(this.travel / this.length / 2);
}

PushrodMovement.prototype.update = function (alpha) {
    var shift = this.travel * -Math.cos(alpha) / 2 + this.travel / 2;
    var angle = -Math.sin(alpha) * this.maxAngle * 180 / Math.PI;
    
    // console.log("alpha = %f", alpha);
    // console.log(shift);
    
    this.object.transform(
        "T" + 0 + " " + shift +
        "r" + [angle, this.centerX, this.topY].join(" ")
    );
    //this.object.rotate((angle - this.ownAngle) / Math.PI * 180);
    this.ownAngle = angle;
    this.ownAlpha = alpha;
};

/** Note: this object assumes that the `crankObject` is already in its correct
    place.  */
function CrankMovement(crankObject, centerX, centerY) {
    this.object = crankObject;
    this.hubX = centerX;
    this.hubY = centerY;
    
    this.ownAngle = 0;
}

CrankMovement.prototype.update = function (alpha) {
    this.object.transform("R" + [(alpha + this.ownAngle) / Math.PI * 180, this.hubX, this.hubY].join(" "));
};


function ValveMovement(valveObject, travel, startAngle, endAngle) {
    this.object = valveObject;
    this.travel = travel;
    this.startAngle = startAngle;
    this.endAngle = endAngle;

    this.func = function (a) {
        var r;
        
        if (a >= this.startAngle && a < this.endAngle) {
            r = Math.abs(Math.sin(a) * 4);
            r = r > 1 ? 1 : r;
            return r;
        } else {
            return 0;
        }
    };
}

ValveMovement.prototype.update = function (alpha) {
    this.object.transform("T 0 " + (-this.func(alpha) * this.travel));
};


function CombustionMovement(combustion) {
    this.object = combustion;
}


function EngineModel(specs) {
    this.momentOfInertia = SPECS.flywheelInertia;
    this.timeMultiplier = 1;
    
    //  State variables.
    this.angularVelocity = 0;
}

EngineModel.prototype.getAngularMomentum = function () {
    return this.momentOfInertia * this.angularVelocity;
};

EngineModel.prototype.update = function (t, dt) {
    dt *= this.timeMultiplier;
    
    
};