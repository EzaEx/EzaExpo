#define RED vec3(1., 0., 0.);
#define GREEN vec3(0., 1., 0.);
#define BLUE vec3(0., 0., 1.);

#define PI 3.14159265359

precision highp float;

uniform float time;

uniform vec2 dims;

vec3 circle_val(vec2 uv, vec2 pos, float radius) {
    float len = length(uv - pos);
    float val = step(len, radius);
    return vec3(val);
}

void main() {

    float sTime = time * 0.15;

    vec2 uv = (gl_FragCoord.xy * 2.0 - dims.xy) / dims.xy;

    uv *= 2.;

    vec3 col = vec3(0.);


    float angle1 = sTime;
    float angle2 = sTime + PI * (2. / 3.);
    float angle3 = sTime + PI * (4. / 3.);

    float dist = pow(sin(sTime / 4.), 2.) / 4.;

    vec2 pos1 = dist * vec2(sin(angle1), cos(angle1));
    vec2 pos2 = dist * vec2(sin(angle2), cos(angle2));
    vec2 pos3 = dist * vec2(sin(angle3), cos(angle3));


    col += circle_val(uv, pos1, .5) * RED;
    col += circle_val(uv, pos2, 0.5) * GREEN;
    col += circle_val(uv, pos3, 0.5) * BLUE;



    gl_FragColor = vec4(col, 1.);

}