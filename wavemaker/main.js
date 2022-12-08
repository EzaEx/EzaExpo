/*AUTHOR Tom Lewis
tomlewisint@gmail.com
2022*/

const RES = 2000;
const MULTIPLIER = RES / 2000;

const LINE_RES = 2000;

const DRAW_PER_FRAME = 10;

var LINE_WEIGHT
var MAX_FREQUENCY
var COMPONENTS
var Y_VARIANCE
var LINE_DENSITY 
var LINE_OPACITY

var g_to_process = [];

var COMPONENT_VALUES = [];

const COLOR_PAIRS = [
  ["#000000", "#ffffff"],
  ["#000000", "#dd9900"],
  ["#ffffff", "#000000"],
  ["#ffffff", "#550000"],
  ["#009", "#ff00ff"],
  ["#000000", "#ffaaaa"],]


function setup() {

  LINE_WEIGHT = random(0.9, 1.4);
  MAX_FREQUENCY = pow(random(1,4.5), 2);
  COMPONENTS = random(1, 9);
  Y_VARIANCE = pow(random(1, 5), 2);
  LINE_DENSITY = pow(random(2,5), 2);
  LINE_OPACITY = 0.4 / LINE_DENSITY;

  for (let i = 0; i < COMPONENTS; i++) {
    COMPONENT_VALUES.push([])
    COMPONENT_VALUES[i].push(random(-1000, 1000))
    COMPONENT_VALUES[i].push(random(0.1, MAX_FREQUENCY))
    COMPONENT_VALUES[i].push(random(0.2, 0.5 / sqrt(MAX_FREQUENCY / 2)))
  
  }
  

  colorMode(RGB, 1)

  createCanvas(RES, RES);
  strokeWeight(LINE_WEIGHT * MULTIPLIER)

  let colors = COLOR_PAIRS[Math.floor(random(0, 1)*COLOR_PAIRS.length)]


  background(colors[0]);
  
  let strokeCol = color(colors[1]);
  strokeCol.setAlpha(LINE_OPACITY);
  stroke(strokeCol);

  for(let x = -1; x < 1; x += 2 / LINE_RES) {
    g_to_process.push(x)
  }
}


function draw() {
  
  if (g_to_process.length > 0) {
    for(let i = 0; i < DRAW_PER_FRAME; i++) {
      if (g_to_process.length == 0) break;
      let index = Math.floor(random(0, 1)*g_to_process.length)

      x = g_to_process[index];
      g_to_process.splice(index, 1)
      
      sx = x;
      let y = 0;

      for(let i = 0; i < COMPONENTS; i++) {
        if(i % 2 == 0) {
          y += sin((x + COMPONENT_VALUES[i][0]) * COMPONENT_VALUES[i][1]) * COMPONENT_VALUES[i][2]
        }
        else{
          y += cos((x + COMPONENT_VALUES[i][0]) * COMPONENT_VALUES[i][1]) * COMPONENT_VALUES[i][2]
        }
      }
      
      let realX = (x + 1) * RES / 2;  
      let realY = (y + 1) * RES / 2  + MULTIPLIER * random(-Y_VARIANCE, Y_VARIANCE);

      for(let i = 0; i < LINE_DENSITY; i++) lineThroughPoint(realX, realY, LINE_OPACITY);
      //fill(1)
      //stroke(1)
      //square(realX, realY, 10);
    }
  }
  else {
    document.getElementById("load").innerText = "Finished";
  }
}
    

//}


function lineThroughPoint(x, y) {
    let angle = random(0, 2*PI);
    line(x - RES * 10 * cos(angle), y - RES * 10 * sin(angle), x + RES * 10 * cos(angle), y + RES * 10 * sin(angle));
}

