const logicWidth = 1000;
const logicHeight = 1000;

const fontSize = 142.857;


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var segments = 40;
if (urlParams.get('more')) {
    segments = 70;
}




// input box

input = document.createElement("input");
input.type = "text";
input.value = "type";
input.style.position = "absolute";
input.style.top = "10px";
input.style.left = "10px";
input.style.opacity = "0";
input.style.pointerEvents = "none";

document.body.appendChild(input);

const app = new PIXI.Application({
width: logicWidth,
height: logicHeight,
//autoDensity: true, // Handles high DPI screens
backgroundColor: 0x000000,
antialias: true
})
document.querySelector('#shader_frame').appendChild(app.view);


const rect = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, logicWidth, logicHeight);
const text = new PIXI.Text("", {
    fontFamily: 'monospace',
    fontSize: fontSize * 1.5,
    fill: 0xFFFFFF,
    align: 'center',
    antialias: false,
});

text.scale.x /= 1.5;
text.scale.y /= 1.5;

app.stage.addChild(rect);
rect.addChild(text);

text.anchor.set(0.5);
text.position.set(logicWidth / 2, logicHeight / 2);


const file_name = 'text-rect.frag';

app.loader.add('shader', file_name)
    .load(onLoaded);


// Handle the load completed
function onLoaded(loader,res) {

    //Get shader code as a string
    var shaderCode = res.shader.data;
    //Create our Pixi filter using our custom shader code
    var filter = new PIXI.Filter(null, shaderCode);

    //basic shader params
    filter.uniforms.time = 0.0;
    filter.uniforms.dims = [logicWidth, logicHeight];

    filter.uniforms.textHeight = (fontSize * 0.7) / logicWidth;

    filter.uniforms.segments = segments;

    //update time param of shader over time
    app.ticker.add((delta) => {
        filter.uniforms.time += delta / 1000.;

        text.text = input.value;

        input.focus();
    });

    var blurer = new PIXI.filters.BlurFilter();
    blurer.blur = 1.;


    rect.filters = [filter];
}