function preload(){
    backsound = loadSound("sounds/background.mp3");
}

function setup(){
    createCanvas(0,0);
    outputVolume(0.3);
    backsound.loop();
    background(255,255,255);
}