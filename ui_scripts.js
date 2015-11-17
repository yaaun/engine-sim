"use strict";

function loaded() {
    var i;
    
    assemble();
    
    
    $("#speed-slider").slider({min: 50, max: 4000, step: 10, value: 500,
        create: changeSpeedSlider, change: changeSpeedSlider});
    
    $("#debug-angle-slider").slider({min: 0, max: 720, value: 0, create: function () {debugSetAngle(0);}, slide: debugSetAngle});
    
    $("#debug-temperature-slider").slider({min: 0, max: 100, value: 0, create: function () {debugSetTemperature(0);}, slide: debugSetTemperature});
    
    $("#debug-pressure-slider").slider({min: 0, max: 100, value: 0, create: function () {debugSetPressure(0);}, slide: debugSetPressure});
    
    $(".control-set").each(function (index, element) {
        var elem = $("<option>");
        var matches;
        
        if ($(element).is("fieldset")) {
            //console.log("I'm a fieldset!");
            elem.val("#" + $(element).attr("id"));
            elem.text($(element).attr("id").match(/.+(?:-.*)/)[0]);
            $("#control-select").append(elem);
            // console.log(element);
        }
    });
    
    $("#canvas").resizable({
        resize: changeScale
    });
}