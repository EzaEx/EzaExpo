precision highp float;

// For multiple octaves
#define NOISE fbm
#define NUM_NOISE_OCTAVES 8


//BEGIN NOISE-FUNCTIONS ----------------------
//FROM: "https://www.shadertoy.com/view/4dS3Wd"

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

//END 2D NOISE-FUNCTIONS -------------------



uniform float time;
uniform vec2 dims;

vec2 noise_offset = vec2(-5.);
float noise_scale = 3.;

float terrain_scale = 2.;
vec2 terrain_offset = vec2(5.);

float sea_level = .5;

void main()
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - dims.xy) / dims.xy;
    
    vec2 altitude_uv = (uv + noise_offset) * noise_scale;
    vec2 terrain_uv = (uv + terrain_offset) * terrain_scale;
    
    float altitude = fbm(altitude_uv);
    float terrain = fbm(terrain_uv);

    vec3 col = altitude * vec3(.1, .8, .1);
    col += terrain * vec3(.7, .1, .1);

    float is_ground = step(sea_level, altitude);
    col *= is_ground;

    gl_FragColor = vec4(col, 1.);
}