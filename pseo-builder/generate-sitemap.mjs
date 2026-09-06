import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllChildPagePaths } from './lib/taxData.js';
import { SS_TAXING_STATES } from './lib/ssData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_URLS = [
  { loc: 'https://uscalchub.com/', priority: '1.0' },
  { loc: 'https://uscalchub.com/credit-card-payoff/', priority: '0.8' },
  { loc: 'https://uscalchub.com/overtime-calculator/', priority: '0.8' },
  { loc: 'https://uscalchub.com/real-estate-calculator/', priority: '0.8' },
  { loc: 'https://uscalchub.com/salary-calculator/', priority: '0.8' },
  { loc: 'https://uscalchub.com/social-security-calculator/', priority: '0.8' },
  { loc: 'https://uscalchub.com/tip-calculator/', priority: '0.8' },
  { loc: 'https://uscalchub.com/blog/texas-vs-florida-salary/', priority: '0.7' },
  { loc: 'https://uscalchub.com/about/', priority: '0.5' },
  { loc: 'https://uscalchub.com/contact/', priority: '0.5' },
  { loc: 'https://uscalchub.com/privacy-policy/', priority: '0.5' },
  { loc: 'https://uscalchub.com/terms/', priority: '0.5' }
];

async function generateSitemap() {
  const dynamicPaths = getAllChildPagePaths();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static URLs
  for (const url of STATIC_URLS) {
    xml += `  <url>\n`;
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Add dynamic salary calculator URLs
  for (const pathObj of dynamicPaths) {
    const state = pathObj.params.state;
    const amount = pathObj.params.amount;
    xml += `  <url>\n`;
    xml += `    <loc>https://uscalchub.com/salary-calculator/${state}/${amount}/</loc>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Add dynamic Social Security taxing state URLs
  for (const s of SS_TAXING_STATES) {
    xml += `  <url>\n`;
    xml += `    <loc>https://uscalchub.com/social-security-calculator/${s.slug}/</loc>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  // Write to repository root
  const rootSitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  fs.writeFileSync(rootSitemapPath, xml);
  
  console.log(`Generated sitemap with ${STATIC_URLS.length + dynamicPaths.length + SS_TAXING_STATES.length} URLs at ${rootSitemapPath}`);
}

generateSitemap();
