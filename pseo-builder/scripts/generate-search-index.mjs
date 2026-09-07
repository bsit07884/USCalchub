/**
 * pseo-builder/scripts/generate-search-index.mjs
 * Generates unified search index (search-index.json) for USCalcHub.
 *
 * Priority 1: Calculator child pages (Salary & Social Security state pages)
 * Priority 2: Core tool & hub pages (Salary, SS, Tip, Credit Card, Overtime, Real Estate)
 * Priority 3: Blog articles (from WordPress REST API with offline fallback)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STATES, SALARY_CONFIG, isLiveScope } from '../lib/taxData.js';
import { SS_TAXING_STATES } from '../lib/ssData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanText(str) {
  if (!str) return '';
  let text = str.replace(/<[^>]*>?/gm, ' ');
  const entities = {
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '-',
    '&#8212;': '—',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&#038;': '&',
    '&#8230;': '...',
    '&nbsp;': ' '
  };
  for (const [ent, rep] of Object.entries(entities)) {
    text = text.replaceAll(ent, rep);
  }
  text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  return text.replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// 1. CORE TOOLS & HUBS (Priority 2)
// ---------------------------------------------------------------------------
const CORE_TOOLS = [
  {
    id: 'tool-salary',
    title: 'US Salary After Tax Calculator',
    description: 'Calculate your exact take-home paycheck after federal, state & FICA tax deductions across all 50 states.',
    url: '/salary-calculator/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'salary paycheck take home pay income tax federal fica state brackets 2026 earnings wage'
  },
  {
    id: 'tool-social-security',
    title: 'Social Security Tax Calculator',
    description: 'Determine if your Social Security retirement benefits are subject to federal and state income tax in 2026.',
    url: '/social-security-calculator/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'social security retirement benefits tax combined income irs threshold agi 2026 8 taxing states'
  },
  {
    id: 'tool-tip',
    title: 'Tip & Bill Splitter Calculator',
    description: 'Quickly calculate custom tip percentages, local sales tax, and split restaurant bills fairly among friends.',
    url: '/tip-calculator/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'tip bill splitter dinner restaurant gratuity split shared tab check tax dining'
  },
  {
    id: 'tool-credit-card',
    title: 'Credit Card Payoff & Debt Planner',
    description: 'Plan your fastest path to becoming debt-free with custom monthly payment schedules and APR interest savings.',
    url: '/credit-card-payoff/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'credit card payoff debt interest apr payoff balance amortization payment planner debt free'
  },
  {
    id: 'tool-real-estate',
    title: 'Real Estate Commission Calculator',
    description: 'Estimate post-NAR settlement realtor commissions, buyer/seller broker splits, and net closing proceeds.',
    url: '/real-estate-calculator/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'real estate commission nar settlement realtor broker agent fee closing proceeds seller buyer home sale'
  },
  {
    id: 'tool-overtime',
    title: 'Overtime Tax Refund & Paycheck Calculator',
    description: 'Estimate your 2026 tax-free overtime deductions, time-and-a-half earnings, and higher effective paycheck.',
    url: '/overtime-calculator/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'overtime tax refund time and a half 1.5x hourly wage overtime pay tax exemption deductions 2026'
  },
  {
    id: 'page-about',
    title: 'About USCalcHub',
    description: 'Learn about our mission, methodology, and commitment to fast, accurate, and privacy-first financial tools.',
    url: '/about/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'about uscalchub mission methodology financial calculator accuracy team'
  },
  {
    id: 'page-contact',
    title: 'Contact Support & Feedback',
    description: 'Get in touch with the USCalcHub financial and editorial development team.',
    url: '/contact/',
    type: 'tool',
    badge: 'Tool',
    priority: 2,
    keywords: 'contact support feedback help email customer service question'
  }
];

async function generateSearchIndex() {
  console.log('Generating Site-Wide Unified Search Index...');
  const searchIndex = [];

  // 1. PRIORITY 1: Child Calculator Pages
  // A. Salary Child Pages
  let salaryChildCount = 0;
  for (const state of STATES) {
    for (const [bracketShort, config] of Object.entries(SALARY_CONFIG)) {
      if (isLiveScope(state.slug, bracketShort)) {
        salaryChildCount++;
        const stateTaxDesc = state.incomeTax.type === 'none' 
          ? '0% state income tax' 
          : `${state.name} state income tax`;

        searchIndex.push({
          id: `salary-${state.slug}-${bracketShort}`,
          title: `${state.name} ${config.display} Salary Take Home Pay Calculator`,
          description: `Calculate your take-home paycheck on a ${config.display} annual salary in ${state.name} (${config.short}) for 2026 with federal and ${stateTaxDesc}.`,
          url: `/salary-calculator/${state.slug}/${bracketShort}/`,
          type: 'calculator',
          badge: 'Calculator',
          priority: 1,
          keywords: `${state.name.toLowerCase()} ${state.abbr.toLowerCase()} ${config.short} ${config.amount} ${config.display} salary paycheck take home pay tax deductions 2026 brackets`
        });
      }
    }
  }

  // B. Social Security Child Pages (8 taxing states)
  let ssChildCount = 0;
  for (const s of SS_TAXING_STATES) {
    ssChildCount++;
    searchIndex.push({
      id: `ss-${s.slug}`,
      title: `Is Social Security Taxed in ${s.name}? (2026 Rules)`,
      description: `2026 statutory rules for Social Security in ${s.name}: ${cleanText(s.summary)}`,
      url: `/social-security-calculator/${s.slug}/`,
      type: 'calculator',
      badge: 'Calculator',
      priority: 1,
      keywords: `${s.name.toLowerCase()} ${s.abbr.toLowerCase()} social security retirement benefits tax exempt agi threshold taxing state 2026 rules`
    });
  }

  // 2. PRIORITY 2: Core Tools & Hubs
  searchIndex.push(...CORE_TOOLS);

  // 3. PRIORITY 3: WordPress Blog Posts
  let posts = [];
  try {
    const res = await fetch('https://uscalchub.com/blog/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,title,excerpt,link');
    if (res.ok) {
      posts = await res.json();
      console.log(`Successfully fetched ${posts.length} posts from WordPress REST API.`);
      const cachePath = path.join(__dirname, 'cached-blog-posts.json');
      fs.writeFileSync(cachePath, JSON.stringify(posts, null, 2));
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn(`Could not fetch from live WP REST API (${err.message}). Using cached blog posts...`);
    const cachePath = path.join(__dirname, 'cached-blog-posts.json');
    if (fs.existsSync(cachePath)) {
      posts = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      console.log(`Loaded ${posts.length} posts from cache.`);
    } else {
      console.error('No cached blog posts found!');
    }
  }

  for (const post of posts) {
    const rawTitle = post.title?.rendered || '';
    const rawExcerpt = post.excerpt?.rendered || '';
    const title = cleanText(rawTitle);
    let excerpt = cleanText(rawExcerpt);
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 157) + '...';
    }

    searchIndex.push({
      id: `post-${post.id || post.slug}`,
      title: title,
      description: excerpt,
      url: `/blog/${post.slug}/`,
      type: 'article',
      badge: 'Article',
      priority: 3,
      keywords: `${title.toLowerCase()} ${post.slug.replace(/-/g, ' ')} blog article guide`
    });
  }

  console.log('Search Index Summary:');
  console.log(`- Priority 1 (Calculators): ${salaryChildCount} salary + ${ssChildCount} SS = ${salaryChildCount + ssChildCount} items`);
  console.log(`- Priority 2 (Core Tools & Hubs): ${CORE_TOOLS.length} items`);
  console.log(`- Priority 3 (Blog Articles): ${posts.length} items`);
  console.log(`- Total indexed items: ${searchIndex.length}`);

  const pseoPublicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(pseoPublicDir)) {
    fs.mkdirSync(pseoPublicDir, { recursive: true });
  }
  const pseoIndexPath = path.join(pseoPublicDir, 'search-index.json');
  fs.writeFileSync(pseoIndexPath, JSON.stringify(searchIndex, null, 2));

  const rootIndexPath = path.join(__dirname, '..', '..', 'search-index.json');
  fs.writeFileSync(rootIndexPath, JSON.stringify(searchIndex, null, 2));

  console.log('Successfully written search index to:');
  console.log('- ' + pseoIndexPath);
  console.log('- ' + rootIndexPath);
}

generateSearchIndex();
