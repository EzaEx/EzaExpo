/*AUTHOR Tom Lewis
tomlewisint@gmail.com
2022*/

var time = 0;
var noiseRes = 0.01;
var pixelRes = 10;

var o1 = 10000;
var o2 = -10000;

var scaling = 1.5;

function setup() {
    createCanvas(800,800);
    //strokeWeight(3);
    blendMode(BLEND)
  }

  function draw() {
    clear();
    //background(255, 150, 0);
    noStroke();
    for (let i = 0; i < height; i += pixelRes) {
      for (let j = 0; j < width; j += pixelRes) {
        
        noiseDetail(4, 0.3);

        n = noise(i * noiseRes, j * noiseRes * scaling, time * noiseRes);
        if(n < 0.4) {
            fill(0, 150, 0);
            rect(i, j, pixelRes);
        }

        n = noise((i + o2) * noiseRes, (j + o2) * noiseRes * scaling, time * noiseRes);
        if(n < 0.3) {
            fill(255, 100, 255);
            rect(i, j, pixelRes);
        }

        n = noise((i + o1) * noiseRes, (j + o1) * noiseRes * scaling, time * noiseRes);
        if(n < 0.3) {
            fill(150, 150, 0);
            rect(i, j, pixelRes);
        }
      }
    }
   time ++;
  }

