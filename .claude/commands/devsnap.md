Run a devlog snapshot for the current project.

Steps:
1. Determine the current project:
   - Check for `.project.toml` in the current working directory. If found, read the `slug` and `name` fields.
   - If not found (e.g. we're in the dnuke.com repo itself), use slug `dnuke-com` and name `dnuke.com`.
2. Run `bash scripts/devsnap.sh --window` passing any note the user provided as the first argument. If the user gave a note or philosophical musing, pass it with `--note "<their text>"`. The `--window` flag captures the live browser window (real WebGL visuals). If the user is not at their desk or mentions no browser is open, omit `--window` and let it fall back to Chrome headless.
3. Read the generated markdown file (it will be the most recently modified file in devlog/).
4. Read `git log --oneline -8` and `git diff HEAD~1 HEAD --stat` for context.
5. Rewrite the "What happened" section of the entry with a real narrative paragraph — written in first person from the builder's perspective, hype/narrative tone, no clickbait. Focus on: what was hard, what was surprising, what it unlocks. 2-4 sentences.
6. Write a tweet draft (≤280 chars) in the "Tweet draft" section. Tone: narrative, genuine enthusiasm, no buzzwords or hype tricks. Should feel like a builder talking to other builders. Include what it is, what changed, and why it's interesting. Can include a short URL placeholder like [link].
7. Save the updated devlog/ entry file.
8. Show the user the final tweet draft and the path to the entry file.
9. Ask if they want to publish it to dnuke.com now. If yes:
   - Ensure `src/devlog/<slug>/` exists (create it with an `index.njk` if not — model it on `src/devlog/threequencer/index.njk`, substituting the slug and name).
   - Ensure `src/images/devlog/<slug>/` exists.
   - Copy the screenshot from `devlog/assets/<filename>.png` to `src/images/devlog/<slug>/`.
   - Create `src/devlog/<slug>/<filename>.md` with this frontmatter prepended, then the body of the devlog/ entry:
     ```
     ---
     layout: devlog-post.njk
     title: "<commit message or note, stripped of conventional commit prefix>"
     date: <YYYY-MM-DD>
     project: <slug>
     project_name: <name>
     tags:
       - devlog
       - <slug>
     ---
     ```
   - Fix the image path in the body: change `assets/<filename>.png` → `/images/devlog/<slug>/<filename>.png`.
   - Run `npm run build`.
   - Commit all new/changed files with a message like `feat: add devlog entry for <slug> — <title>`.
   - Push to git.

If the user's note sounds philosophical or decision-oriented (e.g. "I'm trying to decide...", "thinking about..."), treat the entry as a design journal post instead — focus on the question being wrestled with, the tradeoffs, and what's drawing them in different directions. Still write a tweet that invites conversation rather than announces a ship.
