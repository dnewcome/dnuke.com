# CLAUDE.md — dnuke.com

Daniel Newcome's personal site + build log. Eleventy static site, deployed on
DigitalOcean App Platform (auto-deploy on push to `main`), fronted by Cloudflare.

## Commands

```bash
npm run build    # eleventy → _site/  (renders committed content; no cloning)
npm run serve    # eleventy dev server at http://localhost:8080
npm run pdf      # build + generate _site/files/resume.pdf (needs Chrome)
npm run sync     # OPTIONAL bulk importer — clones repos in projects.toml. NOT run on build.
```

## How projects get published — PUSH, per-project

Each project pushes its own devlog onto the site; the site never pulls. In a
project repo: `devsnap` captures an entry → `devpublish` copies it here, commits,
and pushes → DigitalOcean redeploys. dnuke.com's build is **just Eleventy** over
committed content.

**Full details: [docs/PIPELINE.md](docs/PIPELINE.md).** Read it before changing
anything about sync/publish/deploy.

Key points that are easy to get wrong:
- `src/devlog/`, `src/projects/`, `src/images/devlog/`, `src/<demo>/` are
  **committed source** — do not git-ignore or "regenerate" them.
- `scripts/sync-projects.sh` is an **optional importer**, not part of the build,
  and it **overwrites** hand-tuned landing pages. Don't wire it into `npm run build`.
- Private repos (curiate) and static projects publish via `devpublish` /
  `/add-project` — they can't be pulled.
- Landing-page cards on the home page come from `src/projects/<slug>/index.md`
  (`collections.projects`), created with `/add-project`. `devpublish` only writes devlog.

## Publisher tooling (devlog-tools)

`scripts/devpublish.sh` and per-project `devsnap`/`devpublish` scripts are vendored
from `github.com/dnewcome/devlog-tools` (local checkout: `../devlog-tools`). The
canonical copy lives there; projects install via its `install.sh --tag <ver>`.
`devpublish` auto commit+pushes dnuke.com (set `DEVPUBLISH_PUSH=0` to stage only).

## Structure

```
src/index.njk            landing page (lists collections.projects)
src/blog/posts/*.md      blog posts
src/devlog/<slug>/        per-project devlog (committed, via devpublish)
src/projects/<slug>/      per-project landing page (committed, via /add-project)
src/_includes/            layouts (base, post, resume, devlog-post, project-page)
scripts/                  pdf.js, devpublish.sh, sync-projects.sh (importer)
.do/app.yaml             DigitalOcean App Platform spec
```
