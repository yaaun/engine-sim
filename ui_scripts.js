$("#slider").slider({min: 50, max: 4000, step: 10, value: 500,
    create: changeSpeedSlider, change: changeSpeedSlider});