
window.randomBetween = function (a, b) {
  return a+Math.random()*(b-a);
}
window.smoothstep = function (from, to, value) {
  if (value <= from) return 0;
  if (value >= to) return 1;
  return (value-from)/(to-from);
}

window.Shaders = {
  
  'radionoise' : {
		uniforms: {
			tDiffuse: { type: "t", value: 0, texture: null },
			amount:   { type: "f", value: 0.1 },
      time:     { type: "f", value: 0 },
      width:    { type: "f", value: 300},
      height:   { type: "f", value: 300}
		},

		vertexShader: [
			"varying vec2 vUv;",
			"void main() {",
				"vUv = vec2( uv.x, 1.0 - uv.y );",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"

		].join("\n"),

		fragmentShader: [
"uniform float amount;",
"uniform float time;",
"uniform float width;",
"uniform float height;",
"uniform sampler2D tDiffuse;",
"varying vec2 vUv;",

"float rand(vec2 co){",
"    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
"}",
"void main( void ) {",
"	vec2 position = vUv;",
"vec4 colorInput = texture2D( tDiffuse, vUv );",

"vec2 roundPos = vec2(floor(width*position.x)/width,",
			               "floor(height*position.y)/height);",

"vec3 color = vec3(0.1, 1.0, 0.1)*vec3(rand(roundPos+time/1000.));",

"float d2 = 1.;",

"if (cos(position.y*40.+time*3.)<-0.95)",
"	color += vec3(0,0.07,0);",

"if (0.99999+cos(position.y*1.+time*0.8)<0.)",
"	color += vec3(0,0.15,0);",

"	gl_FragColor = colorInput*(1.0-amount)+amount*vec4( color, 1. );",
"}"
		].join("\n")
	},
  
  'perturbation' : {
		uniforms: {
			tDiffuse: { type: "t", value: 0, texture: null },
      p:     { type: "f", value: 0 },
      seed:     { type: "f", value: 0 },
      amount:     { type: "f", value: 0 },
      lines:   { type: "f", value: 300 }
		},

		vertexShader: [
			"varying vec2 vUv;",
			"void main() {",
				"vUv = vec2( uv.x, 1.0 - uv.y );",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"

		].join("\n"),

		fragmentShader: [
"uniform float p;",
"uniform float amount;",
"uniform float seed;",
"uniform float lines;",
"uniform sampler2D tDiffuse;",
"varying vec2 vUv;",

"float rand(vec2 co){",
"    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
"}",
"void main( void ) {",
"vec2 position = vUv;",
"float y = floor(lines*position.y)/lines;",
//"float r = rand(vec2(sin(time*0.00001), y));",
//"float c = smoothstep(0.0, 1.0, cos(y*10.02+time*1.01));",
//"float s = smoothstep(-0.5, 1.0, sin(y*4.321+time*2.59));",
"float disf = 0.01*(cos(position.y*130.+p*10.)+sin(position.y*183.+p*80.));",
"float parity = 0.; if(mod(y*lines, 2.)>0.5) parity=1.; else parity=-1.;",
"float a = smoothstep(0., 1.0, p);",
"position.x = amount*a*(y*0.3+disf)+position.x+",
        "amount*0.5*parity*smoothstep(0.6, 0.65, p)*(sin(position.y*(12.+40.*seed))+smoothstep(0.64, 0.65, p));",
"vec4 colorInput = texture2D( tDiffuse, position );",
"gl_FragColor = colorInput;",
"}"
		].join("\n")
	}

};
