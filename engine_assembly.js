/*  This file puts the different parts of our engine together.  */
"use strict";

var animator, timing;


function assemble() {
    var paper = new Raphael("canvas");
    var i, ribs;
    var rib;
    
    var cylinderX = (WIDTH - PISTON_WIDTH) / 2 - WALL_WIDTH,
        cylinderY = PISTON_Y - HEAD_DISTANCE - WALL_WIDTH,
        cylinderW = 2 * WALL_WIDTH + PISTON_WIDTH,
        cylinderH = WALL_WIDTH + HEAD_DISTANCE + (PISTON_HEIGHT) * 2;
        
    var hubX = WIDTH / 2,
        hubY = PISTON_Y + 2.5 * PISTON_TRAVEL + PISTON_HEIGHT / 2,
        hubR = 1.25 * WALL_WIDTH,
        hubr = WALL_WIDTH;
    
    var ribOffset;


    //  The cylidner part.
    var cylinderPart = paper.set();
    cylinderPart.push(
        paper.rect(cylinderX, cylinderY, cylinderW, WALL_WIDTH)
        .attr("fill", WALL_COLOUR)
        .attr("stroke", "black")
        .attr("stroke-width", 0)
    );
    cylinderPart.push(
        paper.rect(cylinderX, cylinderY + WALL_WIDTH, WALL_WIDTH, cylinderH - WALL_WIDTH)
        .attr("fill", WALL_COLOUR)
        .attr("stroke", "black")
        .attr("stroke-width", 0)
    );
    cylinderPart.push(
        paper.rect(cylinderX + cylinderW - WALL_WIDTH, cylinderY + WALL_WIDTH, WALL_WIDTH, cylinderH - WALL_WIDTH)
        .attr("fill", WALL_COLOUR)
        .attr("stroke", "black")
        .attr("stroke-width", 0)
    );

    //  Populate the top of the cylider with ribs.
    ribs = cylinderW / RIB_SIZE / 2;
    ribOffset = (cylinderW - ribs * 2 * RIB_SIZE);
    for (i = 0; i < ribs; i++) {
        rib = paper.rect(ribOffset + cylinderX + i * 2 * RIB_SIZE, cylinderY - RIB_SIZE, RIB_SIZE, RIB_SIZE);
        rib.attr("fill", WALL_COLOUR).attr("stroke-width", 0);
        cylinderPart.push(rib);
    }


    //  The piston part.
    var pistonPart = paper.set();
    pistonPart.push(paper.rect((WIDTH - PISTON_WIDTH) / 2, PISTON_Y, PISTON_WIDTH,
        PISTON_HEIGHT)
        .attr("fill", PISTON_COLOUR)
        .attr("stroke", "black"));
    
    var crankPart = paper.set();
    crankPart.push(
        paper.path(
            "M " + [hubX - hubR, hubY].join(" ") +
            "L " + [hubX - hubr, hubY - PISTON_TRAVEL / 2].join(" ") +
            "a " + [hubr, hubr, 0, 0, 1, hubr * 2, 0].join(" ") +
            "L " + [hubX + hubR, hubY].join(" ") +
            "A " + [hubR, hubR, 0, 0, 1, hubX - hubR, hubY].join(" ") +
            "Z"
        )
        .attr("fill", WALL_COLOUR)
    );
    
    var pushrodPart = paper.set();
    pushrodPart.push(
        paper.rect((WIDTH - WALL_WIDTH) / 2, PISTON_Y + (PISTON_HEIGHT - WALL_WIDTH) / 2, WALL_WIDTH, PISTON_TRAVEL * 2)
        .attr("fill", PUSHROD_COLOUR)
        .attr("stroke-width", 0)
    );
    pushrodPart.insertBefore(pistonPart);


    var pistonMovement = new PistonMovement(pistonPart, WIDTH / 2, PISTON_Y, PISTON_TRAVEL);
    var crankMovement = new CrankMovement(crankPart, hubX, hubY);   //  TODO y position!
    var pushrodMovement = new PushrodMovement(pushrodPart, WIDTH / 2, PISTON_Y + PISTON_HEIGHT / 2, PISTON_TRAVEL, 2 * PISTON_TRAVEL, PISTON_TRAVEL);

    animator = new Animator;
    timing = new TimingBelt(500);
    timing.add(pistonMovement.update.bind(pistonMovement));
    timing.add(crankMovement.update.bind(crankMovement));
    timing.add(pushrodMovement.update.bind(pushrodMovement));
    animator.setObject(timing);
}