let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");

ctx.fillStyle = "#ff0000";

let w = canvas.width; let h = canvas.height;



let array = init2DArray(w, h)
console.log(array)
arrayCtx(array, ctx)






function init2DArray(w, h) {
    let array = []
    for (let y = 0; y < h; y ++) {
        array.push([])
        for (let x = 0; x < w; x ++) {
            array[y].push(1)
        }
    }
    return array;
}


function arrayCtx(array, ctx) {
    for (let y = 0; y < array.length; y ++) {
        for (let x = 0; x < array[0].length; x ++) {
            if (array[y][x]) ctx.fillRect(x, y, 1, 1);
        }
    }
}