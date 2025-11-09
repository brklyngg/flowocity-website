# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flowocity Website is a static marketing site for a fractional finance partner delivering a **full-stack finance function** (CFO + FP&A + Accounting) to SaaS and AI startups. Founded by the team that scaled Greenhouse Software through $160M ARR, Flowocity positions itself as an **embedded finance team** (not external consultants) offering operator-led expertise with cutting-edge systems and transparent deliverables.

The site is built with vanilla HTML/CSS/JavaScript (no build system) and deployed on Netlify.

**Repository**: https://github.com/brklyngg/flowocity-website
**Live Site**: https://www.flowocity.ai/

### Core Value Proposition
Flowocity installs a connected, automated finance stack:
- GAAP financials directly tied to the trial balance
- Cash flow forecasts and scenario models
- Investor-ready reports and board decks
- SaaS metrics reporting with AI consumption revenue/metrics expertise

Everything is transparent, editable, and collaborative—clients own their data and can drill down to transactions and assumptions. The result: reliable clarity and speed with the feel of a home-grown team.

## Development Workflow

### Local Development
Since this is a static site with no build process:
1. Clone repository: `git clone https://github.com/brklyngg/flowocity-website.git`
2. Open `index.html` directly in browser, or use a local server for testing:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```
3. Edit HTML/CSS/JS files directly
4. Test changes in browser

### Deployment
- **Platform**: Netlify (auto-deploys from GitHub main branch)
- **Process**: Push to main → Netlify auto-detects → Static files served
- No build step required

## Architecture

### Core Technology Stack
- **Pure HTML5/CSS3/JavaScript** - No frameworks or build tools
- **CSS**: Custom design system with CSS variables, Grid, Flexbox, no frameworks
- **JavaScript**: Vanilla ES6+, Intersection Observer for scroll animations
- **External Services**:
  - Netlify Forms (contact form handling)
  - Calendly (embedded booking widget)
  - N8N webhooks (tech stack analyzer backend)
  - Google Analytics 4 (tracking)

### Key Files
- `index.html` - Main landing page (309 lines)
- `styles.css` - Global styles with design system variables (1,307 lines)
- `script.js` - Main interactivity: mobile nav, service accordion, scroll effects (98 lines)
- `success.html` - Form submission confirmation with auto-redirect
- `_redirects` - Netlify URL routing rules
- `robots.txt` - Blocks `/tech_stack_analysis_preview/` from indexing
- `sitemap.xml` - SEO sitemap

### Directory Structure
```
flowocity-website/
├── index.html, styles.css, script.js    # Core site files
├── assets/                              # Images, logos, team photos, favicons
├── resources/                           # Content hub for articles/guides
│   ├── index.html                       # Resource hub landing page
│   ├── article-styles.css
│   └── revisiting_a_saastr_classic/     # Article directories
├── preview/                             # Design preview/testing pages
├── tech_stack_analysis_preview/         # N8N-integrated analyzer tool (noindex)
├── team_cv/                             # Team credentials page (noindex)
└── success/                             # Form success redirect
```

### Design System (CSS Variables)

Colors are defined in `:root` of `styles.css`:
```css
--primary-navy: #2F3A4A      /* Primary brand color */
--sky-blue: #4DB8FF          /* Accent/CTA color */
--growth-green: #62A896      /* Success/growth indicators */
--steel-gray: #7A8089        /* Secondary text */
--light-slate: #E8ECF1       /* Borders/dividers */
--off-white: #F7FAFD         /* Backgrounds */
```

Typography:
- **Karla** - Body text (400 weight)
- **Montserrat** - Headings (600-700 weight)
- H1: 48px, H2: 36px, H3: 28px, Body: 16px

Layout:
- Max-width container: 1200px
- Mobile breakpoint: 768px
- Padding: 20px sides

### JavaScript Functionality

**Main Script** (`script.js`):
1. **Mobile Navigation**: Hamburger menu toggle
2. **Service Cards Accordion**: Single-open pattern with icon rotation
3. **Smooth Scrolling**: Anchor link navigation
4. **Navbar Scroll Effect**: Dynamic blur/shadow after 50px scroll
5. **Intersection Observer**: Fade-in animations for `.service-card`, `.team-member`, `.stage`

**Analyzer Script** (`tech_stack_analysis_preview/analyzer-script.js`):
- N8N webhook integration for backend analysis
- Form submission with POST requests
- URL parameter management for analysis sharing

## Important Patterns

### Form Handling
Forms use Netlify Forms backend:
```html
<form method="POST" name="contact" data-netlify="true">
  <!-- Form fields -->
</form>
```
- Submissions trigger Netlify backend processing
- Redirect to `/success` page via `_redirects` file
- Success page fires GA4 `generate_lead` event

### Service Cards Accordion
Only one card can be open at a time. Implementation uses:
- `data-service` attributes for targeting
- Icon rotation animation (0deg to 180deg)
- Single-open pattern enforced in `script.js`

### Scroll Animations
Uses Intersection Observer (not CSS scroll-driven animations):
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.1 });
```

### N8N Integration
Tech stack analyzer uses three webhooks (update URLs in `analyzer-script.js`):
- `/webhook/analyze-stack` (POST) - Submit analysis request
- `/webhook/refresh-analysis` (POST) - Refresh existing analysis
- `/webhook/get-analysis` (GET) - Retrieve results via `?id=analysis_id`

## SEO & Metadata

### Critical SEO Elements
- **JSON-LD Schema**: ProfessionalService schema in `<head>`
- **Open Graph**: Social preview images in `/assets/social-preview.jpg`
- **Canonical URL**: https://www.flowocity.ai/
- **Google Analytics**: GA4 (ID: G-C3QRDX2F0Z)
- **Sitemap**: `/sitemap.xml` (excludes preview/internal pages)
- **Robots.txt**: Blocks `/tech_stack_analysis_preview/`

### Noindex Pages
Pages marked noindex/nofollow (for internal/preview use):
- `/team_cv/` - Team credentials showcase
- `/tech_stack_analysis_preview/` - N8N analyzer tool
- `/preview/` - Design variant testing
- Resource article previews (e.g., `/resources/revisiting_a_saastr_classic_preview/`)

## Common Tasks

### Adding a New Page
1. Create HTML file in appropriate directory
2. Link to `/styles.css` or create page-specific CSS
3. Add navigation link to navbar (if publicly accessible)
4. Update `sitemap.xml` if page should be indexed
5. Add to `robots.txt` if page should be blocked from crawlers
6. Commit and push to GitHub (auto-deploys to Netlify)

### Updating Styles
1. Edit `/styles.css` (global) or create page-specific CSS file
2. Use existing CSS custom properties for colors
3. Test responsive design at 768px breakpoint
4. Commit changes

### Adding a New Article to Resources
1. Create article directory in `/resources/article-name/`
2. Create `index.html` with article content
3. Link to `/resources/article-styles.css`
4. Add article card to `/resources/index.html`
5. Update sitemap if article should be indexed

### Testing Design Variants
1. Create preview file in `/preview/` or relevant `*_preview/` directory
2. Test variants without affecting production
3. Document changes in `CHANGES.md` if applicable
4. Move to production when ready

### Updating N8N Webhooks
1. Create/update webhook URLs in N8N workflow
2. Update URLs in `/tech_stack_analysis_preview/analyzer-script.js`
3. Test form submission and response handling
4. Verify error handling for failed requests

## External Integrations

### Netlify
- **Forms**: Automatic form handling (no server-side code needed)
- **Redirects**: Configured in `_redirects` file
- **Deployment**: Auto-deploy from GitHub main branch

### Calendly
- Embedded booking widget in contact section
- Uses iframe with inline styles for brand matching
- No API integration (display-only)

### Google Analytics 4
- Tracking ID: `G-C3QRDX2F0Z`
- Custom events: `generate_lead` on form submission
- Page view tracking automatic

### N8N Webhooks
- Backend for tech stack analyzer
- Handles form processing and analysis generation
- Returns results via JSON response or redirect

## Brand & Content Guidelines

### Core Identity and Purpose
Flowocity **standardizes excellence in startup finance**, offering a team that already knows how to work together and how to scale a business together, using a proven tech stack and refined deliverables.

**Key differentiators:**
- The partners **are** the operators—companies get serious star-power with the former CFO, Controller, and Assistant Controller of Greenhouse Software
- Provides a **complete, integrated finance stack** instead of isolated fractional services
- Makes high-quality finance infrastructure **accessible and repeatable** for growing startups

### Ideal Customer Profile (ICP)

**Stage**: Late seed to Series B; sometimes early Series C if lean

**Revenue**: $0–$10M ARR (or recently founded companies with rapid growth exceeding $10M ARR)

**Type**: SaaS, AI, or tech-enabled companies that have raised venture funding

**Decision makers**:
- Founders and CEOs
- VCs managing portfolios
- Organizers of startup accelerators

### Service Tiers (Integrated, Not Isolated)
Flowocity delivers a full-stack finance function, not separate fractional services:

1. **Foundational Accounting** - Accurate books, investor-ready close, reliable controls
2. **FP&A** - Forecasts, scenario models, consumption-based metrics, models that drill down to core data and assumptions
3. **Strategic CFO** - Board-level strategic guidance, fundraising support, decisions with board-level confidence

All deliverables are **transparent, editable, and instructive**—designed for collaborative use by the CEO and co-founders.

### Team Background (Emphasize Star-Power)
**Pat Leahy, Gary Gurevich, and Jason Cohen** are ex-Greenhouse Software finance leaders who scaled the company through **$160M ARR**.

- **Pat Leahy**: Former CFO of Greenhouse Software
- **Gary Gurevich**: Former Controller of Greenhouse Software
- **Jason Cohen**: Former Assistant Controller of Greenhouse Software

This is a **team that has succeeded together** and is ready to do it again and again. Each engagement is hands-on—Flowocity operates like an **embedded finance team**, not external consultants.

Team photos in `/assets/`:
- `pat-leahy.jpg`
- `gary-gurevich.jpeg`
- `jason-cohen.jpg`

### AI-SaaS Era Positioning
Built for the AI era of **lean, superpowered finance teams** who collaborate with founders:

- Hybrid revenue models (subscription + consumption)
- Ex-compute margins and FinOps efficiency
- Q2T3 growth metrics
- AI-assisted GTM analytics
- Volatile usage/compute cost management
- Firsthand knowledge of billing and reporting AI consumption revenue and metrics

### Key Differentiators
1. **Boutique but tech-forward**: Cutting-edge systems and tooling to produce reliable, collaborative financial models
2. **Transparent and collaborative**: Every deliverable is transparent, editable, and instructive—clients own their data
3. **Operator mindset with productized structure**: Scalable, repeatable excellence with hands-on operator experience
4. **Fast to useful results**: Reliable controls, transparent deliverables, models that drill right down to core data

## Tone & Messaging Guidelines

When writing content, copy, or messaging for Flowocity:

### Language to Use Consistently
- **"Embedded finance team"** (not "external consultants" or "outsourced service")
- **"Full finance stack"** (emphasize complete integration vs. isolated services)
- **"Operator-led"** (emphasize firsthand scaling experience)

### Positioning Emphasis
1. **Boutique but tech-forward**: Balance personal attention with cutting-edge systems
2. **Clarity, precision, and repeatability**: Emphasize reliable, standardized excellence
3. **Star-power of the team**: Highlight that Pat + Gary + Jason scaled Greenhouse together to $160M ARR
4. **Team continuity**: "A team who has succeeded together and is happy to do it again and again"
5. **Transparency and ownership**: Clients own their data, can drill down to transactions/assumptions

### Voice and Tone
- **Professional but approachable**: Confident expertise without being aloof
- **Precise and clear**: Finance is complex enough—messaging should be straightforward
- **Action-oriented**: Focus on outcomes and results ("get to useful results fast")
- **Collaborative**: Emphasize partnership with founders, not hierarchy

### Avoid
- Generic fractional service language ("we provide CFO services")
- Consultant-speak or buzzwords without substance
- Positioning as external/distant advisors
- Underselling the team's Greenhouse pedigree and star-power

## Performance Considerations

### Current Approach
- No build process or minification
- Single CSS file (1,307 lines) and single JS file (98 lines)
- CDN delivery for Google Fonts and Font Awesome
- Intersection Observer for efficient scroll animations
- No image lazy loading currently implemented

### Asset Optimization
- Images optimized manually before commit
- Cache-busting query params on team photos (`?v=2`)
- Favicons in multiple resolutions (16x16 to 512x512)
- Logos in SVG format for scalability

## Git Workflow

- **Main branch** = Production (auto-deploys to Netlify)
- Direct commits to main (no PR workflow currently)
- Recent development focus: CTA design iterations, N8N integrations, content expansion

## File Conventions

### Naming
- Lowercase with hyphens: `team-cv-styles.css`, `calendly-cta-preview.html`
- Directory names: `tech_stack_analysis_preview`, `revisiting_a_saastr_classic`

### Image Caching
Use query parameters to bust browser cache:
```html
<img src="/assets/team-photo.jpg?v=2">
```

### Preview Pages
Preview/testing pages should:
- Use `*_preview/` or `/preview/` directories
- Include noindex meta tag or robots.txt block
- Document purpose in README.md or CHANGES.md
