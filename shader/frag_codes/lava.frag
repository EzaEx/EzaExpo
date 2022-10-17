precision highp float;

uniform float time;

uniform vec2 dims;

void main(){

    float sTime = 0.02 * time;

    vec2 uv = gl_FragCoord.xy / dims.xy;

    float val = max( 0.0, pow(1.0 - length(uv - vec2((sin(uv.y - sTime / 3.0) + 1.0) / 2.0, uv.y)), 5.0) );

    val += max( 0.0, pow(1.0 - length(uv - vec2((cos((uv.y - sTime / 12.0) * 2.1) + 1.0) / 2.0, uv.y)), 5.0) );

    val += max( 0.0, pow(1.0 - length(uv - vec2((sin((uv.y - sTime / 7.0) * 5.4) + 1.0) / 2.0, uv.y)), 5.0) );

    val += max( 0.0, pow(1.0 - length(uv - vec2((sin((uv.y - sTime / 9.0) * 1.3) + 0.5) / 1.0, uv.y)), 5.0) );

    val += max( 0.0, pow(1.0 - length(uv - vec2((cos((uv.y - sTime / 5.3) * 11.7) + 0.5) / 1.0, uv.y)), 5.0) );

    val += max( 0.0, pow(1.0 - length(uv - vec2((sin((uv.y - sTime / 6.3) * 7.8) + 1.0) / 2.0, uv.y)), 5.0) );


    val = smoothstep(0.95, 0.93, val);

    gl_FragColor = vec4(val * pow((1.0 - uv.y), 0.4), val * (0.9 - uv.y) * 0.5, uv.y - val, 1.0);

}