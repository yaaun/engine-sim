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

function debugSetAngle(evt, ui) {
    var a;
    
    if (evt == null) {
        a = this.value / 180;
    } else if (typeof evt === "number") {
        a = evt / 180;
    } else {
        a = ui.value / 180;
    }
    
    // console.log("a = %f, a * PI = %f", a , a * Math.PI);
    timing.setAngle(a * Math.PI);
    $("#debug-angle-output").val(a.toFixed(2));
}


function debugSetTemperature(evt, ui) {
    var t;
    
    if (typeof evt === "number") {
        t = evt;
    } else {
        t = ui.value;
    }
    
    combustion.setTemp(t);
    $("#debug-temperature-output").val(t);
}


function debugSetPressure(evt, ui) {
    var p;
    
    if (typeof evt === "number") {
        p = evt;
    } else {
        p = ui.value;
    }
    
    combustion.setPres(p);
    $("#debug-pressure-output").val(p);
};


function hideControls(evt) {
    var val;
    
    if (typeof evt === "string") {
        val = evt;
    } else {
        val = evt.target.value;
    }
    
    if (val === "all") {
        $("#control-container fieldset").show();
    } else if (val === "none") {
        $("#control-container fieldset").hide();
    } else {
        $("#control-container fieldset").hide();
        $(val).show();
    }
}


function changeScale(evt, ui) {
    var scale;
    var width, height;
    
    if (evt) {
        scale = ui.size.width / WIDTH;
        ui.size.height = scale * HEIGHT;
    } else {
        scale = parseFloat($("#scale-output").val());
    }
    
    width = WIDTH * scale,
    height = HEIGHT * scale;
        
    paper.setSize(width, height);
    paper.setViewBox(0, 0, WIDTH, HEIGHT);
}