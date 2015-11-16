/*  This file puts the different parts of our engine together.  */
"use strict";

var animator, timing, paper, combustion;


function assemble() {
    paper = new Raphael("canvas");
    var i, ribs;
    var rib;
    
    var cylinderX = (WIDTH - PISTON_WIDTH) / 2 - WALL_WIDTH,
        cylinderY = PISTON_Y - HEAD_DISTANCE - WALL_WIDTH,
        cylinderW = 2 * WALL_WIDTH + PISTON_WIDTH,
        cylinderH = WALL_WIDTH + HEAD_DISTANCE + (PISTON_HEIGHT) * 2;
    
    var inletX = cylinderX - PISTON_WIDTH / 2 - WALL_WIDTH,
        inletY = cylinderY,
        inletW = PISTON_WIDTH / 2,
        inletH = cylinderH;
    
    var exhaustX = cylinderX + cylinderW,
        exhaustY = cylinderY,
        exhaustW = PISTON_WIDTH / 2,
        exhaustH = cylinderH;
        
    var hubX = WIDTH / 2,
        hubY = PISTON_Y + 2.5 * PISTON_TRAVEL + PISTON_HEIGHT / 2,
        hubR = HUB_R,
        hubr = HUB_r;
    
    var ribOffset;
    
    
    var backgroundArea = paper.set();
    backgroundArea.push(
        paper.rect(inletX, inletY + WALL_WIDTH + HEAD_DISTANCE, inletW + WALL_WIDTH, inletH - WALL_WIDTH - HEAD_DISTANCE)
        .attr("fill", "270-rgb(" + COLD_COLOUR.join() + ")-white")
        .attr("stroke-width", 0),
        paper.rect(exhaustX, exhaustY + WALL_WIDTH + HEAD_DISTANCE, exhaustW + WALL_WIDTH, exhaustH - WALL_WIDTH - HEAD_DISTANCE)
        .attr("fill", "270-rgb(" + HOT_COLOUR.join() + ")-white")
        .attr("stroke-width", 0)
    );
    
    var immobilePart = 
        paper.rect(inletX + WALL_WIDTH, inletY + WALL_WIDTH, inletW + cylinderW + exhaustW, HEAD_DISTANCE)
        .attr("stroke-width", 0);
    
    var mobilePart =
        paper.rect(cylinderX + WALL_WIDTH, cylinderY + WALL_WIDTH + HEAD_DISTANCE, PISTON_WIDTH, PISTON_HEIGHT)
        .attr("stroke-width", 0);
        
    function colourFunc(T) {
        return [
            T / 100 * HOT_COLOUR[0],
            T / 100 * (HOT_COLOUR[1] - COLD_COLOUR[1]) + COLD_COLOUR[1],
            T / 100 * (HOT_COLOUR[2] - COLD_COLOUR[2]) + COLD_COLOUR[2]
        ];
    }

    //  The cylinder part.
    var cylinderPart = paper.set();
    cylinderPart.push(
        paper.rect(inletX, inletY, cylinderW + inletW + exhaustW + 2 * WALL_WIDTH, WALL_WIDTH),
        paper.rect(cylinderX, cylinderY + WALL_WIDTH + HEAD_DISTANCE, WALL_WIDTH, cylinderH - WALL_WIDTH - HEAD_DISTANCE),
        paper.rect(cylinderX + cylinderW - WALL_WIDTH, cylinderY + WALL_WIDTH + HEAD_DISTANCE, WALL_WIDTH, cylinderH - WALL_WIDTH - HEAD_DISTANCE),
        paper.rect(inletX, inletY, WALL_WIDTH, inletH - inletW / 2),
        paper.rect(exhaustX + exhaustW, exhaustY, WALL_WIDTH, exhaustH - exhaustW / 2),
        paper.path(
            "M " + [inletX + WALL_WIDTH, inletY + WALL_WIDTH + HEAD_DISTANCE].join(" ") +
            "l " + [inletW / 6, 0].join(" ") +
            "l " + [inletW / 4 - inletW / 6, inletW / 6].join(" ") +
            "l " + [-inletW / 4, 0].join(" ") +
            "Z"
        ),
        paper.path(
            "M " + [inletX + inletW + WALL_WIDTH, inletY + WALL_WIDTH + HEAD_DISTANCE].join(" ") +
            "l " + [-inletW / 6, 0].join(" ") +
            "l " + [inletW / 6 - inletW / 4, inletW / 6].join(" ") +
            "l " + [inletW / 4, 0].join(" ") +
            "Z"
        ),
        paper.path(
            "M " + [exhaustX, exhaustY + WALL_WIDTH + HEAD_DISTANCE].join(" ") +
            "l " + [exhaustW / 6, 0].join(" ") +
            "l " + [exhaustW / 4 - exhaustW / 6, exhaustW / 6].join(" ") +
            "l " + [-exhaustW / 4, 0].join(" ") +
            "Z"
        ),
        paper.path(
            "M " + [exhaustX + exhaustW, exhaustY + WALL_WIDTH + HEAD_DISTANCE].join(" ") +
            "l " + [-exhaustW / 6, 0].join(" ") +
            "l " + [exhaustW / 6 - exhaustW / 4, exhaustW / 6].join(" ") +
            "l " + [exhaustW / 4, 0].join(" ") +
            "Z"
        )
    )
    .attr("fill", WALL_COLOUR)
    .attr("stroke-width", 0);


    var inletValvePart = paper.set();
    inletValvePart.push(
        paper.path(
            "M " + [inletX + WALL_WIDTH + inletW / 6, inletY + WALL_WIDTH + HEAD_DISTANCE].join(" ") +
            "l " + [inletW / 2 + 2 * (inletW / 4 - inletW / 6), 0].join(" ") +
            "l " + [inletW / 6 - inletW / 4, inletW / 6].join(" ") +
            "q " + [-inletW / 6, 0, -inletW / 6, PUSHROD_LENGTH].join(" ") +
            "l " + [-inletW / 6, 0].join(" ") +
            "q " + [0, -PUSHROD_LENGTH, -inletW / 6, -PUSHROD_LENGTH].join(" ") +
            "Z"
        )
        .attr("fill", PUSHROD_COLOUR)
    );
    
    var exhaustValvePart = paper.set();
    exhaustValvePart.push(
        paper.path(
            "M " + [exhaustX + exhaustW / 6, exhaustY + WALL_WIDTH + HEAD_DISTANCE].join(" ") +
            "l " + [exhaustW / 2 + 2 * (exhaustW / 4 - exhaustW / 6), 0].join(" ") +
            "l " + [exhaustW / 6 - exhaustW / 4, exhaustW / 6].join(" ") +
            "q " + [-exhaustW / 6, 0, -exhaustW / 6, PUSHROD_LENGTH].join(" ") +
            "l " + [-exhaustW / 6, 0].join(" ") +
            "q " + [0, -PUSHROD_LENGTH, -exhaustW / 6, -PUSHROD_LENGTH].join(" ") +
            "Z"
        )
        .attr("fill", PUSHROD_COLOUR)
    );
    
    /*  The bottom of the valves must be covered, hence these two shapes are
        handled separately from the rest of the cylinder walls.  */
    var valveBottom = paper.set();
    valveBottom.push(
        paper.rect(inletX, inletY + inletH, inletW + 2 * WALL_WIDTH, WALL_WIDTH),
        paper.rect(exhaustX - WALL_WIDTH, exhaustY + exhaustH, exhaustW + 2 * WALL_WIDTH, WALL_WIDTH)
    )
    .attr("fill", WALL_COLOUR)
    .attr("stroke-width", 0);

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
        paper.path(
            "M " + [hubX, PISTON_Y + PISTON_HEIGHT / 2].join(" ") +
            "l " + [PUSHROD_d / 2, 0].join(" ") +
            "l " + [(PUSHROD_D - PUSHROD_d) / 2, PUSHROD_LENGTH].join(" ") +
            "a " + [PUSHROD_D / 2, PUSHROD_D / 2, 0, 0, 1, -hubr * 2, 0].join(" ") +
            "l " + [(PUSHROD_D - PUSHROD_d) / 2, -PUSHROD_LENGTH].join(" ") +
            "Z"
        )
        .attr("fill", PUSHROD_COLOUR)
    );
    pushrodPart.insertBefore(pistonPart);
    
    var sparkPlugPart = paper.set();
    sparkPlugPart.push(
        paper.rect(
            (WIDTH - PLUG_WIDTH) / 2,
            PLUG_Y,
            PLUG_WIDTH,
            PLUG_HEIGHT,
            PLUG_CORNER_R
        )
        .attr("fill", PLUG_COLOUR),
        paper.path(
            "M " + [WIDTH / 2 - PLUG_PRONG_WIDTH, PLUG_Y + PLUG_HEIGHT].join(" ") +
            "l " + [0, PLUG_PRONG_HEIGHT].join(" ") +
            "l " + [PLUG_PRONG_WIDTH, 0].join(" ") +
            "l " + [-PLUG_PRONG_WIDTH, 0].join(" ") +
            "Z"
        ),
        paper.path(
            "M " + [WIDTH / 2 + PLUG_PRONG_WIDTH, PLUG_Y + PLUG_HEIGHT].join(" ") +
            "l " + [0, PLUG_PRONG_HEIGHT / 2].join(" ") +
            "l " + [-PLUG_PRONG_WIDTH, 0].join(" ") +
            "l " + [+PLUG_PRONG_WIDTH, 0].join(" ") +
            "Z"
        )/*,
        paper.path(
            "M " [WIDTH / 2, PLUG_Y + PLUG_HEIGHT / 2].join(" "))*/
    );


    var pistonMovement = new PistonMovement(pistonPart, WIDTH / 2, PISTON_Y, PISTON_TRAVEL);
    var crankMovement = new CrankMovement(crankPart, hubX, hubY);   //  TODO y position!
    var pushrodMovement = new PushrodMovement(pushrodPart, WIDTH / 2, PISTON_Y + PISTON_HEIGHT / 2, PISTON_TRAVEL, 2 * PISTON_TRAVEL);
    var inletValveMovement = new ValveMovement(inletValvePart, PISTON_TRAVEL / 8, 0, Math.PI);
    var exhaustValveMovement = new ValveMovement(exhaustValvePart, PISTON_TRAVEL / 8, 3 * Math.PI, 4 * Math.PI);
    var combustionMovement = new CombustionMovement(immobilePart, mobilePart, PISTON_HEIGHT, PISTON_TRAVEL, colourFunc);

    animator = new Animator;
    timing = new TimingBelt(500);
    combustion = combustionMovement;
    
    timing.add(pistonMovement.update.bind(pistonMovement));
    timing.add(crankMovement.update.bind(crankMovement));
    timing.add(pushrodMovement.update.bind(pushrodMovement));
    timing.add(inletValveMovement.update.bind(inletValveMovement));
    timing.add(exhaustValveMovement.update.bind(exhaustValveMovement));
    timing.add(combustionMovement.update.bind(combustionMovement));
    
    animator.setObject(timing);
}