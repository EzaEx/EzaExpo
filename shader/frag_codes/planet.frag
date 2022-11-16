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


vec2 fisheye_distort(vec2 uv) {
    //FROM: https://www.shadertoy.com/view/ll2GWV

    float d=length(uv);
    float z = sqrt(1.0 - d * d);
    float r = atan(d, z) / 3.14159;
    float phi = atan(uv.y, uv.x);
    uv = vec2(r*cos(phi)+.5,r*sin(phi)+.5);
    
    //scale fish-eye to -1 -> 1 coords
    uv = uv * 2. -1.;

    return uv;
}


uniform float time;
uniform vec2 dims;

uniform vec3 altitude_col;
uniform vec3 terrain_col;
uniform vec3 arctic_col;
uniform vec3 marine_col;
uniform vec3 cloud_col;

uniform float planet_scale;

uniform float polar_boundary;

uniform float altitude_scale;
vec2 altitude_offset = vec2(-10.);


uniform float terrain_scale;
vec2 terrain_offset = vec2(5.);


vec2 polar_offset = vec2(0., 10.);


uniform float sea_level;




vec2 cloud_offset1 = vec2(50.);
vec2 cloud_offset2 = vec2(55.);

float cloud_scale = 10.;

float cloud_layer_diff = -.7;

float roll_angle = .4;
float s=sin(roll_angle), c=cos(roll_angle);
mat2 roll_mat = mat2( c, -s, s, c );

float time_scale = 0.07 * 0.02;

//---------------------------------------------------------//

void main()
{
    //calc rate for use in movement
    float rate = time * time_scale;

    vec2 uv = (gl_FragCoord.xy * 2.0 - dims.xy) / dims.xy;
    
    
    //rotate uv by angle
    uv *= roll_mat;

    //scale uv
    uv *= 1.05 * (1. / planet_scale);

    //hold pre-distorted uv
    vec2 uvc = uv + vec2(0);

    uv = fisheye_distort(uv);

    //hold stationary distorted uv
    vec2 uvtc = uv + vec2(0);

    //translate uv
    uv += vec2(rate, 0.);

    //calc uvs to generate terrain maps
    vec2 altitude_uv = (uv + altitude_offset) * altitude_scale;
    vec2 terrain_uv = (uv + terrain_offset) * terrain_scale;
    vec2 polar_uv = (uv + polar_offset) * altitude_scale;
    
    //-----------------------------------------------------//
    
    //land values
    float altitude = fbm(altitude_uv);
    float terrain = fbm(terrain_uv);
    float polar_terrain = fbm(polar_uv);

    vec3 land_col = altitude * altitude_col;
    land_col += terrain * terrain_col;

    vec3 sea_col = (1. - altitude / (sea_level * 1.7)) * marine_col;

   
    //change sea level based on altitude
    float sea_level_adjusted = sea_level + pow(uv.y, 2.) / 4.;

    float is_land = step(sea_level_adjusted, altitude);
    
    vec3 col = land_col * is_land +
                sea_col * (1. - is_land);
    
    //-----------------------------------------------------//

    //generate icecaps
    float is_polar = step(1. - pow(abs(uv.y), polar_boundary), polar_terrain);
    float polar = pow(altitude, .5); 
    
    //add icecaps
    col = is_polar * arctic_col * polar + 
            (1. - is_polar) * col;

    //-----------------------------------------------------//

    //generate cloud maps
    vec2 cloud_uv1 = uv + cloud_offset1 + vec2(rate, 0);
    vec2 cloud_uv2 = uv + cloud_offset2 + vec2(rate * cloud_layer_diff, 0);
    cloud_uv1 *= cloud_scale;
    cloud_uv1.x /= 3.;
    cloud_uv2 *= cloud_scale;
    cloud_uv2.x /= 2.;
    float cloud1 = fbm(cloud_uv1);
    float cloud2 = fbm(cloud_uv2);

    //combine cloud maps
    vec3 c_col = cloud1 * cloud2 * cloud_col;

    //add clouds
    col = mix(col, c_col, .5);
    col *= 1.5;

    //-----------------------------------------------------//

    //cut out planet circle
    float is_circle = smoothstep(1., .995, length(uvc));
    col *= is_circle;

    //light planet
    col *= smoothstep(.8, .1, uvtc.x);

    col *= smoothstep(0., 1., time*time_scale * 5.);

    gl_FragColor = vec4(col, 1.);
}