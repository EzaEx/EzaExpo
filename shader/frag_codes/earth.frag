// For multiple octaves
#define NOISE fbm
#define NUM_NOISE_OCTAVES 7
#define PI 3.14159265

#define TIME_SCALE .4
#define ROLL_ANGLE .5


precision highp float;

uniform float time;

uniform vec2 dims;


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


void main()
{
    //-1 -> 1 coords
    vec2 uvc = (gl_FragCoord.xy * 2.0 - dims.xy) / dims.xy;
    vec2 uv = (gl_FragCoord.xy * 2.0 - dims.xy) / dims.xy;
    
    //roll earth 
    float angle = ROLL_ANGLE;
    float s=sin(angle), c=cos(angle);
    mat2 mat =  mat2( c, -s, s, c );
    uv *= mat;
    uvc *= mat;

    //zoom out
    uv *= 1.1;
    uvc *= 1.1;

    /// Fisheye Distortion ///
    //FROM: https://www.shadertoy.com/view/ll2GWV

    float d=length(uv);
    float z = sqrt(1.0 - d * d);
    float r = atan(d, z) / 3.14159;
    float phi = atan(uv.y, uv.x);
    //uv = vec2(r*cos(phi)+.5,r*sin(phi)+.5);
    /////////////////////////


    //scale fish-eye to -1 -> 1 coords
    //uv = uv * 2. -1.;

    //get noise val at point & rotate earth
    float val = fbm(uv * 5. + vec2(time * TIME_SCALE, 0.));

    //get discolour val at point
    float dval = fbm((uv * 2. + vec2(1000.)) + vec2((time / 2.5) * TIME_SCALE, 0.));
    dval = pow(dval, 4.) * 1.2;

    //boolean under or over artic level
    float polar_step_val = step(1. - pow(uv.y, 2.) - .05, val);
    
    //boolean under or over water level
    float step_val = step(0.5 + pow(uv.y, 2.) / 5., val);

    //draw textured land
    gl_FragColor = (vec4(step_val) - polar_step_val) * 
    vec4(1. - pow(val, 0.5) + dval, val + dval / 2., 0, 1.0);
    
    //add ocean
    gl_FragColor += (1. - (step_val + polar_step_val)) * 
    vec4(0.1, 0.1, val / 2. + .4, 1.0);

    //add polar regions
         gl_FragColor = (1. - polar_step_val) * gl_FragColor +
         polar_step_val * vec4(vec3(val + .2), 1.);


    //add clouds
    uv.x /= 2.;
    float cloud_1 = pow(fbm((uv + vec2(100.)) * 8.  + time * TIME_SCALE * vec2(.8, 0)), 4.);
    float cloud_2 = pow(fbm(uv * 7. + time * TIME_SCALE * vec2(.4, 0)), 4.);
    uv.x *= 2.;

    float clouds = (cloud_1 +cloud_2) * 2.;

    //gl_FragColor = vec4(mix(gl_FragColor.rgb, vec3(clouds), 0.5), 1.);

    //add lighting
    float light_val = smoothstep(.6, 0., uv.x);
    //light_val -= 1.;
    //light_val /= 3.;
    gl_FragColor *= vec4(vec3(light_val), 1.);
    
    //cut-out earth circle
    //gl_FragColor *= smoothstep(0., 1., time) * step(distance(uvc, vec2(0.)), 1.) ;
    gl_FragColor.a = 1.;
}