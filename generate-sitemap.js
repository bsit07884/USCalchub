const fs = require('fs');
const path = require('path');

const baseUrl = 'https://uscalchub.com';
const rootDir = __dirname;
const ignoreDirs = ['node_modules', '.git', '.github', 'embed', 'pseo-builder'];
const ignoreFiles = ['404.html'];

// Pages that typically have lower priority
const infoPages = ['about', 'contact', 'privacy-policy', 'terms'];

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        getHtmlFiles(fullPath, fileList);
      }
    } else if (file.endsWith('.html') && !ignoreFiles.includes(file)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function generateSitemap() {
  const files = getHtmlFiles(rootDir);
  let urls = [];

  files.forEach(file => {
    // Get relative path from root
    let relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
    let urlPath = '';
    let priority = '0.8'; // Default for tools/calculators

    if (relativePath === 'index.html') {
      urlPath = '/';
      priority = '1.0';
    } else {
      // Remove index.html
      if (relativePath.endsWith('/index.html')) {
        urlPath = '/' + relativePath.replace('/index.html', '/');
      } else if (relativePath.endsWith('.html')) {
        urlPath = '/' + relativePath.replace('.html', '/');
      }

      // Adjust priorities
      const folderMatch = urlPath.split('/')[1];
      if (infoPages.includes(folderMatch)) {
        priority = '0.5';
      } else if (folderMatch === 'blog') {
        priority = '0.7';
      }
    }

    urls.push({ loc: `${baseUrl}${urlPath}`, priority });
  });

  // Sort URLs: Home first, then tools (0.8), then blog (0.7), then info (0.5)
  urls.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  urls.forEach(u => {
    xml += `  <url>\n`;
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += `</urlset>\n`;

  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf8');
  console.log('sitemap.xml generated successfully with ' + urls.length + ' URLs.');
}

generateSitemap();
