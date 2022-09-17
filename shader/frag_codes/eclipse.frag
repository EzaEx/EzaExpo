#define TIME_SCALE 1.

precision highp float;

uniform float time;

uniform vec2 dims;

float GetCircle(vec2 uv, vec2 position, float radius)
{ 
    //Get modified distance to circle
    float dist = distance(position, uv); 
    dist =  smoothstep(dist - 0.6, dist, radius);
    return dist * dist * dist;
}

void main()
{ 

    vec2 coord = gl_FragCoord.xy * 2.0 - dims.xy;

    vec2 uv  = (coord) / dims.xy;

    float pixel = 0.;


    vec3 positions[4]; 
    positions[0] = vec3(sin(time * TIME_SCALE * 1.4 / 2.0) * 0.3, cos(time * TIME_SCALE * 2.3 / 2.0) * 0.4, 0.22);
    positions[1] = vec3(sin(time * TIME_SCALE * 3.0 / 2.0) * 0.5, cos(time * TIME_SCALE * 1.3 / 2.0) * 0.3, 0.12);
    positions[2] = vec3(sin(time * TIME_SCALE * 2.1 / 2.0) * 0.1, cos(time * TIME_SCALE * 1.9 / 2.0) * 0.35, 0.4);
    positions[3] = vec3(sin(time * TIME_SCALE * 1.1 / 2.0) * 0.4, cos(time * TIME_SCALE * 2.6 / 2.0) * 0.5, 0.15);

    for	(int i = 0; i < 4; i++){ 
        pixel += GetCircle(uv, positions[i].xy, positions[i].z);  
    } 
    
    
    //pixel = smoothstep(.9, 1., pixel) * smoothstep(1., .95, pixel); 
    pixel = smoothstep(0.001, 1.0, pixel) - step(0.9, pixel);

    //draw 
    vec3 col = 0.5 + 0.5*cos(time * TIME_SCALE*1.5+uv.xyx+vec3(0,2,4)); 
    //vec3 col = vec3(1.);
    gl_FragColor += vec4(vec3(pixel * col), 1.);
}