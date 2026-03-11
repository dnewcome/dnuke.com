#!/usr/bin/env node
// Build resume PDF from _site/resume/index.html using Chrome headless.
// Run after `npm run build`: node scripts/pdf.js
// Or use: npm run pdf

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const siteDir = path.resolve(__dirname, '../_site');
const htmlFile = path.join(siteDir, 'resume/index.html');
const outDir = path.join(siteDir, 'files');
const pdfFile = path.join(outDir, 'resume.pdf');

if (!fs.existsSync(htmlFile)) {
  console.error(`HTML not found: ${htmlFile}`);
  console.error('Run `npm run build` first.');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const chrome = process.env.CHROME_BIN ||
  ['/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium']
    .find(p => fs.existsSync(p));

if (!chrome) {
  console.error('Chrome/Chromium not found. Set CHROME_BIN env var to the path.');
  process.exit(1);
}

console.log(`Rendering: ${htmlFile}`);
console.log(`Output:    ${pdfFile}`);

execSync([
  `"${chrome}"`,
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  `--print-to-pdf="${pdfFile}"`,
  '--print-to-pdf-no-header',
  `"file://${htmlFile}"`
].join(' '), { stdio: 'inherit' });

const size = (fs.statSync(pdfFile).size / 1024).toFixed(1);
console.log(`Done. ${size} KB`);
