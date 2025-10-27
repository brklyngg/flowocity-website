# Team CV Preview Page

## Overview
This is a preview page at `https://www.flowocity.ai/team_cv` that showcases the combined experience of Team Flowocity. The page is **not indexed** by search engines (noindex, nofollow meta tags).

## Features
- Combined team resume format
- Company logos organized by fundraising stage reached during team tenure
- Key achievements and competencies
- Fully responsive design matching Flowocity brand
- Professional layout suitable for partner/client presentations

## Company Stages
Companies are organized into the following categories:
1. **Late Stage Growth** - Series D+ & Majority Investment
2. **Growth Stage** - Series B & C
3. **Early Stage** - Seed through Series A
4. **Additional Experience** - Advisory & consulting roles

## Adding Company Logos
Company logo files should be placed in `/assets/logos/` directory as SVG files for best quality.

Example filenames:
- `greenhouse.svg`
- `farmers-dog.svg`
- `wyng.svg`

The HTML includes fallback text if logo images are not found.

## Customization Notes
- Update company names and scales in the HTML
- Add actual company logos to `/assets/logos/`
- Adjust stage groupings based on actual experience
- Modify stats in the hero section as needed

## File Structure
```
team_cv/
├── index.html          # Main CV page
├── team-cv-styles.css  # Custom styles for CV page
└── README.md           # This file

assets/
└── logos/              # Company logo directory
```

## SEO & Indexing
The page includes `<meta name="robots" content="noindex, nofollow">` to prevent search engine indexing until ready for public access.

## Navigation
- Logo in header links back to main homepage (#top)
- Navigation links work with main site sections
- CTA button links to contact form on main site
