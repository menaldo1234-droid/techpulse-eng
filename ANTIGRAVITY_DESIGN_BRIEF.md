# TechBlips - Antigravity Design Brief

## Overview
TechBlips (techblips.com) is a tech media site covering AI, developer tools, and emerging technology.
Built with Hugo + PaperMod theme, hosted on Cloudflare Pages.

## Current State
- Custom CSS: `assets/css/extended/custom.css` (589 lines)
- Brand color: Purple (#6c5ce7)
- Font: Inter with negative letter-spacing
- Has glassmorphic navbar, staggered card animations, dark mode
- Missing: custom logo, favicon, hero imagery, author cards

## Design Goals
Transform from "customized blog template" to "premium tech media site that feels handcrafted."
**The site must NOT look AI-generated.** It should feel like a human designer spent weeks on it.

## Specific Requests

### Brand Identity
- Custom SVG logo based on the lightning bolt (⚡) motif - NOT a generic icon
- Custom favicon (SVG preferred for crisp rendering at all sizes)
- Consistent visual language across all pages

### Color System
- Keep purple (#6c5ce7) as primary
- Add category-specific accent colors:
  - AI / Artificial Intelligence → Purple (#6c5ce7)
  - Developer Tools → Teal (#0ea5e9)
  - Technology / Trending → Orange (#f59e0b)
- Use these accents on post cards, category pages, and tags

### Typography
- Load Inter explicitly via @font-face or Google Fonts (currently relies on system fonts)
- Consider a display font for headings (e.g., Inter Display, or a complementary serif)
- Proper type scale: h1-h6 with consistent vertical rhythm

### Hero Section
- Subtle animated background (CSS-only, no JS libraries)
- Consider: animated gradient mesh, floating geometric shapes, or subtle particle effect
- Should feel organic and artistic, NOT corporate or template-like

### Post Cards
- Category-specific icon or color accent on each card
- Subtle hover micro-interactions (already has some, refine them)
- Consider different card layouts for featured vs regular posts

### Author Profile Card
- Add to bottom of each post (Hugo partial: `layouts/partials/author-card.html`)
- Photo placeholder, name, short bio, social links
- Styled consistently with site design

### Newsletter Signup
- Embed in footer or as a floating section between posts
- Clean, minimal design - not a popup
- Hugo partial: `layouts/partials/newsletter.html`

### Code Blocks
- Enhanced syntax highlighting that matches brand colors
- Consider a custom theme instead of Dracula
- Copy button already exists (PaperMod feature)

### Interactive Elements
- Smooth scroll-triggered animations (CSS only where possible)
- Reading progress bar at top of posts
- Back-to-top button with smooth animation

## Files to Modify
| File | Purpose |
|------|---------||
| `assets/css/extended/custom.css` | Main custom styles |
| `layouts/partials/extend_head.html` | Font loading, meta tags |
| `layouts/partials/footer.html` | Footer with newsletter |
| `layouts/_default/list.html` | Post listing with category colors |
| `static/favicon.svg` | New (create) |
| `static/logo.svg` | New (create) |
| `layouts/partials/author-card.html` | New (create) |
| `layouts/partials/newsletter.html` | New (create) |

## Anti-Patterns to Avoid
- Generic gradient backgrounds that scream "AI template"
- Overly symmetric, perfectly balanced layouts (add intentional asymmetry)
- Stock illustrations or generic tech imagery
- Cookie-cutter card designs
- Excessive use of blur/glassmorphism (subtle is fine, overdone is obvious)
- Rainbow color schemes with no cohesion

## How to Use This in Antigravity
1. Open Antigravity IDE
2. Import this repo (clone from https://github.com/techblips/techblips.git)
3. Paste this brief as context
4. Ask Antigravity to implement each section iteratively
5. Use the browser preview to verify each change
6. After Antigravity makes changes, run gstack's `/design-review` in Claude Code to audit

## Technical Constraints
- Hugo static site - no JavaScript frameworks
- PaperMod theme as base - extend, don't replace
- CSS-first approach (minimal JS)
- Must maintain mobile responsiveness
- Dark mode support required
- Performance: keep total CSS under 50KB
