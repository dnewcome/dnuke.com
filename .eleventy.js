const fs = require("fs");
const path = require("path");

function mergeSessionFiles() {
  const sessionsDir = path.join(__dirname, "sessions");
  const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith(".json"));
  if (files.length === 0) return;

  const datasets = files.map(f => JSON.parse(fs.readFileSync(path.join(sessionsDir, f), "utf8")));

  // Merge sessions array (each machine has unique session IDs)
  const sessions = datasets.flatMap(d => d.sessions || []);

  // Merge project_stats by summing per-project fields
  const project_stats = {};
  for (const d of datasets) {
    for (const [proj, stats] of Object.entries(d.project_stats || {})) {
      if (!project_stats[proj]) { project_stats[proj] = { ...stats }; continue; }
      for (const [k, v] of Object.entries(stats)) {
        project_stats[proj][k] = (project_stats[proj][k] || 0) + v;
      }
    }
  }

  // Merge sessions_by_day (array of {date, count}) by summing counts per date
  const sbdMap = {};
  for (const d of datasets) {
    for (const entry of (d.sessions_by_day || [])) {
      sbdMap[entry.date] = (sbdMap[entry.date] || 0) + entry.count;
    }
  }
  const sessions_by_day = Object.entries(sbdMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // Merge themes by summing counts (themes is array of {name, count})
  const themesMap = {};
  for (const d of datasets) {
    for (const entry of (d.themes || [])) {
      themesMap[entry.name] = (themesMap[entry.name] || 0) + entry.count;
    }
  }
  const themes = Object.entries(themesMap).map(([name, count]) => ({ name, count }));

  // Sum top-level stats; total_projects is unique project count
  const stats = {
    total_sessions: sessions.length,
    total_projects: Object.keys(project_stats).length,
  };
  for (const key of ["total_hours", "total_loc", "total_lines_added", "total_lines_deleted", "total_input_tokens", "total_output_tokens", "total_cache_read_tokens", "total_cache_creation_tokens"]) {
    stats[key] = datasets.reduce((sum, d) => sum + (d.stats?.[key] || 0), 0);
  }
  const allDates = sessions.map(s => s.date).filter(Boolean).sort();
  stats.date_range = { start: allDates[0] || null, end: allDates[allDates.length - 1] || null };

  const generated_at = datasets.map(d => d.generated_at).sort().at(-1);

  const merged = { generated_at, stats, project_stats, themes, sessions_by_day, sessions };
  fs.writeFileSync(path.join(__dirname, "sessions-data.json"), JSON.stringify(merged, null, 2));
}

module.exports = function(eleventyConfig) {
  eleventyConfig.on("eleventy.before", mergeSessionFiles);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/files");
  eleventyConfig.addPassthroughCopy({ "dashboard.html": "dashboard.html" });
  eleventyConfig.addPassthroughCopy({ "sessions-data.json": "sessions-data.json" });

  // Project demo files — all assets in src/<slug>/ served as static assets
  eleventyConfig.addPassthroughCopy("src/*/*.js");
  eleventyConfig.addPassthroughCopy("src/*/*.css");
  eleventyConfig.addPassthroughCopy("src/*/*.html");

  // Blog post collection — newest first
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Devlog collection — all projects, newest first
  eleventyConfig.addCollection("devlog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/devlog/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // All projects (synced + static) — drives home page cards
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*/index.md");
  });

  // One entry per devlog project (for per-project index pages)
  eleventyConfig.addCollection("devlogProjects", function(collectionApi) {
    const seen = new Set();
    return collectionApi.getFilteredByGlob("src/devlog/**/*.md")
      .sort((a, b) => b.date - a.date)
      .filter(post => {
        const slug = post.data.project;
        if (!slug || seen.has(slug)) return false;
        seen.add(slug);
        return true;
      });
  });

  // Format a date as "March 1, 2025"
  eleventyConfig.addFilter("dateFormat", function(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  });

  // Return first N items from an array
  eleventyConfig.addFilter("limit", function(arr, n) {
    return arr.slice(0, n);
  });

  // Strip HTML tags and return first N words as excerpt
  eleventyConfig.addFilter("excerpt", function(content, wordCount) {
    const n = wordCount || 60;
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(' ');
    if (words.length <= n) return text;
    return words.slice(0, n).join(' ') + '\u2026';
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk"
  };
};
