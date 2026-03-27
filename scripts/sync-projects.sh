#!/usr/bin/env bash
# sync-projects.sh — pull project repos and sync devlog + demo into dnuke.com
#
# For each [[project]] in projects.toml:
#   1. Clone the repo if not present locally, otherwise git pull
#   2. Read .project.toml for metadata
#   3. Copy devlog/*.md → src/devlog/<slug>/ with Eleventy frontmatter injected
#   4. Copy devlog assets → src/images/devlog/<slug>/
#   5. Write src/devlog/<slug>/index.njk (per-project devlog index)
#   6. Write src/projects/<slug>/index.md (project landing page)
#   7. Append project record to src/_data/synced-projects.ndjson
#   8. If [demo] exists, copy web files → src/<slug>/
#
# After the loop, synced-projects.ndjson is combined into synced-projects.json

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_TOML="$SITE_ROOT/projects.toml"
SRC_DIR="$SITE_ROOT/src"
DEVLOG_BASE="$SRC_DIR/devlog"
IMAGES_BASE="$SRC_DIR/images/devlog"
PROJECTS_BASE="$SRC_DIR/projects"
DATA_DIR="$SRC_DIR/_data"

mkdir -p "$DEVLOG_BASE" "$IMAGES_BASE" "$PROJECTS_BASE" "$DATA_DIR"

# Start fresh accumulator for project JSON
NDJSON="$DATA_DIR/syncedProjects.ndjson"
> "$NDJSON"

# Extract repo URLs from projects.toml
REPOS=$(python3 -c "
import tomllib
with open('$PROJECTS_TOML', 'rb') as f:
    data = tomllib.load(f)
for p in data.get('project', []):
    print(p['repo'])
")

for REPO_URL in $REPOS; do
  SLUG=$(basename "$REPO_URL" .git)
  # Prefer a sibling directory (local dev); fall back to /tmp on CI where
  # the repo root is at / or another non-writable parent.
  _SIBLING="$(dirname "$SITE_ROOT")/$SLUG"
  if [ "$(dirname "$SITE_ROOT")" = "/" ]; then
    LOCAL_PATH="/tmp/do-sync-repos/$SLUG"
  else
    LOCAL_PATH="$_SIBLING"
  fi

  # Clone or pull
  if [ -d "$LOCAL_PATH/.git" ]; then
    echo "→ $SLUG: pulling..."
    git -C "$LOCAL_PATH" pull --quiet
  else
    echo "→ $SLUG: cloning $REPO_URL..."
    git clone --quiet "$REPO_URL" "$LOCAL_PATH"
  fi

  PROJECT_TOML="$LOCAL_PATH/.project.toml"
  if [ ! -f "$PROJECT_TOML" ]; then
    echo "  ⚠ No .project.toml found in $SLUG, skipping"
    continue
  fi

  # Read all metadata from .project.toml — write to a temp JSON file to avoid
  # shell quoting issues when passing multiline data between processes.
  META_FILE="$(mktemp)"
  python3 - "$PROJECT_TOML" "$REPO_URL" "$SLUG" > "$META_FILE" <<'PY'
import tomllib, json, sys
toml_path, repo_url, fallback_slug = sys.argv[1], sys.argv[2], sys.argv[3]
with open(toml_path, 'rb') as f:
    data = tomllib.load(f)
out = {
    'slug':        data.get('slug', fallback_slug),
    'name':        data.get('name', fallback_slug),
    'description': data.get('description', ''),
    'tags':        data.get('tags', []),
    'has_demo':    'demo' in data,
    'demo_files':  data.get('demo', {}).get('files', []),
    'github':      repo_url,
}
print(json.dumps(out))
PY

  # Extract individual fields from the JSON
  _py() { python3 -c "import json,sys; d=json.load(open(sys.argv[1])); print($1)" "$META_FILE"; }
  PROJECT_SLUG=$(_py "d['slug']")
  PROJECT_NAME=$(_py "d['name']")
  PROJECT_DESC=$(_py "d['description']")
  HAS_DEMO=$(_py "'true' if d['has_demo'] else 'false'")
  DEMO_FILES=$(_py "','.join(d['demo_files'])")

  echo "  project: $PROJECT_NAME ($PROJECT_SLUG)"

  # --- Devlog entries ---
  DEVLOG_SRC="$LOCAL_PATH/devlog"
  DEVLOG_DEST="$DEVLOG_BASE/$PROJECT_SLUG"
  mkdir -p "$DEVLOG_DEST"

  if [ -d "$DEVLOG_SRC/assets" ]; then
    IMAGES_DEST="$IMAGES_BASE/$PROJECT_SLUG"
    mkdir -p "$IMAGES_DEST"
    cp "$DEVLOG_SRC"/assets/*.png "$IMAGES_DEST/" 2>/dev/null || true
    echo "  images → src/images/devlog/$PROJECT_SLUG/"
  fi

  for MD in "$DEVLOG_SRC"/*.md; do
    [ -f "$MD" ] || continue
    BASENAME=$(basename "$MD" .md)
    DEST_FILE="$DEVLOG_DEST/${BASENAME}.md"

    python3 - "$MD" "$BASENAME" "$PROJECT_SLUG" "$PROJECT_NAME" "$DEST_FILE" <<'PY'
import re, sys

src, basename, slug, name, dest = sys.argv[1:]

with open(src) as f:
    content = f.read()

date = re.search(r'^\d{4}-\d{2}-\d{2}', basename).group(0)

title_m = re.search(r'^# (.+)$', content, re.MULTILINE)
title = title_m.group(1).replace('"', '\\"') if title_m else slug

body = re.sub(r'^# .+\n\n?', '', content, count=1)
body = re.sub(r'<!--.*?-->', '', body, flags=re.DOTALL)
body = re.sub(r'!\[\]\(assets/([^)]+)\)', r'![](/images/devlog/' + slug + r'/\1)', body)
body = body.strip()

frontmatter = f"""---
layout: devlog-post.njk
title: "{title}"
date: {date}
project: {slug}
project_name: {name}
tags:
  - devlog
  - {slug}
---
"""

with open(dest, 'w') as f:
    f.write(frontmatter + '\n' + body + '\n')

print(f"  devlog: {dest}")
PY
  done

  # --- Per-project devlog index page ---
  cat > "$DEVLOG_DEST/index.njk" <<NJKEOF
---
layout: base.njk
title: "${PROJECT_NAME} — Devlog"
project: ${PROJECT_SLUG}
project_name: ${PROJECT_NAME}
permalink: /devlog/${PROJECT_SLUG}/
---
<div class="blog-container">
  <div class="post-meta" style="margin-bottom:8px;">
    <a href="/devlog/">← All devlog entries</a>
  </div>
  <div class="page-title">${PROJECT_NAME}</div>
  <p style="color:#888; font-size:14px; margin-bottom:32px;">
    Build log for ${PROJECT_NAME}.
  </p>
  <ul class="post-list">
    {%- for post in collections.devlog %}
      {%- if post.data.project == "${PROJECT_SLUG}" %}
      <li class="post-item">
        <div class="post-meta">{{ post.date | dateFormat }}</div>
        <div class="post-title"><a href="{{ post.url }}">{{ post.data.title }}</a></div>
        {%- if post.templateContent %}
        <div class="post-excerpt">{{ post.templateContent | excerpt }}</div>
        {%- endif %}
      </li>
      {%- endif %}
    {%- endfor %}
  </ul>
</div>
NJKEOF
  echo "  devlog index → src/devlog/$PROJECT_SLUG/index.njk"

  # --- Project landing page ---
  PROJ_DEST="$PROJECTS_BASE/$PROJECT_SLUG"
  mkdir -p "$PROJ_DEST"
  DESCRIPTION_MD="$LOCAL_PATH/DESCRIPTION.md"
  DESCRIPTION_BODY=""
  [ -f "$DESCRIPTION_MD" ] && DESCRIPTION_BODY=$(cat "$DESCRIPTION_MD")

  DEMO_LINK=""
  [ "$HAS_DEMO" = "true" ] && DEMO_LINK="<a href=\"/${PROJECT_SLUG}/\" class=\"btn btn-primary\">Live Demo &rarr;</a>"

  python3 - "$PROJ_DEST/index.md" "$PROJECT_SLUG" "$PROJECT_NAME" \
            "$PROJECT_DESC" "$REPO_URL" "$HAS_DEMO" "$DESCRIPTION_MD" "$META_FILE" <<'PY'
import sys, re, json

dest, slug, name, desc, github, has_demo, desc_md, meta_file = sys.argv[1:]

tags = json.load(open(meta_file)).get('tags', [])

body = ""
try:
    with open(desc_md) as f:
        body = f.read().strip()
except FileNotFoundError:
    body = desc

# First non-empty paragraph for the card description
card_desc = desc
if body:
    first_para = re.split(r'\n\n', body.lstrip('#').strip())[0].strip()
    first_para = re.sub(r'[#*`]', '', first_para).replace('\n', ' ').strip()
    if first_para:
        card_desc = first_para.replace('"', '\\"')

tags_yaml = ('tags: [' + ', '.join(tags) + ']') if tags else ''

demo_link = f"- [Live Demo](/{slug}/)" if has_demo == "true" else ""
github_link = f"- [GitHub]({github})"
devlog_link = f"- [Devlog](/devlog/{slug}/)"

links = "\n".join(l for l in [demo_link, github_link, devlog_link] if l)

frontmatter = f"""---
layout: project-page.njk
title: "{name}"
slug: {slug}
description: "{card_desc}"
{tags_yaml}
github: {github}
has_demo: {has_demo}
permalink: /projects/{slug}/
---
"""

with open(dest, 'w') as f:
    f.write(frontmatter + '\n' + body + '\n\n' + links + '\n')

print(f"  landing → src/projects/{slug}/index.md")
PY

  # --- Accumulate project record for synced-projects.json ---
  cat "$META_FILE" >> "$NDJSON"
  rm "$META_FILE"

  # --- Demo files ---
  if [ -n "$DEMO_FILES" ]; then
    DEMO_DEST="$SRC_DIR/$PROJECT_SLUG"
    mkdir -p "$DEMO_DEST"
    IFS=',' read -ra FILES <<< "$DEMO_FILES"
    for FILE in "${FILES[@]}"; do
      SRC_FILE="$LOCAL_PATH/$FILE"
      [ -f "$SRC_FILE" ] && cp "$SRC_FILE" "$DEMO_DEST/$FILE"
    done
    echo "  demo → src/$PROJECT_SLUG/"
  fi

  echo "  ✓ done"
done

# Combine NDJSON → synced-projects.json
python3 - "$NDJSON" "$DATA_DIR/syncedProjects.json" <<'PY'
import json, sys
ndjson_path, out_path = sys.argv[1], sys.argv[2]
records = []
with open(ndjson_path) as f:
    for line in f:
        line = line.strip()
        if line:
            records.append(json.loads(line))
with open(out_path, 'w') as f:
    json.dump(records, f, indent=2)
print(f"  data → src/_data/syncedProjects.json ({len(records)} projects)")
PY
