import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['dist', 'node_modules', '.git']);
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  }
}
walk(root);

const errors = [];
const titles = new Map();
for (const file of htmlFiles) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const html = fs.readFileSync(file, 'utf8');
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  if (noindex) continue;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) errors.push(`${relative}: missing title`);
  else if (titles.has(title)) errors.push(`${relative}: duplicate title also used by ${titles.get(title)}`);
  else titles.set(title, relative);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) errors.push(`${relative}: missing meta description`);
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) errors.push(`${relative}: missing canonical`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`${relative}: expected exactly one H1`);
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${relative}: invalid JSON-LD`); }
  }
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>https:\/\/ordinorabs\.com([^<]*)<\/loc>/g)].map((match) => match[1]);
for (const location of locations) {
  const local = location === '/' ? 'index.html' : location.endsWith('/') ? `${location.slice(1)}index.html` : location.slice(1);
  if (!fs.existsSync(path.join(root, local))) errors.push(`sitemap: ${location} has no local HTML target`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`SEO validation passed for ${htmlFiles.length} HTML files and ${locations.length} sitemap URLs.`);
