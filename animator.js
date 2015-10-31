/*  A simple framework that helps abstract the grittyness of
    `requestAnimationFrame()` a little.
*/
function Animator(obj) {
    this._continue = false;
    this.object = obj;
    this.animate = this.animate.bind(this);
    this.prevTime = 0;
    
    Object.seal(this);
}

Animator.prototype.animate = function (t) {
    this.object.animate(t, t - this.prevTime);
    this.prevTime = t;
    if (this._continue) requestAnimationFrame(this.animate);
};

Animator.prototype.start = function () {
    //  Prevent mulitple concurrent instances from being started.
    if (!this._continue) {
        this._continue = true;
        this.prevTime = 0;
        requestAnimationFrame(this.animate);
    }
};

Animator.prototype.stop = function () {
    this._continue = false;
};

Animator.prototype.setObject = function (o) {
    this.object = o;
};