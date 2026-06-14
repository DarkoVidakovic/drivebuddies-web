// SEO + broken-link audit over the built dist/ directory.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const allFiles = new Set(walk(DIST).map((f) => '/' + relative(DIST, f).replace(/\\/g, '/')));

function routeOf(file) {
  let r = '/' + relative(DIST, file).replace(/\\/g, '/');
  r = r.replace(/index\.html$/, '');
  if (!r.endsWith('/')) r = r.replace(/\.html$/, '/');
  return r === '' ? '/' : r;
}

// Build set of resolvable route paths.
const routes = new Set(htmlFiles.map(routeOf));

function decode(s) {
  return s == null
    ? s
    : s
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x2F;/g, '/');
}

function attr(html, re) {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
}

const pages = [];
const brokenLinks = [];
const issues = [];

for (const file of htmlFiles) {
  const route = routeOf(file);
  const html = readFileSync(file, 'utf8');

  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  const ogTitle = attr(html, /<meta property="og:title" content="([^"]*)"/);
  const noindex = /name="robots" content="noindex/.test(html);
  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
    (m) => ({ lang: m[1], href: m[2] })
  );
  const h1count = (html.match(/<h1\b/g) || []).length;
  const jsonld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => m[1]
  );

  pages.push({ route, title, desc, canonical, ogImage, ogTitle, noindex, hreflangs, h1count, jsonld });

  // length / presence checks
  if (!title) issues.push(`[${route}] missing <title>`);
  else if (title.length > 60) issues.push(`[${route}] title ${title.length} chars >60: "${title}"`);
  if (!desc) issues.push(`[${route}] missing meta description`);
  else if (desc.length > 160) issues.push(`[${route}] description ${desc.length} chars >160`);
  if (!canonical) issues.push(`[${route}] missing canonical`);
  if (!ogImage) issues.push(`[${route}] missing og:image`);
  if (h1count !== 1) issues.push(`[${route}] has ${h1count} <h1> (expected 1)`);

  // validate JSON-LD parses
  jsonld.forEach((block, i) => {
    try { JSON.parse(block); } catch (e) { issues.push(`[${route}] JSON-LD block ${i} invalid: ${e.message}`); }
  });

  // internal link resolution
  const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    const clean = href.split('#')[0].split('?')[0];
    if (clean === '' || clean.startsWith('/_astro/')) continue;
    const decoded = decodeURI(clean);
    // file assets (have an extension) or html routes
    if (routes.has(decoded) || allFiles.has(decoded)) continue;
    // try with index.html
    if (allFiles.has(decoded + 'index.html')) continue;
    brokenLinks.push(`[${route}] → ${href}`);
  }
}

// Duplicate titles / descriptions (excluding noindex)
const byTitle = {};
const byDesc = {};
for (const p of pages) {
  if (p.noindex) continue;
  (byTitle[p.title] ||= []).push(p.route);
  (byDesc[p.desc] ||= []).push(p.route);
}
for (const [t, rs] of Object.entries(byTitle)) if (rs.length > 1) issues.push(`DUP title (${rs.length}): "${t}" → ${rs.join(', ')}`);
for (const [d, rs] of Object.entries(byDesc)) if (d && rs.length > 1) issues.push(`DUP description (${rs.length}) → ${rs.join(', ')}`);

// hreflang reciprocity: every hreflang target must exist & point back
const routeByCanonical = {};
for (const p of pages) if (p.canonical) routeByCanonical[p.canonical] = p;
for (const p of pages) {
  if (p.noindex) continue;
  for (const hl of p.hreflangs) {
    if (hl.lang === 'x-default') continue;
    const target = routeByCanonical[hl.href];
    if (!target) { issues.push(`[${p.route}] hreflang ${hl.lang} → ${hl.href} has no page with that canonical`); continue; }
    // target should list p.canonical back
    const back = target.hreflangs.some((h) => h.href === p.canonical);
    if (!back) issues.push(`[${p.route}] hreflang ${hl.lang} → ${hl.href} not reciprocated`);
  }
  // x-default present if any hreflang present
  if (p.hreflangs.length && !p.hreflangs.some((h) => h.lang === 'x-default'))
    issues.push(`[${p.route}] has hreflang but no x-default`);
}

console.log(`\n=== SEO AUDIT: ${pages.length} pages ===`);
console.log(`\n--- BROKEN INTERNAL LINKS: ${brokenLinks.length} ---`);
[...new Set(brokenLinks)].sort().forEach((b) => console.log('  ✗ ' + b));
console.log(`\n--- ISSUES: ${issues.length} ---`);
issues.sort().forEach((i) => console.log('  • ' + i));
console.log('');
process.exit(brokenLinks.length || issues.length ? 1 : 0);
