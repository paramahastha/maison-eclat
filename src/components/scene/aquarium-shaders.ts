// Original shaders. Reference study: RealAbdurRehman/fluid-simulation (MIT),
// specifically its separation of caustics, absorption and refracted scene colour.
export const causticGLSL = `
vec2 aquaHash(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}
float aquaNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(aquaHash(cell).x, aquaHash(cell + vec2(1.0, 0.0)).x, f.x),
             mix(aquaHash(cell + vec2(0.0, 1.0)).x, aquaHash(cell + vec2(1.0)).x, f.x), f.y);
}
float aquaCaustic(vec2 p, float time) {
  vec2 drift = vec2(time * .09, -time * .065);
  p += vec2(aquaNoise(p * .7 + drift), aquaNoise(p * .7 - drift + 13.0)) * 1.8;
  float a = aquaNoise(p + drift) * .72 + aquaNoise(p * 2.1 - drift) * .28;
  float b = aquaNoise(p * 1.13 - drift + 29.0) * .72 + aquaNoise(p * 2.3 + drift + 7.0) * .28;
  float ridge = 1.0 - min(abs(sin(a * 12.566)), abs(sin(b * 12.566)));
  return pow(ridge, 5.0) * .7;
}
`;

export const waterFieldGLSL = `
uniform sampler2D uHeight;
uniform float uUseSimulation;
uniform float uTime;
uniform float uWet;
uniform float uImpact;
uniform float uImpactAge;
float aquaHeight(vec2 uv) {
  float fallback = sin(uv.x * 12.0 + uv.y * 7.0 + uTime * .6) * .012;
  fallback += sin(uv.y * 17.0 - uTime * .45) * .007;
  float r = length((uv - vec2(.5)) * vec2(2.4, 1.0));
  float age = max(0.0, uImpactAge);
  float wave = sin(r * 65.0 - age * 16.0) * exp(-pow((r - age * .45) * 12.0, 2.0)) * uImpact * .13;
  return mix(fallback, texture2D(uHeight, clamp(uv, .002, .998)).r, uUseSimulation) + wave;
}
vec2 aquaSlope(vec2 uv) {
  float d = .008;
  return vec2(aquaHeight(uv + vec2(d, 0.0)) - aquaHeight(uv - vec2(d, 0.0)),
              aquaHeight(uv + vec2(0.0, d)) - aquaHeight(uv - vec2(0.0, d))) / (2.0 * d);
}
`;

export const surfaceVertex = `
varying vec2 vUv;
varying vec3 vWorld;
${waterFieldGLSL}
void main() {
  vUv = uv;
  vec3 p = position;
  p.z += aquaHeight(uv);
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const surfaceFragment = `
uniform vec3 uTint;
varying vec2 vUv;
varying vec3 vWorld;
${waterFieldGLSL}
void main() {
  vec2 slope = aquaSlope(vUv);
  vec3 n = normalize(vec3(-slope.x / 12.0, 1.0, slope.y / 5.0));
  vec3 viewDir = normalize(cameraPosition - vWorld);
  float fresnel = .02 + .98 * pow(1.0 - max(dot(n, viewDir), 0.0), 5.0);
  vec3 reflected = reflect(-viewDir, n);
  float ribbon = pow(max(0.0, 1.0 - abs(reflected.x + .35) * 2.3), 7.0);
  float glint = pow(max(dot(n, normalize(vec3(-.5, 1.0, .5))), 0.0), 24.0);
  vec3 color = uTint * (.08 + fresnel * .35);
  color += uTint * (ribbon * .1 + glint * .1);
  gl_FragColor = vec4(color, .22 * uWet * smoothstep(.0, .3, vUv.y) * (1.0 - smoothstep(.65, 1.0, vUv.y)));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const receiverVertex = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export const receiverFragment = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uFloor;
uniform vec3 uGlow;
uniform float uMood;
uniform float uScale;
${waterFieldGLSL}
${causticGLSL}
void main() {
  vec2 p = vUv * mix(vec2(14.0, 10.0), vec2(12.0, 8.0), uFloor);
  p *= uScale;
  p += aquaSlope(vUv) * .12;
  float caustic = aquaCaustic(p + aquaSlope(vUv) * uImpact * .15, uTime) * (1.0 + uImpact * 5.0);
  float light = mix(.5 + vUv.y * .55, .9, uFloor);
  float shadow = 1.0 - exp(-dot((vUv - vec2(.5)) * vec2(3.0, 5.0), (vUv - vec2(.5)) * vec2(3.0, 5.0))) * .34 * uFloor;
  vec3 color = mix(vec3(.00972, .01161, .00857), uColor * light * shadow, uWet);
  color += uGlow * caustic * uWet * mix(.045, .14, uFloor);
  float atmosphere = 0.0;
  if (uMood < .5) {
    // Slow layered haze for the dark incense composition.
    atmosphere = aquaNoise(vec2(vUv.x * 5.0 + sin(vUv.y * 7.0 + uTime * .13), vUv.y * 3.0 - uTime * .08)) * .035;
  } else if (uMood < 1.5) {
    // Slanted shafts of morning light for the luminous citrus composition.
    atmosphere = pow(.5 + .5 * sin(vUv.x * 38.0 + vUv.y * 9.0 + sin(uTime * .15)), 12.0) * vUv.y * .065;
  } else {
    // Broad amber currents, like warm light across wood grain.
    atmosphere = pow(.5 + .5 * sin(vUv.y * 18.0 + aquaNoise(vUv * 4.0 + uTime * .025) * 6.0), 4.0) * .027;
  }
  color += uGlow * atmosphere * uWet * (1.0 - uFloor);
  float opacity = mix(1.0, 1.0 - smoothstep(.45, 1.0, vUv.y), uFloor);
  gl_FragColor = vec4(color, opacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
