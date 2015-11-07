/*  Size constants that define the sizing of all UI elements.  */
var SCALE = 800/800;


var WIDTH = 600, HEIGHT = 800;


var PISTON_WIDTH = SCALE *  200,
    PISTON_HEIGHT = SCALE * 150,
    PISTON_TRAVEL = SCALE * 150,
    PISTON_Y = SCALE *      160;

var WALL_WIDTH = SCALE *    40,
    HEAD_DISTANCE =         PISTON_TRAVEL / 4;
    RIB_SIZE =              WALL_WIDTH / 2;

var HUB_R = SCALE *         50,
    HUB_r = SCALE *         30;

var PUSHROD_D =             HUB_r * 2,
    PUSHROD_d = SCALE *     40,
    PUSHROD_LENGTH =        PISTON_TRAVEL * 2;

var PLUG_WIDTH = SCALE *    40,
    PLUG_HEIGHT = SCALE *   80,
    PLUG_Y = SCALE *        50,
    PLUG_CORNER_R = SCALE * 5,
    PLUG_PRONG_WIDTH = SCALE * 15,
    PLUG_PRONG_HEIGHT = SCALE * 10;

var WALL_COLOUR =           "darkgrey",
    PISTON_COLOUR =         "grey",
    PUSHROD_COLOUR =        "#444",
    PLUG_COLOUR =           "#eee";

var SPECS = {
    flywheelInertia: 0.01,          //  [kg * m^2]
    pistonArea: 150,                //  [cm^2]
    cylinderMinVolume: 120,         //  [cm^3]
    cylinderMaxVolume: 1000         //  [cm^3]
    
};