const logicWidth = 800;
const logicHeight = 800;


const app = new PIXI.Application({
width: logicWidth,
height: logicHeight,
//autoDensity: true, // Handles high DPI screens
backgroundColor: 0xFFFFFF,
antialias: true
})
document.querySelector('#shader_frame').appendChild(app.view);


const rect = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, logicWidth, logicHeight);
app.stage.addChild(rect);


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const file_name = 'frag_codes/' + urlParams.get('name') + '.frag';



app.loader.add('shader', file_name)
    .load(onLoaded);


// Handle the load completed
function onLoaded(loader,res) {

    //Get shader code as a string
    var shaderCode = res.shader.data;
    //Create our Pixi filter using our custom shader code
    var filter = new PIXI.Filter(null, shaderCode, {
    time: 0.0,
    dims: new PIXI.Point(logicWidth, logicHeight),
    });


    app.ticker.add((delta) => {
        filter.uniforms.time += 0.02 * delta;
    });

    var blurer = new PIXI.filters.BlurFilter();
    blurer.blur = .0;


    rect.filters = [filter];
}