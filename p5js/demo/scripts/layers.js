/*AUTHOR Tom Lewis
tomlewisint@gmail.com
2022*/



class LayeredObject {
    constructor(layers, spacing) {
        this.layers = layers;
        this.layerVec = {x: 0, y: -1};

        this.layerVec.x *= spacing;
        this.layerVec.y *= spacing;
    }

    render(pos, angle = 0, twist = 0) {

        push();
        translate(pos.x, pos.y)

        for (let i = 0; i < this.layers.length; i++) {
            push();
            translate(this.layerVec.x * i, this.layerVec.y * i)
            //scale(1, 0.1)
            rotate(angle);
            this.layers[i]();
            pop();
        }
        
        pop();
    }
}

function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}

let obj;


function setup() {
    rectMode(CENTER);
    angleMode(RADIANS);

    createCanvas(800,800);
    
    let layers = [];
    let points = [{x: 0, y:20},{x: 120, y:-190}, {x: -90, y:-190}];


    for(let i = 60; i > 0; i--) {
        layer = function() { points.forEach((point, j) => {
            if(i % (j + 1) == 0) {
                rotate(point.x + point.y)
                square(point.x, point.y, sin(i / 15) * 100)
                rotate(-point.x -point.y)
            }
        })}
        layers.push(layer)
    }

    obj = new LayeredObject(layers, 7);
    
}


let iTime = 0;

function draw() {

    background(200, 200, 150);
    
    fill(50, 50, 50, 0)
    stroke(0);
    strokeWeight(2);

    push();
    translate(400, 600)
    rotate(iTime);
    line(0, -1000, 0, 1000)
    line(-1000, 0, 1000, 0)

    pop();

    fill(50, 50, 50)
    stroke(0);
    strokeWeight(2);
    obj.render({x: 400, y: 600}, iTime, iTime);

    iTime += 0.01;


    let fps = frameRate();
    text("framerate: "+nf(fps,2,2),0, 10);
}

