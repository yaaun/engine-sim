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
    
    // console.log(bbox);
    
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


function CombustionMovement(stat, mob, baseHeight, travel, colourFunc) {
    this.baseHeight = baseHeight;
    this.travel = travel;
    this.mobileObject = mob || null;
    this.staticObject = stat || null;
    
    this.pressure = 0;
    this.temp = 0;
    
    this._getColour = colourFunc;
}

CombustionMovement.prototype.update = function (alpha) {
    if (this.mobileObject) this.mobileObject.attr("height", this.baseHeight + this.travel * -Math.cos(alpha));
    this.updateColour();
};

CombustionMovement.prototype.updateColour = function () {
    var t = this.temp;
    var p = this.pressure;
    
    //  If-checks in case any of the below is null.
    if (this.mobileObject) this.mobileObject.attr("fill", "rgb(" + this._getColour(t, p).join(",") + ")");
    if (this.staticObject) this.staticObject.attr("fill", "rgb(" + this._getColour(t, p).join(",") + ")");
};

CombustionMovement.prototype.setTP = function (T, P) {
    this.temp = T;
    this.pressure = P;
    this.updateColour();
};

CombustionMovement.prototype.setTemp = function (T) {
    this.temp = T;
    this.updateColour();
};

CombustionMovement.prototype.setPres = function (P) {
    this.pressure = P;
    this.updateColour();
};


function EngineModel(specs) {
    //  Control variables.
    this.timeMultiplier = 1;
    /*  The (minimum) time resolution that is used for calculations. That is, if
        `dt` is more than this value, a loop will run multiple time steps in a
        single invocation of `update()` to ensure that each time step is equal
        to or less than `timeResolution`.
    */
    this.timeResolution = 1/600;    //  [s]
    
    
    //  Parameters of the simulation.
    this.momentOfInertia = SPECS.flywheelInertia;   //  [kg * m^2]
    /*  Defines when the spark plug is fired, expressed as an angle. A positive
        value means that the spark is fired after TDC, while a negative
        value fires the spark before TDC (advanced timing).
    */
    this.sparkDelay = 0;    //  [rad]
    
    //  State variables.
    /*  The phase of the engine. This defines what part of the cycle is
        currently taking place.
          [0 ; Pi)      : intake
          [Pi ; 2*Pi)   : compression
          
    */
    this.phase = 0;             //  [rad]
    this.angularVelocity = 0;   //  [rad / s]
    /*  The amount of external torque that is applied to the engine. If this
        value has the same sign as `angularVelocity`, then the torque is in the
        same direction as the rotation of the engine (e.g. an engine starter).
        If it is opposite, then the torque works against the rotation of the
        engine (e.g. a mechanical load on the crankshaft).
    */
    this.externalTorque = 0;     //  
    this.pressure = 100000;     //  [Pa]
    this.temperature = 300;     //  [K]
    this.plugFired = false;
    
    this.throttle = 0.2;
}

EngineModel.prototype.getAngularMomentum = function () {
    return this.momentOfInertia * this.angularVelocity;
};

EngineModel.prototype.update = function (t, dt) {
    dt *= this.timeMultiplier;
    
    var steps;
    var i;
    
    if (dt > this.timeResolution) {
        steps = Math.ceil(dt / this.timeResolution);
        dt /= steps;
    } else {
        steps = 1;
    }
    
    for (i = 0; i < steps; i++) {
        this.phase += this.angularVelocity * dt;
        
        if (this.phase < Math.PI) {
            //  1st stroke.
        } else if (this.phase >= 3 * Math.PI) {
            //  4th stroke.
        } else if (!this.plugFired) {
            //  2nd stroke.
        } else if (this.plugFired) {
            //  3rd stroke.
        }
    }
};

function colourFunction(T, P) {
    
}