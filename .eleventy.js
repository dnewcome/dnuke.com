module.exports = function(eleventyConfig) {
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
