let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");

ctx.fillStyle = "#ff0000";

let w = canvas.width; let h = canvas.height;


let gridCpy = []
let grid = initRandom2DArray(w, h)


function mod(n, m) {
    return ((n % m) + m) % m;
  }


function render() {

    gridCpy = []
    for(let i = 0; i < grid.length; i++) gridCpy.push([[...grid[i]]])

    for (let y = 0; y < grid.length; y ++) {
        for (let x = 0; x < grid[0].length; x ++) {
            let n = 0;
            for (let yd = -1; yd <= 1; yd ++) {
                for (let xd = -1; xd <= 1; xd ++) {
                    if(Math.abs(xd) + Math.abs(yd) != 1) {
                        continue;
                    }
                    if (grid[y][x]) gridCpy[mod(y + yd, gridCpy.length)][mod(x + xd, gridCpy[0].length)] = 1;
                }
            }
            

        }
    }
    grid = gridCpy

    arrayCtx(grid, ctx)
    setTimeout(render, 3000)
}

render()



function initRandom2DArray(w, h) {
    let array = []
    for (let y = 0; y < h; y ++) {
        array.push([])
        for (let x = 0; x < w; x ++) {
            array[y].push(0)
        }
    }
    return array;
}


function arrayCtx(array, ctx) {
    ctx.clearRect(0, 0, w, h)
    for (let y = 0; y < array.length; y ++) {
        for (let x = 0; x < array[0].length; x ++) {
            if (array[y][x]) ctx.fillRect(x, y, 1, 1);
        }
    }
}