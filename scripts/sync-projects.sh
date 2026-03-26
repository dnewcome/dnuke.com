#!/usr/bin/env bash
# sync-projects.sh — pull project repos and sync devlog + demo into dnuke.com
#
# For each [[project]] in projects.toml:
#   1. Clone the repo if not present locally, otherwise git pull
#   2. Read the project's .project.toml for metadata
#   3. Copy devlog/*.md → src/devlog/<slug>/ with Eleventy frontmatter injected
#   4. Copy devlog assets → src/images/devlog/<slug>/
#   5. If [demo] section exists, copy web files → src/<slug>/

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_TOML="$SITE_ROOT/projects.toml"
SRC_DIR="$SITE_ROOT/src"
DEVLOG_BASE="$SRC_DIR/devlog"
IMAGES_BASE="$SRC_DIR/images/devlog"

mkdir -p "$DEVLOG_BASE" "$IMAGES_BASE"

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

  # Read project metadata + demo file list from .project.toml
  read -r PROJECT_SLUG PROJECT_NAME DEMO_FILES <<< "$(python3 -c "
import tomllib, sys
with open('$PROJECT_TOML', 'rb') as f:
    data = tomllib.load(f)
slug = data.get('slug', '$SLUG')
name = data.get('name', '$SLUG')
files = ','.join(data.get('demo', {}).get('files', []))
print(slug, name, files)
")"

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

    python3 - <<PY
import re, sys, tomllib

src   = "$MD"
date  = re.search(r'^\d{4}-\d{2}-\d{2}', "$BASENAME").group(0)
slug  = "$PROJECT_SLUG"
name  = "$PROJECT_NAME"
dest  = "$DEST_FILE"

with open(src) as f:
    content = f.read()

# Title from first H1
title_m = re.search(r'^# (.+)$', content, re.MULTILINE)
title = title_m.group(1).replace('"', '\\"') if title_m else slug

# Strip first H1
body = re.sub(r'^# .+\n\n?', '', content, count=1)

# Strip HTML comments
body = re.sub(r'<!--.*?-->', '', body, flags=re.DOTALL)

# Rewrite image paths: assets/foo.png → /images/devlog/<slug>/foo.png
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
  echo "  index → src/devlog/$PROJECT_SLUG/index.njk"

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
