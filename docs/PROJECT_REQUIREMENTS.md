# Project Requirements

## 1. Project Overview
- **What:** Landing page & community hub for "RATS" (an elite Squad clan).
- **Who:** Hardcore Squad players, recruits, and existing clan members.
- **Goal:** Drive recruitment to Discord and establish a highly professional, dominating presence.

## 2. Tech Stack
| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | Core framework, React environment, routing. |
| Tailwind CSS | Utility-first styling, design system implementation. |
| Framer Motion | High-end scroll and interaction animations. |
| Lucide React | Minimalist icons (arrows, menus, external links). |

## 3. Dependencies
```bash
npx create-next-app@latest rats-site --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd rats-site
npm install framer-motion lucide-react clsx tailwind-merge
```

## 4. Design System
Refer to `docs/STYLE_GUIDE.md` for colors, typography, and component specs.

## 5. Page Sections
1. **[Navigation Bar](../website-sections/1.navigation-bar.md)** - Sticky top nav, links, join CTA.
2. **[Hero Section](../website-sections/2.hero-section.md)** - Big impact, background media, primary headline, Discord CTA.
3. **[About Us](../website-sections/3.about-us.md)** - Clan description, ethos, key statistics grid.
4. **[Requirements](../website-sections/4.requirements.md)** - Criteria to join (age, mic, hours, etc.).
5. **[Roster](../website-sections/5.roster.md)** - Display of core leadership/members.
6. **[FAQ](../website-sections/6.faq.md)** - Accordion of common questions.
7. **[Footer](../website-sections/7.footer.md)** - Bottom links, socials, copyright.

## 6. File Structure (Recommended)
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (reusable buttons, cards)
│   └── sections/ (Hero, About, Requirements, etc.)
└── lib/ (utils like cn for tailwind)
```

## 7. Responsive Requirements
- Mobile (`sm`): Stacked layouts, hamburger menu for nav.
- Tablet (`md`): 2-column grids for features/roster.
- Desktop (`lg`, `xl`): Full width layouts, 4-column grids, large typography.
