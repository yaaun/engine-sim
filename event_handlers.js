"use strict";

function startAnimation() {
    animator.start();
}

function stopAnimation() {
    animator.stop();
}

function pauseAnimation() {
    timing.pause();
}

function resumeAnimation() {
    timing.resume();
}

function changeSpeedSlider(evt, ui) {
    timing.setPeriod(ui.value);
    $("#period-output").val(ui.value);
}

function setAngle(evt, ui) {
    var a;
    
    if (!evt) {
        a = this.value / 180;
    } else if (typeof evt === "number") {
        a = evt / 180;
    } else {
        a = ui.value / 180;
    }
    
    timing.setAngle(a * Math.PI);
    $("#angle-output").val(a.toFixed(2));
}