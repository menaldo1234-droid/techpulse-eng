# Antigravity Session Prompts — 0xHenry.dev

## Every session start (required)
```
This repo is 0xhenry.dev — Next.js 16 + Tailwind CSS 4 engineer study blog.
Read CLAUDE.md or GEMINI.md first and follow all rules.
Work on main branch. Commit + push when done.
Vercel auto-deploys on main push.

Tech stack: Next.js 16, Tailwind CSS 4, Prisma, NextAuth.js
Languages: EN (content/en/) + KO (content/ko/)
Brand: 0xHenry — Cyber Teal (#0d9488) accent
```

---

## Current automation system

This site runs a 24/7 AI automation pipeline:
- **Morning 06:00 KST**: daily-briefing.yml creates GitHub Issue with overnight changes
- **Midnight 00:00 KST**: nightly-research.yml creates research PR with topic candidates
- **Monday 18:00 KST**: content-brief.yml creates weekly content brief PR
- **Friday 09:00 KST**: site-health.yml runs build + content validation
- **On PR**: pr-auto-review.yml AI reviews all PRs automatically
- **On main push**: Vercel auto-deploys

Role division:
- **Antigravity (Gemini)**: Design polish, content quality, visual improvements, YouTube assets
- **Claude Code**: Architecture, workflows, data, feature implementation
- **Human**: Final approval, merge, business decisions

---

## Design System Reference

### Colors
- Accent: `#0d9488` (Cyber Teal) / hover: `#0f766e`
- Background: white / dark: `#030712` (gray-950)
- Card dark: `linear-gradient(145deg, rgba(30,30,40,1), rgba(20,20,28,1))`

### Typography
- Font: Inter (system-ui fallback)
- h1: letter-spacing -0.06em
- h2: letter-spacing -0.04em
- h3: letter-spacing -0.03em / accent color
- Body: line-height 1.8

### Components
- Cards: `.card-hover` — layered shadows, translateY(-2px) on hover
- Nav: `.nav-glass` — glassmorphism blur(20px) + saturate(180%)
- Prose: `.prose` — all markdown styling in globals.css

### Key Files
- `app/globals.css` — Global styles, card system, prose
- `app/layout.tsx` — Root metadata, SEO, OG tags
- `app/[lang]/layout.tsx` — Language layout with Nav + Footer
- `components/Nav.tsx` — Navigation with search, theme, language toggle
- `components/ShareButtons.tsx` — Social sharing
- `components/SearchModal.tsx` — Cmd+K search
- `lib/i18n.ts` — All UI strings (EN/KO)
- `lib/posts.ts` — Markdown post parser
- `content/en/study/` — EN study posts
- `content/ko/study/` — KO study posts
- `public/images/study/` — Post images (zed/, stm32/)
- `public/favicon.svg` — 0xH logomark
- `public/logo.svg` — 0x Henry.dev badge

### Do NOT touch
- `prisma/` — Database schema
- `app/api/` — API routes (auth, comments, bookmarks)
- `middleware.ts` — Auth middleware
- `.github/workflows/` — CI/CD pipelines

---

## Task Templates

### P0: Weekly Design Polish (repeating)
```
Read GEMINI.md rules first.

Checklist:
1. app/globals.css — card hover interactions, spacing, dark mode fixes
2. components/Nav.tsx — mobile menu polish, glassmorphism refinement
3. Dark mode — check all pages for contrast issues
4. Mobile responsive — test below 640px breakpoint
5. Typography — Inter spacing, heading hierarchy
6. commit + push
```

### P1: Blog Post Quality Review (repeating)
```
Review content/en/study/ and content/ko/study/ posts.

Rules:
- Fix AI-sounding sentences
- Shorten verbose introductions
- Verify code example accuracy
- Keep description under 150 characters
- Match EN/KO versions for consistency
- Do NOT create new posts or rename files
- commit + push
```

### P2: YouTube Thumbnail Blueprint
```
Create a YouTube thumbnail layout for a new video.

Topic: [INSERT TOPIC]
Style: Dark background, circuit/tech pattern, 0xHenry brand accent (#0d9488)

Output:
1. SVG layout file at public/images/youtube/[slug]-thumb.svg
2. Key text elements positioned for 1280x720
3. Use brand fonts and colors
4. commit + push
```

### P3: Motion Overlay / Lower Third
```
Create SVG motion overlays for video editing.

Output:
1. Lower third template: public/images/youtube/lower-third.svg
2. Point icon set: public/images/youtube/icons/
3. Transparent backgrounds, brand colors
4. commit + push
```

### P4: Infographic for Technical Concept
```
Create an infographic diagram for a blog/video.

Topic: [INSERT TOPIC]
Format: SVG, optimized for both web embed and video overlay
Colors: 0xHenry brand palette
Output: public/images/study/[topic]/[diagram-name].svg
commit + push
```

### P5: Brand Asset Variation
```
Create a seasonal/event variation of the 0xHenry logo.

Event: [INSERT EVENT/SEASON]
Base: public/logo.svg (0x Henry.dev badge)
Output: public/images/brand/logo-[event].svg
Rules: Keep core identity, add subtle themed element
commit + push
```
