"use strict";

function loaded() {
    var i;
    
    assemble();
    
    
    $("#slider").slider({min: 50, max: 4000, step: 10, value: 500,
        create: changeSpeedSlider, change: changeSpeedSlider});
    
    $("#angle").slider({min: 0, max: 720, value: 0, create: function () {setAngle(0);}, slide: setAngle});
    
    $(".control-set").each(function (index, element) {
        var elem = $("<option>");
        var matches;
        
        if ($(element).is("fieldset")) {
            console.log("I'm a fieldset!");
            elem.val("#" + $(element).attr("id"));
            elem.text($(element).attr("id").match(/.+(?:-.*)/)[0]);
            $("#control-select").append(elem);
            console.log(element);
        }
    });
}