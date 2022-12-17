/*AUTHOR Tom Lewis
tomlewisint@gmail.com
2022*/


class Comp {
    constructor(x, y, w, h) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.col = min(random(0, 255) * 3, 255) * 4 / 5;
    }

    render(angle , off = 0) {
        //translate(off, 0);
        //rotate(angle);
        fill(this.col)
        translate(this.x, this.y);
        rotate(angle * (200 - off) / 200);
        rect(0, 0, this.w, this.h);
        rotate(-angle  * (200 - off) / 200);
        translate(-this.x, -this.y);
        //rotate(-angle);
       // translate(-off, 0);
        
    }
}

comps = [];

function setup() {
    rectMode(CENTER);
    angleMode(DEGREES);


    createCanvas(800,800);
    fill("green");
    for(let i = 0; i <30; i++) {
        comps.push(new Comp(0, -i * 6, (30-i) * 5, (30-i) * 5));
    }
    for(let i = 0; i < 30; i++) {
        comps.push(new Comp(0, -30 * 6 -i * 6, i * 5, i * 5));
    }
    for(let i = 0; i < 30; i++) {
        comps.push(new Comp(0, -60 * 6 -i * 6, (30-i) * 5, (30-i) * 5));
    }
}

let iTime = 0;

function draw() {
    background("white");
    translate(400, 600);
    comps.forEach((val, i) => {
        val.render(iTime);
    })

    rotate(iTime);
    translate(-400, -600);

    //rotate(iTime)
    translate(600, 600);
    
    comps.forEach((val, i) => {
        
        val.render(iTime, 200);
    })
    iTime += deltaTime / 60;
}

