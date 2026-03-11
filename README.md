# dnuke.com

Source for [dnuke.com](https://dnuke.com) — Daniel Newcome's personal and professional site.

## Build

```bash
npm install
npm run build    # outputs to _site/
npm run serve    # dev server at http://localhost:8080
npm run pdf      # build site + generate _site/files/resume.pdf
```

## Structure

```
src/
  index.njk              landing page
  resume.md              resume (also builds to PDF)
  blog/posts/*.md        blog posts (markdown + YAML frontmatter)
  _includes/             page layouts (base, post, resume)
  css/style.css          all styles
  images/                photos and assets
  files/                 static files (resume PDF goes here after build)
_site/                   generated output (not checked in)
scripts/pdf.js           Chrome headless PDF renderer
```

## Adding a blog post

Create `src/blog/posts/YYYY-MM-DD_slug.md`:

```markdown
---
title: "Post Title"
date: 2025-03-15
tags: ["tag1", "tag2"]
---

Post content here.
```

## Dependencies

- [Eleventy](https://www.11ty.dev/) — static site generator
- Google Chrome — headless PDF rendering (must be installed)
