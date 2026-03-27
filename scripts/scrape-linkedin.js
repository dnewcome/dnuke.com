#!/usr/bin/env node
// Usage: LINKEDIN_EMAIL=you@example.com LINKEDIN_PASSWORD=secret LINKEDIN_URL=https://www.linkedin.com/in/yourhandle/ node scripts/scrape-linkedin.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const EMAIL    = process.env.LINKEDIN_EMAIL;
const PASSWORD = process.env.LINKEDIN_PASSWORD;
const PROFILE  = process.env.LINKEDIN_URL;

if (!EMAIL || !PASSWORD || !PROFILE) {
  console.error('Set LINKEDIN_EMAIL, LINKEDIN_PASSWORD, and LINKEDIN_URL env vars.');
  process.exit(1);
}

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let last = 0;
      const id = setInterval(() => {
        window.scrollBy(0, 600);
        if (document.body.scrollHeight === last) { clearInterval(id); resolve(); }
        last = document.body.scrollHeight;
      }, 300);
    });
  });
}

async function getSectionText(page, heading) {
  return page.evaluate((heading) => {
    const h2 = [...document.querySelectorAll('h2')].find(h => h.innerText.trim() === heading);
    if (!h2) return '';
    const section = h2.closest('section') || h2.parentElement.parentElement;
    return section ? section.innerText : '';
  }, heading);
}

// Detect a date range line: "Mar 2021 - Jul 2022 · ..." or "Oct 2024 - Present · ..."
const DATE_RANGE_RE = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–]/i;
// Detect duration-only: "2 yrs 11 mos", "1 yr", "6 mos"
const DURATION_ONLY_RE = /^\d+\s+(yr|yrs|mo|mos)(\s+\d+\s+(yr|yrs|mo|mos))?$/i;
// Detect "Company · Employment type" or "Something · Hybrid/Remote/On-site"
const COMPANY_TYPE_RE = / · (Full-time|Part-time|Contract|Freelance|Internship|Self-employed)/i;
// Employment type alone
const EMP_TYPE_RE = /^(Full-time|Part-time|Contract|Freelance|Internship|Self-employed)$/i;
// Location lines: "San Francisco Bay Area", "United States · Hybrid", plain work-modes, etc.
const LOCATION_RE = /^(Hybrid|Remote|On-site)$| · (Hybrid|Remote|On-site)$|Bay Area$|^United States|^San Francisco|^New York|^Los Angeles|^Seattle|^Austin|^Boston|^Chicago|^Denver|^Portland|^Miami|^Atlanta/i;
// Lines to skip outright
const SKIP_RE = /^(Experience|Education|Skills|Interests|Show all.*|Endorsed by|.*\d+\s+endorsements?$)/i;

function isSkip(line) {
  return !line || SKIP_RE.test(line) || DURATION_ONLY_RE.test(line) || EMP_TYPE_RE.test(line) || LOCATION_RE.test(line);
}

function parseExperience(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const entries = [];
  let current = null;
  let groupCompany = null;

  for (const line of lines) {
    if (DATE_RANGE_RE.test(line)) {
      if (current && current.title) {
        current.date = line.replace(/\s*·.*/g, '').trim();
        entries.push(current);
      }
      current = null;
    } else if (DURATION_ONLY_RE.test(line)) {
      // Previous "title" was a company group header
      if (current && current.title) {
        groupCompany = current.title;
        current = null;
      }
    } else if (isSkip(line)) {
      // skip
    } else if (COMPANY_TYPE_RE.test(line)) {
      // "Company · Type" — org for current entry
      const org = line.replace(/ · .*/i, '').trim();
      if (!current) current = { title: '', org: '', date: '' };
      current.org = org;
      groupCompany = null;
    } else {
      // Title candidate
      if (!current) current = { title: '', org: groupCompany || '', date: '' };
      if (!current.title) current.title = line;
    }
  }

  return entries.filter(e => e.title && e.date);
}

function parseEducation(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l && !SKIP_RE.test(l));
  const entries = [];
  let i = 0;
  while (i < lines.length) {
    const school = lines[i++];
    const degree = (lines[i] && !/^\d{4}/.test(lines[i])) ? lines[i++] : '';
    const date   = (lines[i] && /\d{4}/.test(lines[i]))   ? lines[i++] : '';
    if (school) entries.push({ school, degree, date });
  }
  return entries;
}

function parseSkills(text) {
  return text.split('\n')
    .map(l => l.trim())
    .filter(l => l && !SKIP_RE.test(l) && !DURATION_ONLY_RE.test(l) && !/^\d+$/.test(l) && !/^Endorsed/.test(l) && !/endorsement/.test(l));
}

function toMd(data) {
  const { name, location, summary, experience, education, skills } = data;

  const expHtml = experience.map(e => `
  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${e.title}</span>
      <span class="entry-date">${e.date}</span>
    </div>
    <div class="entry-org">${e.org}</div>
  </div>`).join('\n');

  const eduHtml = education.map(e => `
  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${e.degree || e.school}</span>
      <span class="entry-date">${e.date}</span>
    </div>
    ${e.degree ? `<div class="entry-org">${e.school}</div>` : ''}
  </div>`).join('\n');

  const skillsText = skills.slice(0, 20).join(', ');

  return `---
layout: resume-layout.njk
title: ${name} — Resume
permalink: resume/index.html
---

<div class="resume-header">
  <div class="resume-name">${name}</div>
  <div class="resume-contact">
    <span>${location}</span>
    <span>dan@dnuke.com</span>
    <span>github.com/dnewcome</span>
    <span>dnuke.com</span>
  </div>
</div>
${summary ? `
<div class="resume-section">
  <h2>Summary</h2>
  <p>${summary}</p>
</div>
` : ''}
<div class="resume-section">
  <h2>Experience</h2>
${expHtml}
</div>

<div class="resume-section">
  <h2>Skills</h2>
  <div class="skills-grid">
    <span class="skills-label">Skills</span>
    <span class="skills-value">${skillsText}</span>
  </div>
</div>

<div class="resume-section">
  <h2>Education</h2>
${eduHtml}
</div>
`;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Logging in...');
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.type('#username', EMAIL, { delay: 50 });
  await page.type('#password', PASSWORD, { delay: 50 });
  await page.click('[type=submit]');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });

  if (page.url().includes('/checkpoint') || page.url().includes('/challenge')) {
    console.error('LinkedIn is asking for a security challenge. Log in manually first to clear it.');
    await browser.close();
    process.exit(1);
  }

  console.log('Navigating to profile...');
  await page.goto(PROFILE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));
  await scrollToBottom(page);
  await new Promise(r => setTimeout(r, 1000));

  // Click "Show all X skills" to expand skills section
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('a, button')];
    const showAll = btns.find(b => /show all.*skill/i.test(b.innerText));
    if (showAll) showAll.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Extracting data...');

  const name = await page.$eval('h1', el => el.innerText.trim()).catch(() => 'Daniel Newcome');

  const location = await page.evaluate(() => {
    const spans = [...document.querySelectorAll('span')];
    const loc = spans.find(s => /, (CA|NY|WA|TX|OR|MA|IL|CO|FL|GA|PA|OH|MI|MN|AZ|NC|VA|NV|UT|MD|Bay Area)/.test(s.innerText.trim()));
    return loc ? loc.innerText.trim() : 'San Francisco, CA';
  });

  const summary = await page.evaluate(() => {
    const h2 = [...document.querySelectorAll('h2')].find(h => h.innerText.trim() === 'About');
    if (!h2) return '';
    const section = h2.closest('section') || h2.parentElement.parentElement;
    const text = section ? section.innerText : '';
    return text.replace(/^About\s*/i, '').replace(/\s*Show (more|less)\s*/gi, '').trim();
  });

  const expText   = await getSectionText(page, 'Experience');
  const eduText   = await getSectionText(page, 'Education');
  const skillText = await getSectionText(page, 'Skills');

  const experience = parseExperience(expText);
  const education  = parseEducation(eduText);
  const skills     = parseSkills(skillText);

  await browser.close();

  console.log(`Found: ${experience.length} jobs, ${education.length} education, ${skills.length} skills`);

  const data = { name, location, summary, experience, education, skills };
  const md = toMd(data);
  const out = path.join(__dirname, '../src/resume.md');
  fs.writeFileSync(out, md);
  console.log(`Written to ${out}`);
})();
