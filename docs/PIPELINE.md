# How dnuke.com publishes projects

The site is a build log of everything I'm working on. Each project pushes its own
updates onto the site — the site never reaches out and pulls. This doc is the map.

## The model: **push, per-project**

```
  project repo (e.g. fast-vj)                     dnuke.com
  ───────────────────────────                     ─────────
  1. devsnap   ── capture entry ──▶ devlog/*.md    (committed in the project)
  2. devpublish ──── copies entry ──────────────▶  src/devlog/<slug>/*.md
                                                   git commit + git push
                                                        │
                                                        ▼
                                            DigitalOcean auto-deploys
                                            (npm run build = eleventy)
```

- Only the project you touched publishes. No global re-sync, no cloning.
- dnuke.com's build is **just Eleventy** — it renders committed content. Fast and
  deterministic. There are no cloud tokens or cross-repo webhooks to maintain.
- Everything under `src/devlog/`, `src/projects/`, `src/images/devlog/`, and demo
  dirs `src/<slug>/` is **committed source** — the site's source of truth.

## Publishing an update (the 2-step flow)

From inside a project repo:

```bash
# 1. Capture — writes a devlog entry (+ screenshot) into ./devlog/ and commits it
#    to the project. In Claude Code just run: /devsnap
bash scripts/devsnap.sh --window --note "what I just did"

# 2. Review the entry, then publish it to the live site:
bash scripts/devpublish.sh devlog/2026-07-06-XXXXXX-my-entry.md
```

`devpublish` copies the entry into dnuke.com, runs a build to verify it renders,
then **commits and pushes dnuke.com**, which triggers the DigitalOcean deploy.
The post is live in about a minute.

- Escape hatch: `DEVPUBLISH_PUSH=0 bash scripts/devpublish.sh <entry>` copies +
  builds but leaves dnuke.com staged so you can push it yourself.
- The `/devsnap` Claude command runs step 1 and then offers to run step 2 for you.

## Adding a new project

| Kind | Devlog | Landing page (home-page card) |
|------|--------|-------------------------------|
| **Public repo** | `devsnap` → `devpublish` (push) | `/add-project <slug>` once |
| **Private repo** (e.g. curiate) | `devsnap` → `devpublish` (push) — works fine, publish is push so CI never needs to clone it | `/add-project <slug>` once |
| **Static / offline** (installation, hardware) | none | `/add-project <slug>` — writes the page directly |

To devlog-enable a repo that doesn't have the tooling yet:

```bash
cd ../my-project
proj init --name "My Project" -d "One sentence." -t tag1 tag2   # writes .project.toml
bash <(curl -fsSL https://raw.githubusercontent.com/dnewcome/devlog-tools/main/install.sh) --tag v1.1
```

Then `/add-project my-project` on the dnuke.com side to give it a home-page card,
and write a `DESCRIPTION.md` in the project for the landing-page body.

> **Landing pages are hand-written source.** The home page lists
> `collections.projects` from `src/projects/<slug>/index.md`. `devpublish` only
> touches the devlog; create the card once with `/add-project`.

## `sync-projects.sh` — the optional bulk importer

`npm run sync` reads `projects.toml`, clones each **public** repo, and regenerates
its devlog + landing page in one shot. Use it only to **import an existing
backlog** when first onboarding a project. It is **not** part of the build.

Caveats:
- It **overwrites** generated pages — don't run it against a project whose landing
  page you've hand-tuned (it'll clobber your prose).
- It can't import **private** repos (no CI clone creds). Publish those with
  `devpublish` instead.
- Its only output that isn't real source is `src/_data/syncedProjects.json`, which
  nothing consumes — it's git-ignored.

## Deploy

dnuke.com is a DigitalOcean App Platform static site fronted by Cloudflare. It
**auto-deploys on push to `main`**; `devpublish`'s push is what triggers it. The
build command is `npm run build` (→ `eleventy`).

> One-time check: make sure **Auto Deploy** is enabled for the app in the DO
> dashboard (Settings → the component → "Autodeploy code changes"). The site
> already deploys, so this is almost certainly on.

## File map

| Path | What it is |
|------|-----------|
| `src/devlog/<slug>/*.md` | Committed devlog entries (published by `devpublish`) |
| `src/devlog/<slug>/index.njk` | Per-project devlog index (auto-created by `devpublish`) |
| `src/devlog/index.njk` | Global devlog home page (hand-authored) |
| `src/projects/<slug>/index.md` | Committed landing page → home-page card (`/add-project`) |
| `src/images/devlog/<slug>/` | Committed screenshots |
| `src/<slug>/` | Committed web demo files (if any) |
| `scripts/devpublish.sh` | Publisher (vendored from devlog-tools) — copies + commits + pushes |
| `scripts/sync-projects.sh` | Optional bulk importer (see above) |
| `projects.toml` | Importer's repo list (not used at build time) |
