/*AUTHOR Tom Lewis
tomlewisint@gmail.com
2022*/



precision highp float;

uniform sampler2D uSampler;

uniform float time;
uniform vec2 dims;
uniform float textHeight;
uniform float segments;


/*float mod(float a, float b){
    return a - (b * floor(a/b))
}*/


void main(){

    float iTextHeight = textHeight;

    vec2 uv = (gl_FragCoord.xy / dims.xy);

    vec2 t_uv = uv;

    float section_start = 0.5 - iTextHeight / 2. - 0.1;
    float section_height = iTextHeight / 2.;

    section_start += section_height * (1. - uv.y) * 6.;
    

    float section_no = segments;

    t_uv.y = section_start + section_height * mod((uv.y + time) * section_no, 1.) / (section_no / 16.);


    vec3 col = texture2D(uSampler, t_uv).rgb;


    gl_FragColor = vec4(col, 1.);

}