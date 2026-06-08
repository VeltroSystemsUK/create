import express from 'express';

const router = express.Router();

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function svgForPrompt(prompt) {
  const text = esc(prompt || 'Veltro Create');
  const lower = String(prompt || '').toLowerCase();
  const isLogo = lower.includes('logo') || lower.includes('brand') || lower.includes('icon');
  const isPattern = lower.includes('pattern') || lower.includes('background') || lower.includes('texture');
  const accent = isLogo ? '#cdfe00' : isPattern ? '#38bdf8' : '#ec4899';
  const secondary = isLogo ? '#7c3aed' : '#cdfe00';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#09090b"/>
      <stop offset="0.55" stop-color="#171717"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="800" height="520" rx="32" fill="url(#bg)"/>
  <circle cx="400" cy="250" r="230" fill="url(#glow)"/>
  <g opacity="0.86">
    <path d="M142 320 C210 160 326 110 450 160 C550 200 604 304 686 212" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
    <path d="M116 240 C230 288 314 272 402 222 C514 158 596 154 696 246" fill="none" stroke="${secondary}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    <circle cx="210" cy="184" r="38" fill="${secondary}" opacity="0.88"/>
    <circle cx="594" cy="326" r="52" fill="${accent}" opacity="0.72"/>
    <rect x="308" y="158" width="184" height="184" rx="46" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.28)"/>
  </g>
  <text x="400" y="424" text-anchor="middle" font-family="Lexend, Inter, Arial, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${text.slice(0, 44)}</text>
  <text x="400" y="458" text-anchor="middle" font-family="Lexend, Inter, Arial, sans-serif" font-size="15" fill="#cbd5e1">Generated in Veltro Create</text>
</svg>`.trim();
}

router.post('/', (req, res) => {
  const prompt = String(req.body?.prompt || '').trim();
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  const svg = svgForPrompt(prompt);
  const url = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  res.json({ url, svg });
});

export default router;
