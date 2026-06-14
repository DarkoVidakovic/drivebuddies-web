// Generate branded 1200×630 Open Graph images per site section.
// Run: node scripts/gen-og.mjs
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url).pathname;
const OUT = ROOT + 'public/og/';
mkdirSync(OUT, { recursive: true });

const PRIMARY = '#2a4cd5';
const PRIMARY_DARK = '#223eaf';

// Sections: filename → { eyebrow, title }
const sections = {
  home: { eyebrow: 'Fahrschule in Zürich · Driving School', title: 'Modern. Flexibel. Persönlich.' },
  services: { eyebrow: 'Dienstleistungen · Services', title: 'Auto · Motorrad · Anhänger' },
  courses: { eyebrow: 'Kurse & Ausbildung', title: 'Jeder Schritt zum Führerausweis' },
  licence: { eyebrow: 'Der Weg zum Führerschein', title: 'Schritt für Schritt zum Ausweis' },
  prices: { eyebrow: 'Preise · Prices', title: 'Faire, transparente Tarife' },
  about: { eyebrow: 'Über uns · About', title: 'Dein DriveBuddies-Team' },
  contact: { eyebrow: 'Kontakt · Contact', title: 'Wir melden uns prompt' },
  blog: { eyebrow: 'Blog & Ratgeber', title: 'Tipps rund um den Führerausweis' },
};

const logoSvg = readFileSync(ROOT + 'public/logo-white.svg', 'utf8');
// logo-white viewBox "74 304 618 161" → aspect ≈ 3.84. Render at 460px wide.
const logoW = 460;
const logoH = Math.round((logoW * 161) / 618);
const logoPng = await sharp(Buffer.from(logoSvg))
  .resize(logoW, logoH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function bgSvg({ eyebrow, title }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PRIMARY}"/>
      <stop offset="1" stop-color="${PRIMARY_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1050" cy="90" r="320" fill="#ffffff" opacity="0.06"/>
  <circle cx="120" cy="560" r="220" fill="#ffffff" opacity="0.05"/>
  <text x="90" y="300" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" letter-spacing="2" fill="#ffffff" opacity="0.85">${esc(eyebrow.toUpperCase())}</text>
  <text x="88" y="380" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="800" fill="#ffffff">${esc(title)}</text>
  <text x="90" y="560" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600" fill="#ffffff" opacity="0.9">drivebuddies.ch</text>
  <rect x="90" y="410" width="120" height="6" rx="3" fill="#ffffff" opacity="0.9"/>
</svg>`;
}

for (const [name, cfg] of Object.entries(sections)) {
  const bg = await sharp(Buffer.from(bgSvg(cfg))).png().toBuffer();
  await sharp(bg)
    .composite([{ input: logoPng, top: 90, left: 88 }])
    .png({ compressionLevel: 9 })
    .toFile(OUT + name + '.png');
  console.log('wrote public/og/' + name + '.png');
}
console.log('done');
