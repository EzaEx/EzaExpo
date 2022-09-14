// For multiple octaves
#define NOISE fbm
#define NUM_NOISE_OCTAVES 7


precision highp float;

uniform float time;

uniform vec2 dims;


float hash(float p) { p = fract(p * 0.011); p *= p + 7.5; p *= p + p; return fract(p); }
float hash(vec2 p) {vec3 p3 = fract(vec3(p.xyx) * 0.13); p3 += dot(p3, p3.yzx + 3.333); return fract((p3.x + p3.y) * p3.z); }


float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
    vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}


float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_NOISE_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}


void main()
{
    vec2 uvc = (gl_FragCoord.xy * 2.0 - dims.xy) / dims.xy;
    vec2 uv = (gl_FragCoord.xy - dims.xy * 0.5)  / dims.xy;
    
    uv *= 2.0;
    
  /// Fisheye Distortion ///
    
    float d=length(uv);
    float z = sqrt(1.0 - d * d);
    float r = atan(d, z) / 3.14159;
    float phi = atan(uv.y, uv.x);
    
    uv = vec2(r*cos(phi)+.5,r*sin(phi)+.5);
    
    /////////////////////////
    
    uv.y -= 0.5;
    uv *= 10.;
    
    float val = fbm(uv + vec2(time, 0.));
    
    float step_val = step(0.5, val);
    
    gl_FragColor = vec4(1. - pow(val, 0.5), val, 0., 1.0);
    gl_FragColor += vec4(vec3(pow(uv.y, 4.)) / 100.0, 0.);
    gl_FragColor *= vec4(step_val);
    gl_FragColor += vec4(0., 0., (1. - step_val) / 2.0, 1.0);
    
    
    //cut-out earth circle
    gl_FragColor *= step(distance(uvc, vec2(0.)), 1.);
}