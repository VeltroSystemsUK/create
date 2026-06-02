FB.widgets = {};
FB.widgets._registry = {};

// Normalize color for HTML5 color input (must be #rrggbb format)
FB.widgets.normalizeColorForInput = function(color) {
  if (!color) return "#000000";

  // If it's already a valid 6-digit hex, return it
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color;
  }

  // Convert 3-digit hex to 6-digit hex
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }

  // Convert 8-digit hex (with alpha) to 6-digit hex (strip alpha)
  if (/^#[0-9a-f]{8}$/i.test(color)) {
    return color.substring(0, 7);
  }

  // Handle rgb/rgba colors by extracting hex
  var rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    var r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    var g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    var b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    return '#' + r + g + b;
  }

  // Default fallback
  return "#000000";
};

// Safe split — handles AI-generated arrays in string props
FB.widgets.safeSplit = function (val, fallback) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.split(",");
  return (fallback || "").split(",");
};

FB.widgets.register = function (type, def) {
  FB.widgets._registry[type] = def;
};

FB.widgets.get = function (type) {
  return FB.widgets._registry[type] || null;
};

FB.widgets.render = function (type, props) {
  var def = FB.widgets.get(type);
  if (!def || typeof def.render !== 'function')
    return (
      '<div style="padding:1rem;color:#999">Unknown widget: ' + type + "</div>"
    );
  return def.render(props);
};

FB.widgets._skipProps = [
  "bgType","bgGradientDir","bgGradientColor1","bgGradientColor2","bgImage",
  "bgImageUrl","bgImageOpacity","bgImageSize","bgImageContainer",
  "borderStyle","paddingV","paddingH","marginV","marginH",
  "boxShadow","shadowColor","shadowBlur","shadowSpread","shadowOffsetX","shadowOffsetY",
  "entranceAnim","hoverEffect","hoverScale","hoverTransition","animDuration","animDelay",
  "rooms","cards","roomLabels","colors"  // Array editors handled separately
];

FB.widgets._propMeta = {
  text: { label: "Text", type: "text" },
  words: { label: "Words", type: "text", placeholder: "Word1, Word2, ..." },
  overlayText: { label: "Overlay Text", type: "text" },
  tag: { label: "Tag", type: "select", options: ["h1","h2","h3","h4","h5","h6","p","span"] },
  mode: { label: "Mode", type: "select", options: ["proximity","always","hover"] },
  color: { label: "Color", type: "color" },
  textColor: { label: "Text Color", type: "color" },
  accentColor: { label: "Accent Color", type: "color" },
  bg: { label: "Background", type: "color" },
  fontSize: { label: "Font Size", type: "range", min: 12, max: 200, step: 2 },
  fontWeight: { label: "Font Weight", type: "range", min: 100, max: 900, step: 100 },
  fontFamily: { label: "Font Family", type: "select", options: ["Inter","Lexend","monospace","sans-serif","serif","inherit"] },
  letterSpacing: { label: "Letter Spacing", type: "range", min: -10, max: 20, step: 1 },
  lineHeight: { label: "Line Height", type: "range", min: 0.5, max: 3, step: 0.1 },
  align: { label: "Align", type: "select", options: ["left","center","right"] },
  textAlign: { label: "Text Align", type: "select", options: ["left","center","right"] },
  textTransform: { label: "Transform", type: "select", options: ["none","uppercase","lowercase","capitalize"] },
  height: { label: "Height", type: "range", min: 100, max: 1000, step: 10 },
  speed: { label: "Speed", type: "range", min: 0.01, max: 5, step: 0.01 },
  amplitude: { label: "Amplitude", type: "range", min: 0, max: 100, step: 1 },
  frequency: { label: "Frequency", type: "range", min: 0.001, max: 1, step: 0.001 },
  intensity: { label: "Intensity", type: "range", min: 0, max: 2, step: 0.05 },
  opacity: { label: "Opacity", type: "range", min: 0, max: 100, step: 5 },
  particleCount: { label: "Particles", type: "range", min: 1, max: 500, step: 1 },
  particleSize: { label: "Particle Size", type: "range", min: 1, max: 20, step: 1 },
  particleColor: { label: "Particle Color", type: "color" },
  elementCount: { label: "Elements", type: "range", min: 1, max: 50, step: 1 },
  cardCount: { label: "Cards", type: "range", min: 1, max: 20, step: 1 },
  layerCount: { label: "Layers", type: "range", min: 1, max: 10, step: 1 },
  count: { label: "Count", type: "range", min: 1, max: 50, step: 1 },
  rows: { label: "Rows", type: "range", min: 1, max: 10, step: 1 },
  cols: { label: "Columns", type: "range", min: 1, max: 10, step: 1 },
  gap: { label: "Gap", type: "range", min: 0, max: 40, step: 2 },
  image: { label: "Image URL", type: "text" },
  images: { label: "Images", type: "text", placeholder: "url1, url2, ..." },
  imageUrl: { label: "Image URL", type: "text" },
  borderRadius: { label: "Border Radius", type: "range", min: 0, max: 60, step: 1 },
  borderWidth: { label: "Border Width", type: "range", min: 0, max: 12, step: 1 },
  borderColor: { label: "Border Color", type: "color" },
  value: { label: "Value", type: "number" },
  prefix: { label: "Prefix", type: "text" },
  suffix: { label: "Suffix", type: "text" },
  duration: { label: "Duration (ms)", type: "range", min: 100, max: 5000, step: 100 },
  cursor: { label: "Show Cursor", type: "checkbox" },
  loop: { label: "Loop", type: "checkbox" },
  charset: { label: "Charset", type: "text" },
  scrambleSpeed: { label: "Scramble Speed", type: "range", min: 5, max: 200, step: 5 },
  revealSpeed: { label: "Reveal Speed (ms)", type: "range", min: 100, max: 10000, step: 100 },
  magneticRadius: { label: "Radius", type: "range", min: 20, max: 500, step: 10 },
  magneticStrength: { label: "Strength", type: "range", min: 0.01, max: 2, step: 0.01 },
  distortionRadius: { label: "Radius", type: "range", min: 20, max: 300, step: 5 },
  distortionStrength: { label: "Strength", type: "range", min: 0.01, max: 1, step: 0.01 },
  lensSize: { label: "Lens Size", type: "range", min: 20, max: 300, step: 5 },
  magnification: { label: "Magnification", type: "range", min: 1, max: 10, step: 0.5 },
  rippleColor: { label: "Ripple Color", type: "color" },
  rippleSize: { label: "Ripple Size", type: "range", min: 20, max: 300, step: 5 },
  rippleDuration: { label: "Duration (ms)", type: "range", min: 100, max: 3000, step: 50 },
  gravity: { label: "Gravity", type: "range", min: 0, max: 5, step: 0.1 },
  restitution: { label: "Bounce", type: "range", min: 0, max: 1, step: 0.05 },
  wellStrength: { label: "Well Strength", type: "range", min: 0.01, max: 2, step: 0.01 },
  wellCount: { label: "Well Count", type: "range", min: 1, max: 10, step: 1 },
  wellRadius: { label: "Well Radius", type: "range", min: 5, max: 100, step: 5 },
  wellMode: { label: "Well Mode", type: "select", options: ["attract","repel","orbit"] },
  particleTrail: { label: "Particle Trail", type: "checkbox" },
  particleGlow: { label: "Glow", type: "checkbox" },
  glowColor: { label: "Glow Color", type: "color" },
  glowEffect: { label: "Glow Effect", type: "checkbox" },
  glowSize: { label: "Glow Size", type: "range", min: 1, max: 50, step: 1 },
  colors: { label: "Colors", type: "text", placeholder: "#color1, #color2, ..." },
  particleColors: { label: "Colors", type: "text" },
  color1: { label: "Color 1", type: "color" },
  color2: { label: "Color 2", type: "color" },
  dualColour: { label: "Dual Colour", type: "checkbox" },
  dualColour2: { label: "Second Color", type: "color" },
  gradientText: { label: "Gradient Text", type: "checkbox" },
  gradientTextColor1: { label: "Gradient Start", type: "color" },
  gradientTextColor2: { label: "Gradient End", type: "color" },
  gradientTextDir: { label: "Gradient Direction", type: "text" },
  textShadow: { label: "Text Shadow", type: "checkbox" },
  textShadowColor: { label: "Shadow Color", type: "color" },
  textShadowBlur: { label: "Shadow Blur", type: "range", min: 0, max: 30, step: 1 },
  minWeight: { label: "Min Weight", type: "range", min: 100, max: 900, step: 100 },
  maxWeight: { label: "Max Weight", type: "range", min: 100, max: 900, step: 100 },
  radius: { label: "Radius", type: "range", min: 50, max: 500, step: 10 },
  waveType: { label: "Wave Type", type: "select", options: ["sine","cosine","triangle","sawtooth"] },
  waveDirection: { label: "Direction", type: "select", options: ["up","down","left","right"] },
  phaseOffset: { label: "Phase Offset", type: "range", min: 0, max: 6.28, step: 0.01 },
  morphSpeed: { label: "Morph Speed (ms)", type: "range", min: 200, max: 10000, step: 200 },
  fadeSpeed: { label: "Fade Speed (ms)", type: "range", min: 50, max: 2000, step: 50 },
  morphDirection: { label: "Direction", type: "select", options: ["forward","reverse","random"] },
  highlightCurrent: { label: "Highlight Current", type: "checkbox" },
  highlightColor: { label: "Highlight Color", type: "color" },
  autoScramble: { label: "Auto Scramble", type: "checkbox" },
  autoScrambleInterval: { label: "Interval (ms)", type: "range", min: 500, max: 10000, step: 500 },
  revealTrigger: { label: "Trigger", type: "select", options: ["hover","click","scroll","auto"] },
  decodeTrigger: { label: "Trigger", type: "select", options: ["hover","click","scroll"] },
  scrambleIntensity: { label: "Intensity", type: "range", min: 0, max: 1, step: 0.05 },
  cipherStyle: { label: "Cipher Style", type: "select", options: ["random","sequential","reverse"] },
  cursorStyle: { label: "Cursor Style", type: "select", options: ["blink","solid","underscore"] },
  cursorColor: { label: "Cursor Color", type: "color" },
  multiText: { label: "Multi Text", type: "text" },
  multiTextDelay: { label: "Text Delay (ms)", type: "range", min: 500, max: 10000, step: 100 },
  maskBlendMode: { label: "Blend Mode", type: "select", options: ["source-atop","multiply","screen","overlay"] },
  maskScale: { label: "Mask Scale", type: "range", min: 10, max: 200, step: 5 },
  maskAnimation: { label: "Animate", type: "checkbox" },
  maskAnimSpeed: { label: "Anim Speed", type: "range", min: 1, max: 60, step: 1 },
  maskFallbackColor: { label: "Fallback Color", type: "color" },
  maskVideoUrl: { label: "Video URL", type: "text" },
  numberFormat: { label: "Format", type: "select", options: ["plain","comma","dot","space"] },
  separatorStyle: { label: "Separator", type: "select", options: ["none","comma","dot","space"] },
  easingCurve: { label: "Easing", type: "select", options: ["ease-out","ease-in-out","linear","spring"] },
  animateOnScroll: { label: "Animate on Scroll", type: "checkbox" },
  startFrom: { label: "Start From", type: "number" },
  filterIntensity: { label: "Intensity", type: "range", min: 0, max: 2, step: 0.05 },
  perCharRandom: { label: "Per-Char Random", type: "checkbox" },
  imageShape: { label: "Shape", type: "select", options: ["square","circle","triangle"] },
  imageSize: { label: "Image Size", type: "range", min: 20, max: 200, step: 5 },
  imageBorderRadius: { label: "Image Radius", type: "range", min: 0, max: 50, step: 1 },
  imageBorderWidth: { label: "Image Border", type: "range", min: 0, max: 10, step: 1 },
  imageBorderColor: { label: "Image Border Color", type: "color" },
  physicsEnabled: { label: "Physics", type: "checkbox" },
  mouseInteraction: { label: "Mouse Interaction", type: "checkbox" },
  mouseForce: { label: "Mouse Force", type: "range", min: 0, max: 20, step: 1 },
  windEnabled: { label: "Wind", type: "checkbox" },
  windStrength: { label: "Wind Strength", type: "range", min: 0, max: 5, step: 0.1 },
  elementShape: { label: "Shape", type: "select", options: ["circle","square","triangle","diamond"] },
  elementSize: { label: "Element Size", type: "range", min: 10, max: 100, step: 5 },
  elementColors: { label: "Colors", type: "text" },
  repelMode: { label: "Repel Mode", type: "checkbox" },
  elasticBounce: { label: "Elastic Bounce", type: "checkbox" },
  showCursor: { label: "Show Cursor", type: "checkbox" },
  cursorSize: { label: "Cursor Size", type: "range", min: 5, max: 60, step: 1 },
  cursorColor: { label: "Cursor Color", type: "color" },
  particleShape: { label: "Shape", type: "select", options: ["circle","square","triangle","star"] },
  particleBlendMode: { label: "Blend Mode", type: "select", options: ["normal","screen","multiply","overlay"] },
  particleGravity: { label: "Gravity", type: "range", min: -2, max: 2, step: 0.1 },
  particleRandomSize: { label: "Random Size", type: "checkbox" },
  particleRotation: { label: "Rotation", type: "range", min: 0, max: 360, step: 5 },
  particleScatter: { label: "Scatter", type: "range", min: 0, max: 5, step: 0.1 },
  particlePulse: { label: "Pulse", type: "checkbox" },
  fadeSpeed: { label: "Fade Speed", type: "range", min: 0.5, max: 1, step: 0.01 },
  rippleShape: { label: "Shape", type: "select", options: ["circle","square","diamond"] },
  rippleMultiple: { label: "Multiple", type: "checkbox" },
  rippleDirection: { label: "Direction", type: "select", options: ["outward","inward"] },
  rippleBorderWidth: { label: "Border Width", type: "range", min: 0, max: 10, step: 1 },
  rippleText: { label: "Ripple Text", type: "text" },
  rippleTextColor: { label: "Text Color", type: "color" },
  rippleTextSize: { label: "Text Size", type: "range", min: 12, max: 120, step: 2 },
  rippleGlow: { label: "Glow", type: "checkbox" },
  cardHeight: { label: "Card Height", type: "range", min: 80, max: 400, step: 10 },
  cardColor: { label: "Card Color", type: "text" },
  cardWidth: { label: "Card Width", type: "range", min: 80, max: 400, step: 10 },
  snapStrength: { label: "Snap Strength", type: "range", min: 0, max: 1, step: 0.05 },
  maxSkew: { label: "Max Skew", type: "range", min: 1, max: 45, step: 1 },
  elasticity: { label: "Elasticity", type: "range", min: 0, max: 1, step: 0.05 },
  depth: { label: "Depth", type: "range", min: 0, max: 200, step: 5 },
  complexity: { label: "Complexity", type: "range", min: 1, max: 15, step: 1 },
  ringColor: { label: "Ring Color", type: "color" },
  ringSize: { label: "Ring Size", type: "range", min: 20, max: 200, step: 5 },
  ringWidth: { label: "Ring Width", type: "range", min: 1, max: 20, step: 1 },
  angle: { label: "Angle", type: "range", min: 0, max: 360, step: 5 },
  pattern: { label: "Pattern", type: "select", options: ["dots","grid","diagonal","hexagons","circles"] },
  patternColor: { label: "Pattern Color", type: "color" },
  patternSize: { label: "Pattern Size", type: "range", min: 5, max: 100, step: 5 },
  blur: { label: "Blur", type: "range", min: 0, max: 30, step: 1 },
  maxTilt: { label: "Max Tilt", type: "range", min: 1, max: 45, step: 1 },
  perspective: { label: "Perspective", type: "range", min: 200, max: 3000, step: 50 },
  barCount: { label: "Bar Count", type: "range", min: 4, max: 64, step: 2 },
  barColor: { label: "Bar Color", type: "color" },
  barWidth: { label: "Bar Width", type: "range", min: 2, max: 20, step: 1 },
  barGap: { label: "Bar Gap", type: "range", min: 0, max: 10, step: 1 },
  starCount: { label: "Stars", type: "range", min: 10, max: 500, step: 10 },
  connectionDistance: { label: "Connection Dist", type: "range", min: 20, max: 300, step: 10 },
  starColor: { label: "Star Color", type: "color" },
  lineColor: { label: "Line Color", type: "color" },
  ringCount: { label: "Ring Count", type: "range", min: 1, max: 10, step: 1 },
  ringColor: { label: "Ring Color", type: "color" },
  sensitivity: { label: "Sensitivity", type: "range", min: 0.01, max: 2, step: 0.05 },
  reflectionOpacity: { label: "Reflection Opacity", type: "range", min: 0, max: 1, step: 0.05 },
  lineWidth: { label: "Line Width", type: "range", min: 0.5, max: 5, step: 0.5 },
  lineOpacity: { label: "Line Opacity", type: "range", min: 0, max: 100, step: 5 },
  clothGravity: { label: "Cloth Gravity", type: "range", min: 0, max: 3, step: 0.1 },
  clothWind: { label: "Wind", type: "checkbox" },
  windStrength: { label: "Wind Force", type: "range", min: 0, max: 3, step: 0.1 },
  stiffness: { label: "Stiffness", type: "range", min: 0.1, max: 1, step: 0.05 },
  damping: { label: "Damping", type: "range", min: 0.1, max: 1, step: 0.05 },
  pinEdges: { label: "Pin Edges", type: "select", options: ["top","left","right","all","none"] },
  mouseTear: { label: "Mouse Tear", type: "checkbox" },
  tearForce: { label: "Tear Force", type: "range", min: 1, max: 30, step: 1 },
  useGradient: { label: "Gradient", type: "checkbox" },
  color2: { label: "Color 2", type: "color" },
  fieldLines: { label: "Field Lines", type: "checkbox" },
  fieldLineOpacity: { label: "Line Opacity", type: "range", min: 0, max: 100, step: 5 },
  fieldMode: { label: "Field Mode", type: "select", options: ["dipole","quadrupole","vortex","random"] },
  fieldStrength: { label: "Field Strength", type: "range", min: 0.01, max: 2, step: 0.01 },
  pendulumLength: { label: "Pendulum Length", type: "range", min: 20, max: 200, step: 5 },
  bobSize: { label: "Bob Size", type: "range", min: 2, max: 20, step: 1 },
  lineColor: { label: "Line Color", type: "color" },
  colorMode: { label: "Color Mode", type: "select", options: ["single","gradient","rainbow"] },
  showTrail: { label: "Show Trail", type: "checkbox" },
  trailLength: { label: "Trail Length", type: "range", min: 5, max: 100, step: 5 },
  layout: { label: "Layout", type: "select", options: ["bottom","center","top"] },
  bobShape: { label: "Bob Shape", type: "select", options: ["circle","square","diamond"] },
  glow: { label: "Glow", type: "checkbox" },
  waveMode: { label: "Wave Mode", type: "select", options: ["sine","cosine","random"] },
  spawnRate: { label: "Spawn Rate", type: "range", min: 0.1, max: 10, step: 0.1 },
  ballShape: { label: "Shape", type: "select", options: ["circle","square","triangle"] },
  ballColors: { label: "Colors", type: "text" },
  ballMinSize: { label: "Min Size", type: "range", min: 5, max: 50, step: 1 },
  ballMaxSize: { label: "Max Size", type: "range", min: 10, max: 100, step: 1 },
  maxBalls: { label: "Max Balls", type: "range", min: 5, max: 200, step: 5 },
  ballGlow: { label: "Glow", type: "checkbox" },
  friction: { label: "Friction", type: "range", min: 0.9, max: 1, step: 0.005 },
  ballStyle: { label: "Style", type: "select", options: ["solid","glass","hollow","gradient"] },
  spawnOnClick: { label: "Spawn on Click", type: "checkbox" },
  blackHoleSize: { label: "Hole Size", type: "range", min: 5, max: 100, step: 1 },
  eventHorizon: { label: "Event Horizon", type: "range", min: 10, max: 200, step: 5 },
  pullStrength: { label: "Pull Strength", type: "range", min: 0.01, max: 2, step: 0.01 },
  accretionColor: { label: "Accretion Color", type: "color" },
  accretionDisk: { label: "Accretion Disk", type: "checkbox" },
  diskOpacity: { label: "Disk Opacity", type: "range", min: 0, max: 100, step: 5 },
  jetEnabled: { label: "Jet", type: "checkbox" },
  jetColor: { label: "Jet Color", type: "color" },
  shapes: { label: "Shapes", type: "text", placeholder: "circle,square,triangle" },
  trailLength: { label: "Trail Length", type: "range", min: 5, max: 100, step: 1 },
  morphSpeed: { label: "Morph Speed (ms)", type: "range", min: 50, max: 2000, step: 50 },
  shapeOrder: { label: "Order", type: "select", options: ["sequential","random"] },
  shapeScale: { label: "Scale", type: "range", min: 0.1, max: 3, step: 0.1 },
  shapeEasing: { label: "Easing", type: "select", options: ["ease-out","ease-in","linear","spring"] },
  trailFade: { label: "Trail Fade", type: "checkbox" },
  trailGlow: { label: "Trail Glow", type: "checkbox" },
  trailBlur: { label: "Trail Blur", type: "checkbox" },
  autonomousMode: { label: "Autonomous", type: "checkbox" },
  rotationSpeed: { label: "Rotation Speed", type: "range", min: 0.1, max: 10, step: 0.1 },
  particleSpacing: { label: "Spacing", type: "range", min: 1, max: 20, step: 1 },
  colorMode: { label: "Color Mode", type: "select", options: ["palette","gradient","rainbow"] },
  velocityStretch: { label: "Velocity Stretch", type: "checkbox" },
  letterSpacingAnim: { label: "Letter Spacing Anim", type: "checkbox" },
  magneticEasing: { label: "Easing", type: "select", options: ["ease-out","ease-in-out","spring"] },
  magneticReturn: { label: "Return", type: "checkbox" },
  textGlow: { label: "Text Glow", type: "checkbox" },
  glowBlur: { label: "Glow Blur", type: "range", min: 1, max: 30, step: 1 },
  distortionType: { label: "Type", type: "select", options: ["lens","ripple","swirl","pinch"] },
  distortionShape: { label: "Shape", type: "select", options: ["circle","square","triangle"] },
  distortionInvert: { label: "Invert", type: "checkbox" },
  distortionChromatic: { label: "Chromatic", type: "checkbox" },
  distortionOverlay: { label: "Overlay", type: "checkbox" },
  overlayColor: { label: "Overlay Color", type: "color" },
  overlayOpacity: { label: "Overlay Opacity", type: "range", min: 0, max: 100, step: 5 },
  imageFilter: { label: "Image Filter", type: "select", options: ["none","grayscale","sepia","invert","blur"] },
  sampleSize: { label: "Sample Size", type: "range", min: 2, max: 30, step: 1 },
  paletteSize: { label: "Palette Size", type: "range", min: 2, max: 10, step: 1 },
  showGrid: { label: "Show Grid", type: "checkbox" },
  gridCols: { label: "Grid Columns", type: "range", min: 1, max: 8, step: 1 },
  gridRows: { label: "Grid Rows", type: "range", min: 1, max: 6, step: 1 },
  swatchBorderRadius: { label: "Swatch Radius", type: "range", min: 0, max: 20, step: 1 },
  samplerMode: { label: "Mode", type: "select", options: ["hover","click"] },
  colorFormat: { label: "Format", type: "select", options: ["hex","rgb","hsl"] },
  swatchAnimation: { label: "Animation", type: "select", options: ["none","pop","fade","slide"] },
  gravityStrength: { label: "Gravity Strength", type: "range", min: 0.01, max: 2, step: 0.01 },
  rotationSpeed: { label: "Rotation Speed", type: "range", min: 0.1, max: 5, step: 0.1 },
  cards: { label: "Cards (JSON)", type: "text" },
  roomCount: { label: "Room Count", type: "range", min: 1, max: 6, step: 1 },
  roomLabels: { label: "Labels", type: "text" },
  perspective: { label: "Perspective", type: "range", min: 200, max: 3000, step: 50 },
  islandCount: { label: "Islands", type: "range", min: 1, max: 10, step: 1 },
  floatRange: { label: "Float Range", type: "range", min: 5, max: 80, step: 5 },
  islandLabels: { label: "Island Labels", type: "text" },
  depthIntensity: { label: "Depth", type: "range", min: 0, max: 2, step: 0.05 },
  responseRadius: { label: "Response Radius", type: "range", min: 20, max: 300, step: 10 },
  repulseStrength: { label: "Repulse Strength", type: "range", min: 10, max: 200, step: 5 },
  accentColor: { label: "Accent Color", type: "color" },
  itemSize: { label: "Item Size", type: "range", min: 20, max: 200, step: 5 },
  itemCount: { label: "Item Count", type: "range", min: 2, max: 12, step: 1 },
  cycleSpeed: { label: "Cycle Speed", type: "range", min: 0.5, max: 10, step: 0.5 },
  transitionDuration: { label: "Transition (s)", type: "range", min: 0.1, max: 2, step: 0.1 },
  itemBg: { label: "Item Background", type: "text" },
  autoCycle: { label: "Auto Cycle", type: "checkbox" },
  itemLabels: { label: "Labels", type: "text" },
  navItems: { label: "Nav Items", type: "text" },
  spacing: { label: "Spacing", type: "range", min: 20, max: 200, step: 5 },
  shaderType: { label: "Shader", type: "select", options: ["noise","plasma","waves","aurora"] },
  gridSize: { label: "Grid Size", type: "range", min: 10, max: 100, step: 5 },
  gridColor: { label: "Grid Color", type: "text" },
  scrollStrength: { label: "Scroll Strength", type: "range", min: 0.1, max: 2, step: 0.05 },
  cursorStrength: { label: "Cursor Strength", type: "range", min: 0, max: 2, step: 0.05 },
  decay: { label: "Decay", type: "range", min: 0.9, max: 1, step: 0.005 },
  resolution: { label: "Resolution", type: "range", min: 64, max: 512, step: 64 },
  viscosityPreset: { label: "Viscosity", type: "select", options: ["water","oil","honey","tar"] },
  scrollSensitivity: { label: "Scroll Sensitivity", type: "range", min: 0.1, max: 5, step: 0.1 },
  flowAngle: { label: "Flow Angle", type: "range", min: 0, max: 360, step: 5 },
  chaosEnabled: { label: "Chaos", type: "checkbox" },
  chaosFrequency: { label: "Chaos Freq", type: "range", min: 0.1, max: 10, step: 0.1 },
  snap: { label: "Snap", type: "checkbox" },
  momentum: { label: "Momentum", type: "checkbox" },
  items: { label: "Items", type: "text" },
  nebulaColors: { label: "Colors", type: "text" },
  patternType: { label: "Pattern", type: "select", options: ["hexagons","triangles","circles","squares","diamonds","lines"] },
  cellSize: { label: "Cell Size", type: "range", min: 10, max: 100, step: 5 },
  strokeWidth: { label: "Stroke Width", type: "range", min: 0.5, max: 5, step: 0.5 },
  filled: { label: "Filled", type: "checkbox" },
  flowSpeed: { label: "Flow Speed", type: "range", min: 0.01, max: 3, step: 0.01 },
  turbulence: { label: "Turbulence", type: "range", min: 0, max: 2, step: 0.05 },
  tool: { label: "Tool", type: "select", options: ["line","circle","rect","arc"] },
  leakColor: { label: "Leak Color", type: "color" },
  direction: { label: "Direction", type: "select", options: ["top-left","top-right","bottom-left","bottom-right"] },
  shimmerColor: { label: "Shimmer Color", type: "color" },
  particleRandomColor: { label: "Random Colors", type: "checkbox" },
  wellGlow: { label: "Well Glow", type: "checkbox" },
  colorMode: { label: "Color Mode", type: "select", options: ["single","gradient","rainbow","palette"] },
  lineColor: { label: "Line Color", type: "color" },
  copyOnHover: { label: "Copy on Hover", type: "checkbox" },
  palettePosition: { label: "Palette Position", type: "select", options: ["bottom","top","left","right"] },
  paletteBgOpacity: { label: "Palette Opacity", type: "range", min: 0, max: 100, step: 5 },
  swatchGap: { label: "Swatch Gap", type: "range", min: 1, max: 10, step: 1 },
  // Non-Veltro widget properties
  size: { label: "Size", type: "range", min: 12, max: 200, step: 2 },
  icon: { label: "Icon", type: "text", placeholder: "\u2605" },
  title: { label: "Title", type: "text" },
  desc: { label: "Description", type: "text" },
  description: { label: "Description", type: "text", placeholder: "Short description..." },
  html: { label: "HTML", type: "text", placeholder: "<p>Your HTML here</p>" },
  shortcode: { label: "Shortcode", type: "text", placeholder: "[your_shortcode]" },
  quote: { label: "Quote", type: "text", placeholder: "Enter quote..." },
  attribution: { label: "Attribution", type: "text", placeholder: "Author name" },
  url: { label: "URL", type: "text", placeholder: "https://..." },
  src: { label: "Source URL", type: "text", placeholder: "https://..." },
  alt: { label: "Alt Text", type: "text" },
  controls: { label: "Show Controls", type: "checkbox" },
  autoplay: { label: "Autoplay", type: "checkbox" },
  aspectRatio: { label: "Aspect Ratio", type: "select", options: ["56.25%", "75%", "100%", "177.78%"] },
  address: { label: "Address", type: "text", placeholder: "London, UK" },
  zoom: { label: "Zoom", type: "range", min: 1, max: 20, step: 1 },
  code: { label: "Code", type: "text", placeholder: "console.log('Hello');" },
  language: { label: "Language", type: "text", placeholder: "JavaScript" },
  number: { label: "Number", type: "number" },
  date: { label: "Date", type: "text", placeholder: "2027-01-01" },
  beforeText: { label: "Before Text", type: "text" },
  afterText: { label: "After Text", type: "text" },
  featured: { label: "Featured", type: "checkbox" },
  badgeText: { label: "Badge Text", type: "text" },
  price: { label: "Price", type: "text", placeholder: "19" },
  period: { label: "Period", type: "text", placeholder: "/mo" },
  currency: { label: "Currency", type: "text", placeholder: "$" },
  features: { label: "Features", type: "text", placeholder: "Feature 1, Feature 2, ..." },
  type: { label: "Type", type: "select", options: ["info", "success", "warning", "error"] },
  dismissible: { label: "Dismissible", type: "checkbox" },
  frontTitle: { label: "Front Title", type: "text" },
  frontDesc: { label: "Front Description", type: "text" },
  backTitle: { label: "Back Title", type: "text" },
  backDesc: { label: "Back Description", type: "text" },
  btnText: { label: "Button Text", type: "text", placeholder: "Click Me" },
  cta: { label: "CTA Text", type: "text", placeholder: "Get Started" },
  active: { label: "Active Index", type: "range", min: 0, max: 20, step: 1 },
  activeTab: { label: "Active Tab", type: "range", min: 0, max: 10, step: 1 },
  caption: { label: "Caption", type: "text" },
  minHeight: { label: "Min Height", type: "range", min: 100, max: 1200, step: 10 },
  contentMaxWidth: { label: "Max Width", type: "range", min: 400, max: 2000, step: 10 },
  contentMaxWidthEnabled: { label: "Constrain Width", type: "checkbox" },
  overlayColor: { label: "Overlay Color", type: "color" },
  overlayOpacity: { label: "Overlay Opacity", type: "range", min: 0, max: 1, step: 0.05 },
  // Critical: properties that would render as broken text inputs
  style: { label: "Style", type: "select", options: ["solid","dashed","dotted","double","groove","ridge"] },
  shape: { label: "Shape", type: "select", options: ["circle","square","rounded"] },
  gravityMode: { label: "Gravity Mode", type: "select", options: ["attract","repel"] },
  splitBy: { label: "Split By", type: "select", options: ["none","char","word","line"] },
  charAnimation: { label: "Char Animation", type: "select", options: ["none","fadeIn","slideUp","scaleIn","rotateIn","bounceIn"] },
  maskPosition: { label: "Mask Position", type: "select", options: ["center","top","bottom","left","right"] },
  maskRepeat: { label: "Mask Repeat", type: "select", options: ["no-repeat","repeat","repeat-x","repeat-y"] },
  sectionCount: { label: "Section Count", type: "range", min: 1, max: 20, step: 1 },
  // Moderate: multi-widget usage, textarea for long content, selects for patterns
  columns: { label: "Columns", type: "range", min: 1, max: 8, step: 1 },
  width: { label: "Width", type: "range", min: 1, max: 100, step: 1 },
  animData: { label: "Animation Data", type: "text", placeholder: "{}" },
  col1Content: { label: "Col 1 Content", type: "text", placeholder: "Long text..." },
  col3Content: { label: "Col 3 Content", type: "text", placeholder: "Long text..." },
  bgColor: { label: "BG Color", type: "color" },
  bgSize: { label: "BG Size", type: "select", options: ["cover","contain","auto","100% auto"] },
  bgPosition: { label: "BG Position", type: "select", options: ["center center","top center","bottom center","left center","right center","top left","top right","bottom left","bottom right"] },
  columnLayout: { label: "Column Layout", type: "text", placeholder: "1fr 1fr" },
  revealDelay: { label: "Reveal Delay (ms)", type: "range", min: 0, max: 5000, step: 100 },
  delay: { label: "Delay (ms)", type: "range", min: 0, max: 10000, step: 100 },
  current: { label: "Current", type: "range", min: 0, max: 20, step: 1 },
  shapeOpacity: { label: "Opacity", type: "range", min: 0, max: 100, step: 5 },
  maskOpacity: { label: "Mask Opacity", type: "range", min: 0, max: 100, step: 5 },
  weight: { label: "Weight", type: "range", min: 100, max: 900, step: 100 },
  particleFriction: { label: "Friction", type: "range", min: 0.9, max: 1, step: 0.005 },
  particleSpread: { label: "Spread", type: "range", min: 0, max: 5, step: 0.1 },
  particleBounce: { label: "Bounce", type: "checkbox" },
  charAnimationSpeed: { label: "Anim Speed", type: "range", min: 0.1, max: 3, step: 0.1 },
  shapeRotation: { label: "Rotation", type: "range", min: 0, max: 360, step: 5 },
  elementLabels: { label: "Labels", type: "text" },
  cardBg: { label: "Card BG", type: "color" },
  columnGap: { label: "Column Gap", type: "range", min: 0, max: 60, step: 2 },
  gradientAngle: { label: "Gradient Angle", type: "range", min: 0, max: 360, step: 5 },
  gradientColor1: { label: "Gradient Color 1", type: "color" },
  gradientColor2: { label: "Gradient Color 2", type: "color" },
  videoUrl: { label: "Video URL", type: "text", placeholder: "https://..." },
  layerCount: { label: "Layers", type: "range", min: 1, max: 10, step: 1 },
  blurAmount: { label: "Blur", type: "range", min: 0, max: 20, step: 1 },
  col1Title: { label: "Col 1 Title", type: "text" },
  col2Title: { label: "Col 2 Title", type: "text" },
  col3Title: { label: "Col 3 Title", type: "text" },
  col4Title: { label: "Col 4 Title", type: "text" },
  col2Links: { label: "Col 2 Links", type: "text", placeholder: "Link 1, Link 2, ..." },
  col4Links: { label: "Col 4 Links", type: "text", placeholder: "Link 1, Link 2, ..." },
  copyright: { label: "Copyright", type: "text", placeholder: "\u00A9 2026" },
  networks: { label: "Networks", type: "text", placeholder: "Twitter, Facebook, LinkedIn" },
  captions: { label: "Captions", type: "text", placeholder: "Caption 1, Caption 2, ..." },
  label: { label: "Label", type: "text" },
  textShadowOffsetX: { label: "Shadow X", type: "range", min: -20, max: 20, step: 1 },
  textShadowOffsetY: { label: "Shadow Y", type: "range", min: -20, max: 20, step: 1 },
  elementColor: { label: "Element Color", type: "color" },
  layers: { label: "Layers", type: "range", min: 1, max: 20, step: 1 },
  // New properties for Perspective Rooms and 3D Carousel
  perspective: { label: "Perspective", type: "range", min: 200, max: 3000, step: 50 },
  roomCount: { label: "Room Count", type: "range", min: 1, max: 6, step: 1 },
  autoRotate: { label: "Auto Rotate", type: "checkbox" },
  autoRotateInterval: { label: "Rotate Interval (ms)", type: "range", min: 2000, max: 15000, step: 1000 },
  highlightColor: { label: "Highlight Color", type: "color" },
  rooms: { label: "Rooms", type: "array" },
  cards: { label: "Cards", type: "array" },
  cardScale: { label: "Card Scale", type: "range", min: 0.8, max: 1.5, step: 0.1 },
  clickableCards: { label: "Clickable Cards", type: "checkbox" },
  showCardNumbers: { label: "Show Card Numbers", type: "checkbox" },
  rotationSpeed: { label: "Rotation Speed", type: "range", min: 0.01, max: 5, step: 0.01 },
  // Room/Card sub-properties
  title: { label: "Title", type: "text" },
  subtitle: { label: "Subtitle", type: "text" },
  description: { label: "Description", type: "text" },
  bgColor: { label: "Background Color", type: "color" },
  bgImage: { label: "Background Image URL", type: "text" },
  imageOpacity: { label: "Image Opacity", type: "range", min: 0, max: 1, step: 0.05 },
  navLabel: { label: "Navigation Label", type: "text" },
  cta: { label: "Call-to-Action", type: "text" },
  link: { label: "Link URL", type: "text" },
  linkText: { label: "Link Text", type: "text" },
  imagePosition: { label: "Image Position", type: "select", options: ["top","background","left"] },
  // Additional image properties for imageBox and enhanced content widgets
  thumbnail: { label: "Thumbnail Image URL", type: "text" },
  showThumbnail: { label: "Show Thumbnail", type: "checkbox" },
  thumbnailBorderRadius: { label: "Thumbnail Radius", type: "range", min: 0, max: 50, step: 1 },
  titleFontSize: { label: "Title Font Size", type: "range", min: 12, max: 48, step: 2 },
  descFontSize: { label: "Description Font Size", type: "range", min: 12, max: 32, step: 2 },
  overlayBgColor: { label: "Overlay Background Color", type: "color" },
  useImage: { label: "Use Image Instead of Icon", type: "checkbox" },
  imageMarginBottom: { label: "Image Margin Bottom", type: "range", min: 0, max: 30, step: 2 },
  // Portfolio and gallery card properties
  items: { label: "Portfolio Items", type: "array" },
  slides: { label: "Slides", type: "array" },
  tag: { label: "Tag", type: "text" },
  bgImage: { label: "Background Image", type: "text" },
  cta: { label: "Call-to-Action Text", type: "text" },

  // NEW: Image properties for block widgets
  heroImage: { label: "Hero Background Image", type: "text" },
  featureImageSize: { label: "Feature Image Size", type: "range", min: 40, max: 200, step: 10 },
  featureImageRadius: { label: "Feature Image Radius", type: "range", min: 0, max: 50, step: 1 },
  pricingImageSize: { label: "Pricing Image Size", type: "range", min: 80, max: 300, step: 10 },
  pricingImageRadius: { label: "Pricing Image Radius", type: "range", min: 0, max: 50, step: 1 },
}

// Style presets for Advanced Settings - pre-built theme combinations
FB.widgets.presets = {
  global: {
    "Clean Minimal": {
      label: "Clean Minimal - Simple, spacious, modern",
      properties: {
        _opacity: 1,
        _bgAlpha: 1,
        _paddingH: 24,
        _paddingV: 16,
        _borderRadius: 4,
        _borderWidth: 0,
        _bgColor: "#ffffff",
        _textColor: "#111111",
        _boxShadow: "none"
      }
    },
    "Dark Bold": {
      label: "Dark Bold - High contrast, dramatic",
      properties: {
        _opacity: 1,
        _bgAlpha: 1,
        _paddingH: 32,
        _paddingV: 24,
        _borderRadius: 8,
        _borderWidth: 2,
        _borderColor: "#ffffff",
        _bgColor: "#1a1a1a",
        _textColor: "#ffffff",
        _boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
      }
    },
    "Soft Glow": {
      label: "Soft Glow - Subtle, approachable, warm",
      properties: {
        _opacity: 0.95,
        _bgAlpha: 0.98,
        _paddingH: 20,
        _paddingV: 16,
        _borderRadius: 12,
        _borderWidth: 1,
        _borderColor: "rgba(200,200,200,0.4)",
        _bgColor: "#fafafa",
        _textColor: "#333333",
        _boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
      }
    },
    "Vibrant Modern": {
      label: "Vibrant Modern - Bold colors, contemporary",
      properties: {
        _opacity: 1,
        _bgAlpha: 1,
        _paddingH: 28,
        _paddingV: 20,
        _borderRadius: 6,
        _borderWidth: 0,
        _bgColor: "#0d0d1a",
        _textColor: "#cdfe00",
        _boxShadow: "0 4px 20px rgba(205,254,0,0.2)"
      }
    },
    "Professional": {
      label: "Professional - Corporate, clean",
      properties: {
        _opacity: 1,
        _bgAlpha: 0.99,
        _paddingH: 26,
        _paddingV: 18,
        _borderRadius: 3,
        _borderWidth: 1,
        _borderColor: "#e0e0e0",
        _bgColor: "#f5f5f5",
        _textColor: "#222222",
        _boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }
    }
  },
  perspectiveRooms: {
    "Portfolio Gallery": {
      label: "Portfolio Gallery - Showcase projects",
      properties: {
        autoRotate: false,
        height: 600,
        highlightColor: "#cdfe00"
      }
    },
    "Auto-Rotating Showcase": {
      label: "Auto-Rotating - Continuous rotation",
      properties: {
        autoRotate: true,
        autoRotateInterval: 5000,
        height: 500,
        highlightColor: "#4a90e2"
      }
    }
  },
  carousel3d: {
    "Product Showcase": {
      label: "Product Showcase - Feature your items",
      properties: {
        autoRotate: false,
        clickableCards: true,
        showCardNumbers: true,
        cardScale: 1.1
      }
    },
    "Auto-Play": {
      label: "Auto-Play - Continuous rotation",
      properties: {
        autoRotate: true,
        clickableCards: true,
        showCardNumbers: false,
        cardScale: 1.0
      }
    }
  }
};

// Property tooltips - plain-English explanations for users
FB.widgets._propTooltips = {
  // Opacity and transparency
  _opacity: "Controls how see-through the element is (0 = invisible, 1 = fully visible)",
  _bgAlpha: "How transparent the background color is (0 = invisible, 1 = solid)",

  // Spacing
  _paddingH: "Space inside the element, left and right (increases width of internal area)",
  _paddingV: "Space inside the element, top and bottom (increases height of internal area)",
  _marginH: "Space outside the element, left and right (creates gap from neighbors)",
  _marginV: "Space outside the element, top and bottom (creates gap from neighbors)",

  // Colors
  _bgColor: "Background color of the element",
  _textColor: "Color of text inside this element",
  _borderColor: "Color of the border outline",

  // Borders and corners
  _borderRadius: "Roundness of corners (0 = sharp right angles, higher = rounder corners)",
  _borderWidth: "Thickness of the border outline (0 = no border)",
  _borderStyle: "Border line style (solid, dashed, dotted, etc.)",

  // Shadows
  _boxShadow: "Drop shadow effect around the element",
  _filter: "Advanced visual effects (blur, brightness, contrast, hue-rotate, etc.)",

  // Transform and effects
  _transform: "Advanced: Rotate, scale, or skew the element",
  _transition: "Advanced: Animation time when properties change",
  _visibility: "Show or hide the element (hidden elements still take up space)",

  // Advanced CSS
  _customClass: "Advanced: Add custom CSS class names for additional styling",
  _customId: "Advanced: Assign a unique ID for scripting or linking",
  _dataAttrs: "Advanced: Custom data attributes for JavaScript interaction",

  // Animation
  _animationType: "Select animation effect (fade, slide, bounce, etc.)",
  _animDuration: "How long the animation takes in milliseconds",
  _animDelay: "Wait time before animation starts in milliseconds",
  _animEasing: "Speed curve (ease-out feels natural, linear feels constant)",

  // Hover effects
  _hoverEffect: "Visual effect when user hovers over element (scale, glow, color change)",
  _hoverScale: "How much to enlarge on hover (1 = no change, 1.1 = 10% larger)",
  _hoverTransition: "How smooth the hover effect transitions",

  // Layout
  _height: "Height of the element in pixels",
  _width: "Width of the element in pixels (can be percentage like 100%)",
  _minHeight: "Minimum height the element must maintain",
  _maxWidth: "Maximum width the element can grow to",

  // Responsive
  _hideOnMobile: "Hide this element on mobile phones (under 768px)",
  _hideOnTablet: "Hide this element on tablets (768px-1024px)",
  _hideOnDesktop: "Hide this element on desktop (over 1024px)",

  // Accessibility
  _screenReaderHidden: "Hides element from screen readers (for purely decorative elements)",
  _ariaLabel: "Advanced: Text label for screen readers",
  _ariaRole: "Advanced: Semantic role for assistive technologies",

  // Performance
  _lazyLoad: "Wait to load this element until user scrolls to it",
  _preload: "Load this element early (before user sees it)",

  // Widget-specific
  rooms: "Array of room objects for Perspective Rooms widget",
  cards: "Array of card objects for 3D Carousel widget",
  autoRotate: "Automatically cycle through rooms/cards (true = enabled)",
  autoRotateInterval: "Time between rotations in milliseconds (2000 = 2 seconds)",
  highlightColor: "Color of the active navigation indicator",
  clickableCards: "Make cards clickable to navigate to links (for carousel)",
  showCardNumbers: "Display card index like '1/6' on carousel cards",
  cardScale: "Size of the front card compared to others (1.1 = 10% larger)",
  perspective: "3D depth effect (lower = more exaggerated, higher = more flat)",

  // Room/Card sub-properties
  title: "Main heading text",
  subtitle: "Secondary heading text (smaller than title)",
  description: "Longer descriptive text",
  bgImage: "URL to a background image for this room/card",
  imageOpacity: "How transparent the background image is (0 = invisible, 1 = fully visible)",
  navLabel: "Text shown on the navigation button",
  cta: "Call-to-action text for a button",
  link: "URL to navigate to when clicked",
  linkText: "Text shown on the link button",
  imagePosition: "Where to place image (top = above content, background = behind content, left = beside content)"
};

FB.widgets._propOrder = [
  "text","words","overlayText","navItems","label","headline","subtext","body",
  "value","prefix","suffix","tag","mode","itemLabels","islandLabels","roomLabels",
  "image","imageUrl","images","items","cards","slides","captions",
  "color","textColor","accentColor","bg","bgColor","color1","color2","colors","nebulaColors",
  "fontSize","fontWeight","fontFamily","letterSpacing","lineHeight","textAlign","align","textTransform",
  "height","width","speed","amplitude","frequency","intensity","duration","delay",
  "particleCount","particleSize","particleColor","elementCount","cardCount","layerCount","count",
  "rows","cols","columns","gap","itemSize","cardWidth","cardHeight",
  "borderRadius","borderWidth","borderColor",
  "magneticRadius","magneticStrength","distortionRadius","distortionStrength",
  "lensSize","magnification",
  "gravity","gravityMode","restitution","wellStrength","wellCount","wellRadius","wellMode",
  "maskOpacity","maskPosition","maskRepeat",
  "particleTrail","particleGlow","glowEffect","glowSize","dualColour","gradientText",
  "textShadow","autoScramble","revealTrigger","decodeTrigger","revealDelay",
  "cursor","loop","showCursor","elasticBounce","mouseInteraction","physicsEnabled",
  "autoCycle","snap","momentum","spawnOnClick","fieldLines","showTrail",
  "glow","textGlow","ballGlow","wellGlow","particleRandomColor",
  "waveType","waveDirection","morphDirection","morphSpeed","cipherStyle","cursorStyle",
  "shape","style","splitBy","charAnimation","current","weight"
];

FB.widgets.generateEditPanel = function (type, blockId, props) {
  var def = FB.widgets.get(type);
  if (!def || !def.defaultProps) return "";

  var defaults = def.defaultProps;
  var html = "";
  var used = {};

  var orderedKeys = FB.widgets._propOrder.filter(function(k) {
    return defaults.hasOwnProperty(k);
  });

  var remainingKeys = Object.keys(defaults).filter(function(k) {
    return FB.widgets._propOrder.indexOf(k) === -1 && FB.widgets._skipProps.indexOf(k) === -1;
  }).sort();

  var allKeys = orderedKeys.concat(remainingKeys);

  allKeys.forEach(function(key) {
    if (FB.widgets._skipProps.indexOf(key) !== -1) return;
    if (used[key]) return;
    used[key] = true;

    var val = props[key] !== undefined ? props[key] : defaults[key];
    var meta = FB.widgets._propMeta[key];
    var fieldId = type + "_" + key;

    // Handle array types separately with custom array editor
    if (meta && meta.type === "array") {
      html += FB.panels.renderArrayEditor(blockId, key, val, type);
      return;
    }

    html += '<div class="rp-row">';

    if (meta && meta.type === "color") {
      var normalizedColor = FB.widgets.normalizeColorForInput(val);
      html += '<label for="' + fieldId + '">' + meta.label + '</label>' +
        '<input id="' + fieldId + '" name="' + fieldId + '" type="color" value="' + normalizedColor + '" data-prop="' + key + '" data-block-id="' + blockId + '" style="width:48px;height:28px;padding:0;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent">';
    } else if (meta && meta.type === "checkbox") {
      html += '<label for="' + fieldId + '" style="display:flex;align-items:center;gap:6px;cursor:pointer">' +
        '<input id="' + fieldId + '" name="' + fieldId + '" type="checkbox"' + (val ? " checked" : "") + ' data-prop="' + key + '" data-type="checkbox" data-block-id="' + blockId + '" style="accent-color:var(--accent)">' +
        '<span>' + meta.label + '</span></label>';
    } else if (meta && meta.type === "select") {
      html += '<label for="' + fieldId + '">' + meta.label + '</label>' +
        '<select id="' + fieldId + '" name="' + fieldId + '" data-prop="' + key + '" data-block-id="' + blockId + '">';
      if (meta.options && Array.isArray(meta.options)) {
        meta.options.forEach(function(opt) {
          html += '<option value="' + opt + '"' + (val === opt ? " selected" : "") + '>' + opt + '</option>';
        });
      }
      html += '</select>';
    } else if (meta && meta.type === "range") {
      var displayVal = typeof val === "number" ? (Number.isInteger(val) ? val : val.toFixed(2)) : val;
      html += '<label id="' + fieldId + '_label" for="' + fieldId + '">' + meta.label + ': ' + displayVal + '</label>' +
        '<input id="' + fieldId + '" name="' + fieldId + '" type="range" min="' + meta.min + '" max="' + meta.max + '" step="' + meta.step + '" value="' + val + '" data-prop="' + key + '" data-type="number" data-label-id="' + fieldId + '_label" data-label-prefix="' + meta.label + ': " data-block-id="' + blockId + '">';
    } else if (meta && meta.type === "number") {
      html += '<label for="' + fieldId + '">' + meta.label + '</label>' +
        '<input id="' + fieldId + '" name="' + fieldId + '" type="number" value="' + val + '" data-prop="' + key + '" data-type="number" data-block-id="' + blockId + '">';
    } else if (meta && meta.type === "text") {
      var ph = meta.placeholder || "";
      var isLong = typeof val === "string" && (val.indexOf("http") === 0 || val.length > 60 || val.indexOf(",") !== -1);
      if (isLong) {
        html += '<label for="' + fieldId + '">' + meta.label + '</label>' +
          '<textarea id="' + fieldId + '" name="' + fieldId + '" rows="2" data-prop="' + key + '" data-block-id="' + blockId + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '>' + val + '</textarea>';
      } else {
        html += '<label for="' + fieldId + '">' + meta.label + '</label>' +
          '<input id="' + fieldId + '" name="' + fieldId + '" type="text" value="' + val + '" data-prop="' + key + '" data-block-id="' + blockId + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '>';
      }
    } else {
      var inferredType = typeof val;
      if (inferredType === "boolean") {
        html += '<label for="' + fieldId + '" style="display:flex;align-items:center;gap:6px;cursor:pointer">' +
          '<input id="' + fieldId + '" name="' + fieldId + '" type="checkbox"' + (val ? " checked" : "") + ' data-prop="' + key + '" data-type="checkbox" data-block-id="' + blockId + '" style="accent-color:var(--accent)">' +
          '<span>' + key + '</span></label>';
      } else if (inferredType === "number") {
        var step = Number.isInteger(val) ? 1 : 0.01;
        var min = 0;
        var max = Math.max(val * 3, 10);
        var displayVal = Number.isInteger(val) ? val : val.toFixed(2);
        html += '<label id="' + fieldId + '_label" for="' + fieldId + '">' + key + ': ' + displayVal + '</label>' +
          '<input id="' + fieldId + '" name="' + fieldId + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-prop="' + key + '" data-type="number" data-label-id="' + fieldId + '_label" data-label-prefix="' + key + ': " data-block-id="' + blockId + '">';
      } else if (typeof val === "string" && val.indexOf("#") === 0 && val.length <= 9) {
        var normalizedColorVal = FB.widgets.normalizeColorForInput(val);
        html += '<label for="' + fieldId + '">' + key + '</label>' +
          '<input id="' + fieldId + '" name="' + fieldId + '" type="color" value="' + normalizedColorVal + '" data-prop="' + key + '" data-block-id="' + blockId + '" style="width:48px;height:28px;padding:0;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent">';
      } else if (Array.isArray(val)) {
        var hasObjects = val.some(function(v) { return typeof v === "object" && v !== null; });
        if (hasObjects) {
          var jsonStr = JSON.stringify(val, null, 2);
          html += '<label for="' + fieldId + '">' + key + '</label>' +
            '<textarea id="' + fieldId + '" name="' + fieldId + '" rows="4" data-prop="' + key + '" data-type="json" data-block-id="' + blockId + '">' + jsonStr + '</textarea>';
        } else {
          var strVal = val.join("\n");
          html += '<label for="' + fieldId + '">' + key + '</label>' +
            '<textarea id="' + fieldId + '" name="' + fieldId + '" rows="' + Math.min(val.length + 1, 6) + '" data-prop="' + key + '" data-type="multiline-array" data-block-id="' + blockId + '">' + strVal + '</textarea>';
        }
      } else if (typeof val === "object" && val !== null) {
        var jsonStr = JSON.stringify(val);
        html += '<label for="' + fieldId + '">' + key + '</label>' +
          '<textarea id="' + fieldId + '" name="' + fieldId + '" rows="2" data-prop="' + key + '" data-type="json" data-block-id="' + blockId + '">' + jsonStr + '</textarea>';
      } else {
        html += '<label for="' + fieldId + '">' + key + '</label>' +
          '<input id="' + fieldId + '" name="' + fieldId + '" type="text" value="' + (val || "") + '" data-prop="' + key + '" data-block-id="' + blockId + '">';
      }
    }

    html += '</div>';
  });

  return html;
};

FB.widgets.getEditPanel = function (type, blockId, props) {
  var def = FB.widgets.get(type);
  if (!def) return "";
  var custom = def.editPanel(blockId, props);
  if (custom) return custom;
  return FB.widgets.generateEditPanel(type, blockId, props);
};

FB.widgets.categories = function () {
  var cats = {};
  Object.keys(FB.widgets._registry).forEach(function (type) {
    var entry = FB.widgets._registry[type];
    if (entry && entry.category) cats[entry.category] = true;
  });
  return Object.keys(cats);
};

FB.widgets.byCategory = function (cat) {
  var result = {};
  Object.keys(FB.widgets._registry).forEach(function (type) {
    var entry = FB.widgets._registry[type];
    if (entry && entry.category === cat) {
      result[type] = entry;
    }
  });
  return result;
};