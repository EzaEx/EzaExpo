const aspect = 16.0 / 9.0;
const logicWidth = 1000;
const logicHeight = 1000;

const app = new PIXI.Application({
width: logicWidth,
height: logicHeight,
//autoDensity: true, // Handles high DPI screens
backgroundColor: 0xFFFFFF,
antialias: true
})
document.querySelector('#frame').appendChild(app.view);

const rect = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, logicWidth, logicHeight).beginFill(0x00ff00).drawCircle(500, 500, 100);
app.stage.addChild(rect);


//Get shader code as a string
var shaderCode = `
    precision highp float;

    uniform float time;

    uniform vec2 dims;

    void main(){

        vec2 uv = gl_FragCoord.xy / dims.xy;

        float val = max( 0.0, pow(1.0 - length(uv - vec2((sin(uv.y - time / 3.0) + 1.0) / 2.0, uv.y)), 5.0) );

        val += max( 0.0, pow(1.0 - length(uv - vec2((cos((uv.y - time / 12.0) * 2.1) + 1.0) / 2.0, uv.y)), 5.0) );

        val += max( 0.0, pow(1.0 - length(uv - vec2((sin((uv.y - time / 7.0) * 5.4) + 1.0) / 2.0, uv.y)), 5.0) );

        val += max( 0.0, pow(1.0 - length(uv - vec2((sin((uv.y - time / 9.0) * 1.3) + 0.5) / 1.0, uv.y)), 5.0) );

        val += max( 0.0, pow(1.0 - length(uv - vec2((cos((uv.y - time / 5.3) * 11.7) + 0.5) / 1.0, uv.y)), 5.0) );

        val += max( 0.0, pow(1.0 - length(uv - vec2((sin((uv.y - time / 6.3) * 7.8) + 1.0) / 2.0, uv.y)), 5.0) );


        val = smoothstep(0.95, 0.93, val);

        gl_FragColor = vec4(val * pow((1.0 - uv.y), 0.4), val * (0.9 - uv.y) * 0.5, uv.y - val, 1.0);

    }
`;
//Create our Pixi filter using our custom shader code
var filter = new PIXI.Filter(null, shaderCode, {
time: 0.0,
dims: new PIXI.Point(logicWidth, logicHeight)
});


// Animate the filter
app.ticker.add((delta) => {
    filter.uniforms.time += 0.02 * delta;
});

rect.filters = [filter];