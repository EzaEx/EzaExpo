let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d", { willReadFrequently: true });

let w = canvas.width; let h = canvas.height;


let grid = initRandom2DArray(w, h)
let gridCpy = []
grid.forEach((line) => gridCpy.push([...line]))


function mod(n, m) {
    return ((n % m) + m) % m;
  }


let y = 0;
let x = 0;


let _colVal = 1;

function setColVal() {
    ctx.fillStyle = `rgb(${(1-_colVal) ** 0.5 * 150}, ${_colVal * 50 + 150}, 0)`
    _colVal -= _colVal * 0.2;
}

let iter = 1;
function render() {

    for (let rows = 0; rows < Math.min(iter / 2, 10); rows ++) {
        for (let x = 0; x < grid[0].length; x ++) {

            let n = 0;
            for (let yd = -2; yd <= 2; yd ++) {
                for (let xd = -2; xd <= 2; xd ++) {
                    if(Math.abs(xd) + Math.abs(yd) > 2) continue;
                    if (yd == 0 && xd == 0) continue;
                    if (grid[mod(y + yd, grid.length)][mod(x + xd, grid[0].length)]) n++;
                }
            }

            if (grid[y][x] && n <= 5) { gridCpy[y][x] = 0; ctx.clearRect(x, y, 1, 1); changed = true; }
            if (!grid[y][x] && n >= 7) { gridCpy[y][x] = 1; ctx.fillRect(x, y, 1, 1); changed = true; }

        }
        y = (y + 1) % grid.length;
        if (y == 0) {
            grid = gridCpy
            gridCpy = []
            grid.forEach((line) => gridCpy.push([...line]))
            console.log("ran!")

            setColVal();

            if (changed) {changed = false; iter++; setTimeout(render, 1000 / iter); return}
            else {finish(); return}
        }
    }

    requestAnimationFrame(render)
}

setColVal();
arrayCtx(grid, ctx)

setColVal();
setTimeout(render, 2000)



function finish() {
    
    let y = grid.length - 1;
    let finalData = document.createElement("img");

    function sea() {
        if (y < 0) {setTimeout(rotate, 1000); return};

        for (let x = 0; x < grid[0].length; x ++) {
            if (!grid[y][x]) {
                ctx.fillStyle = `rgb(0, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 50) + 120})`
                ctx.fillRect(x, y, 1, 1)
            }
        }
        y--;
        requestAnimationFrame(sea);
    }
    setTimeout(sea, 1000);
    

    

    function rotate() {

        finalData.src = canvas.toDataURL(); 
        canvas.height = 300; 
        canvas.width = 300; 
        let rotIter = 0;

        ctx.imageSmoothingEnabled = false;
        canvas.style.imageRendering = "auto";
       
        function spin() {
    
            let yOff = rotIter;
            let xOff = rotIter;

            yOff = mod(yOff, canvas.height);
            xOff = mod(xOff, canvas.width);

            ctx.drawImage(finalData, -xOff, -yOff, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(finalData, -xOff + ctx.canvas.width, -yOff, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(finalData, -xOff, -yOff + ctx.canvas.height, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(finalData, -xOff + ctx.canvas.width, -yOff + ctx.canvas.height, ctx.canvas.width, ctx.canvas.height)
            
            rotIter += 1;
            requestAnimationFrame(spin)
        }

        spin()
    }
}



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