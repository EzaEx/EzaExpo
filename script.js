let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");

ctx.fillStyle = "#ff0000";

let w = canvas.width; let h = canvas.height;


let array2 = []
let array3 = initRandom2DArray(w, h)
array2 = array3;

function render() {


    console.log(array3)

    for (let y = 0; y < array3.length; y ++) {
        for (let x = 0; x < array3[0].length; x ++) {
            let n = 0;
            for (let yd = -1; yd <= 1; yd ++) {
                for (let xd = -1; xd <= 1; xd ++) {
                    if(Math.abs(xd) + Math.abs(yd) != 1) {
                        continue;
                    }
                    n++;
                }
            }
            if (n == 0) array2[y][x] = 0;
            else if (n < 3) array2[y][x] = 1;
            else array2[y][x] = 0;
        }
    }
    array3 = array2

    arrayCtx(array3, ctx)
    //setTimeout(render, 2000)
}

render()



function initRandom2DArray(w, h) {
    let array = []
    for (let y = 0; y < h; y ++) {
        array.push([])
        for (let x = 0; x < w; x ++) {
            array[y].push(Math.round(Math.random()))
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