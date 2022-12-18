/*AUTHOR Tom Lewis
tomlewisint@gmail.com
2022*/

function setup() {
    createCanvas(800,800);

    // Starting the shape using beginShape()
    beginShape(QUAD_STRIP);
    
    vertex(pointX, pointY)
    vertex(pointX + 50, pointY)
    vertex(pointX + 50, pointY + 50)
    vertex(pointX, pointY + 50)

  
  // Ending the shape
  endShape(CLOSE);
}

function draw() {

}

