/*AUTHOR Tom Lewis
tomlewisint@gmail.com
2022*/

var logicWidth = 800;
var logicHeight = 800;


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const file_name = 'frag_codes/' + urlParams.get('name') + '.frag';

if (urlParams.get('pixelate')) {
    logicWidth = 120;
    logicHeight = 120;
}


const app = new PIXI.Application({
width: logicWidth,
height: logicHeight,
//autoDensity: true, // Handles high DPI screens
backgroundColor: 0x000000,
antialias: true
})
const shaderFrame = document.getElementById('shader_frame');

shaderFrame.appendChild(app.view);
app.view.style.imageRendering = 'pixelated';


const rect = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, logicWidth, logicHeight);
app.stage.addChild(rect);



app.loader.add('shader', file_name)
    .load(onLoaded);


// Handle the load completed
function onLoaded(loader,res) {

    //Get shader code as a string
    var shaderCode = res.shader.data;
    //Create our Pixi filter using our custom shader code
    var filter = new PIXI.Filter(null, shaderCode);

    filter.uniforms.time = 0.0;
    filter.uniforms.dims = [logicWidth, logicHeight];


    filter.uniforms.altitude_col = [0, .6, 0];
    filter.uniforms.terrain_col = [.45, 0, 0];
    filter.uniforms.arctic_col = [.6, .6, .6];
    filter.uniforms.marine_col = [0., .1, .5];
    filter.uniforms.cloud_col = [.8, .8, .8];

    filter.uniforms.planet_scale = .7;
    filter.uniforms.altitude_scale = 4.;
    filter.uniforms.terrain_scale = 4.;
    filter.uniforms.sea_level = .5;
    filter.uniforms.polar_boundary = 1.75;


    if (urlParams.get('weird')) {
        filter.uniforms.altitude_col = [.7, .2, .7];
        filter.uniforms.terrain_col = [.4, .4, 0];
        filter.uniforms.arctic_col = [.2, .2, .9];
        filter.uniforms.marine_col = [0, .4, .4];
        filter.uniforms.cloud_col = [1., .8, .8];

        filter.uniforms.planet_scale = 1.;
        filter.uniforms.altitude_scale = 8.;
        filter.uniforms.terrain_scale = 15.;
        filter.uniforms.sea_level = .4;
        filter.uniforms.polar_boundary = 1.75;
    }



    app.ticker.add((delta) => {
        filter.uniforms.time += delta;
    });

    
    //unused bluring filter
    var blurer = new PIXI.filters.BlurFilter();
    blurer.blur = .1;


    rect.filters = [filter];
}