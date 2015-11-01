/*  Size constants that define the sizing of all UI elements.  */
var SCALE = 800/800;


var WIDTH = 600, HEIGHT = 800;


var PISTON_WIDTH = SCALE *  200,
    PISTON_HEIGHT = SCALE * 150,
    PISTON_TRAVEL = SCALE * 150,
    PISTON_Y = SCALE *      80;

var WALL_WIDTH = SCALE *    20,
    HEAD_DISTANCE =         PISTON_TRAVEL / 6;

var SPECS = {
    flywheelInertia: 10,    //  [kg * m^2]
    pistonArea: 150,        //  [cm^2]
    cylinderMinVolume: 120, //  [cm^3]
    cylinderMaxVolume: 1000//  [cm^3]
    
};