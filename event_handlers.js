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