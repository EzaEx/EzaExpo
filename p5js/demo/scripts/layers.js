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

    render(pos, angle = 0) {

        push();
        translate(pos.x, pos.y)

        this.layers.forEach((layer, i) => {
            push();
            translate(this.layerVec.x * i, this.layerVec.y * i)
            rotate(angle);
            layer();
            pop();
        })
        
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
    
    let layers = []
    for(let i = 30; i > -30; i--) {
        layer = function() {polygon(0, 0, (30 - abs(i))*3, 6)}
        layers.push(layer)
    }

    obj = new LayeredObject(layers, 7);

    fill("#0f0")
    stroke('#000');
    strokeWeight(1);

    
}


let iTime = 0;

function draw() {


    background("white");
    
    obj.render({x: 400, y: 700}, iTime);

    iTime += 0.01;


    let fps = frameRate();
    text("framerate: "+nf(fps,2,2),0, 10);
}

