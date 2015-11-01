/*  This file puts the different parts of our engine together.  */
"use strict";

var paper = new Raphael("canvas");


//  The cylidner part.
var cylinderPart = paper.set();
cylinderPart.push(paper.rect((WIDTH - PISTON_WIDTH) / 2 - WALL_WIDTH,
        PISTON_Y - HEAD_DISTANCE - WALL_WIDTH, 2 * WALL_WIDTH + PISTON_WIDTH,
        WALL_WIDTH).attr("fill", "darkgrey").attr("stroke", "black"));
cylinderPart.push(paper.rect((WIDTH - PISTON_WIDTH) / 2 - WALL_WIDTH,
        PISTON_Y - HEAD_DISTANCE, WALL_WIDTH, (PISTON_HEIGHT) * 2)
        .attr("fill", "darkgrey").attr("stroke", "black"));
cylinderPart.push(paper.rect((WIDTH + PISTON_WIDTH) / 2, PISTON_Y - HEAD_DISTANCE,
        WALL_WIDTH, (PISTON_HEIGHT) * 2).attr("fill", "darkgrey")
        .attr("stroke", "black"));


//  The piston part.
var pistonPart = paper.set();
pistonPart.push(paper.rect((WIDTH - PISTON_WIDTH) / 2, PISTON_Y, PISTON_WIDTH,
    PISTON_HEIGHT)
    .attr("fill", "grey")
    .attr("stroke", "black"));


var pistonMovement = new PistonMovement(pistonPart, WIDTH / 2, PISTON_Y, PISTON_TRAVEL);
var crankMovement = new CrankMovement(crankPart, WIDTH / 2, 400);   //  TODO y position!

var animator = new Animator;
var timing = new TimingBelt(500);
timing.add(pistonMovement.update.bind(pistonMovement));
timing.add(crankMovement.update.bind(crankMovement));
animator.setObject(timing);