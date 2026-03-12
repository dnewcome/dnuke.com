#!/usr/bin/env python3
"""
Migrate posts/ -> src/blog/posts/ and posts/images/ -> src/images/

Fixes:
  - tags: comma-separated string -> YAML list
  - image paths: images/foo.png -> /images/foo.png (absolute, works from any URL depth)
  - strips WordPress-specific frontmatter keys (url, id, categories)
  - keeps: title, date, tags
"""

import os
import re
import shutil

SRC_POSTS = "posts"
SRC_IMAGES = os.path.join(SRC_POSTS, "images")
DST_POSTS = os.path.join("src", "blog", "posts")
DST_IMAGES = os.path.join("src", "images")


def parse_frontmatter(raw):
    """Return (meta_dict, body_str). meta values are raw strings."""
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', raw, re.DOTALL)
    if not m:
        return {}, raw
    fm_raw, body = m.group(1), m.group(2)
    meta = {}
    for line in fm_raw.splitlines():
        kv = re.match(r'^(\w+):\s*(.*)', line)
        if kv:
            meta[kv.group(1)] = kv.group(2).strip()
    return meta, body


def normalize_tags(tag_str):
    """'ai, machine-learning, foo' -> ['ai', 'machine-learning', 'foo']"""
    if not tag_str or not tag_str.strip():
        return []
    return [t.strip() for t in tag_str.split(',') if t.strip()]


def build_frontmatter(meta, tags):
    lines = ['---']
    title = meta.get('title', 'Untitled').strip('"').strip("'")
    lines.append(f'title: "{title}"')
    date = meta.get('date', '')
    if date:
        lines.append(f'date: {date}')
    if tags:
        tag_list = ', '.join(f'"{t}"' for t in tags)
        lines.append(f'tags: [{tag_list}]')
    lines.append('---')
    return '\n'.join(lines) + '\n'


def fix_image_paths(body):
    """Rewrite relative images/ references to absolute /images/."""
    # Markdown images: ![alt](images/foo.png)
    body = re.sub(r'!\[([^\]]*)\]\(images/', r'![\\1](/images/', body)
    # Also handle any src="images/..." in raw HTML if present
    body = re.sub(r'src="images/', 'src="/images/', body)
    return body


def migrate():
    os.makedirs(DST_POSTS, exist_ok=True)
    os.makedirs(DST_IMAGES, exist_ok=True)

    # Copy images
    img_count = 0
    if os.path.isdir(SRC_IMAGES):
        for fname in os.listdir(SRC_IMAGES):
            src = os.path.join(SRC_IMAGES, fname)
            dst = os.path.join(DST_IMAGES, fname)
            shutil.copy2(src, dst)
            img_count += 1
    print(f"Copied {img_count} images -> {DST_IMAGES}")

    # Migrate posts
    post_files = sorted(f for f in os.listdir(SRC_POSTS) if f.endswith('.md'))
    skipped = 0
    migrated = 0

    for fname in post_files:
        src_path = os.path.join(SRC_POSTS, fname)
        dst_path = os.path.join(DST_POSTS, fname)

        with open(src_path, encoding='utf-8') as f:
            raw = f.read()

        meta, body = parse_frontmatter(raw)
        if not meta:
            print(f"  SKIP (no frontmatter): {fname}")
            skipped += 1
            continue

        tags = normalize_tags(meta.get('tags', ''))
        body = fix_image_paths(body)
        new_content = build_frontmatter(meta, tags) + '\n' + body.lstrip('\n')

        with open(dst_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        migrated += 1

    print(f"Migrated {migrated} posts -> {DST_POSTS}  ({skipped} skipped)")


if __name__ == '__main__':
    migrate()
