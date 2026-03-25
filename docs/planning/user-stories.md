# User Stories

**Last Updated:** 2026-03-25

Status legend: `[x]` Implemented | `[ ]` Not yet implemented | `[~]` Partial

---

## Navigation

### US-1.1: Persistent navigation

**As a** visitor,
**I want to** see a sticky navigation bar on every page,
**so that** I can quickly jump to any section or page.

**Status:** [x]

**Acceptance Criteria:**
- [x] Nav bar sticks to top on scroll
- [x] Links to all main sections (About, Roster, Join, FAQ)
- [x] "Join" CTA button prominent in nav
- [x] Hamburger menu on mobile
- [x] Shared component used across all pages

---

### US-1.2: Page transitions

**As a** visitor,
**I want** smooth transitions between pages,
**so that** the site feels polished and professional.

**Status:** [ ]

**Acceptance Criteria:**
- [ ] Transition animation between homepage and roster page
- [ ] No layout shift during navigation
- [ ] Fast perceived load time

---

## Hero Section

### US-2.1: Cinematic hero landing

**As a** prospective recruit,
**I want to** land on a visually striking hero section,
**so that** I immediately understand this is a serious, professional clan.

**Status:** [x]

**Acceptance Criteria:**
- [x] Full-viewport hero with background video
- [x] Primary headline with staggered entrance animation
- [x] Sub-headline describing clan identity
- [x] "Apply to Join" primary CTA linking to Discord/join section
- [x] "Learn More" secondary CTA scrolling to About

---

### US-2.2: Terminal HUD effect

**As a** visitor,
**I want to** see a tactical terminal typing effect in the hero,
**so that** the militaristic theme is reinforced immediately.

**Status:** [x]

**Acceptance Criteria:**
- [x] Terminal with typing animation showing clan status lines
- [x] HUD frame with corner markers and status indicators
- [x] Stats grid (active members, squad leads, recruits, established year)
- [x] Auto-loops after completing all lines

---

## About Section

### US-3.1: Clan identity

**As a** prospective recruit,
**I want to** read about the clan's ethos and values,
**so that** I can decide if I align with their play style.

**Status:** [x]

**Acceptance Criteria:**
- [x] Section tag "WHO WE ARE" with accent styling
- [x] Headline and descriptive paragraphs about clan philosophy
- [x] Three pillars: Discipline, Teamwork, Improvement
- [x] Scroll-triggered fade-in animation

---

## Requirements / Recruitment

### US-4.1: Join requirements

**As a** prospective recruit,
**I want to** see clear requirements for joining,
**so that** I know if I qualify before applying.

**Status:** [x]

**Acceptance Criteria:**
- [x] Checklist of requirements (hours, mic, age, region, attitude)
- [x] Clear visual hierarchy with checkmarks
- [x] Scroll-triggered animation

---

### US-4.2: Recruitment process steps

**As a** prospective recruit,
**I want to** understand the step-by-step recruitment process,
**so that** I know what to expect after applying.

**Status:** [x]

**Acceptance Criteria:**
- [x] Numbered steps: Apply, Interview, Trial, Full Member
- [x] Each step has title and description
- [x] Ghost numbers for visual hierarchy
- [x] Discord CTA button at the end of the section

---

## Roster

### US-5.1: Roster preview on homepage

**As a** visitor,
**I want to** see a preview of key clan members on the homepage,
**so that** I get a sense of the team before diving deeper.

**Status:** [~]

**Acceptance Criteria:**
- [x] Grid of 3 featured member cards
- [x] "View Full Roster" link card
- [~] Member cards show avatar, role tag, callsign, hours, join date
- [ ] Real member data populated (currently placeholder callsigns)

---

### US-5.2: Full roster page

**As a** visitor or clan member,
**I want to** browse the complete roster with search,
**so that** I can find specific members or see the full team.

**Status:** [x]

**Acceptance Criteria:**
- [x] Dedicated /roster page
- [x] All members displayed in grid layout
- [x] Search by callsign or role
- [x] Filtered count shown
- [x] Empty state when no matches
- [x] Member cards with avatar placeholder, role tag, callsign, stats
- [x] Scroll-triggered card animations

---

### US-5.3: Roster data management

**As a** clan admin,
**I want to** easily update the roster,
**so that** the site reflects current membership.

**Status:** [~]

**Acceptance Criteria:**
- [~] Roster data in a single, easy-to-edit location (currently inline in page component)
- [ ] Roster data extracted to a separate data file or constant
- [ ] Types defined for member structure (FaqItem and Member types exist)

---

## FAQ

### US-6.1: FAQ accordion

**As a** prospective recruit,
**I want to** read answers to common questions,
**so that** I can resolve doubts without joining Discord first.

**Status:** [x]

**Acceptance Criteria:**
- [x] Accordion with expand/collapse behavior
- [x] Only one item open at a time
- [x] Covers timezones, DLC/mods, recruitment process, competitive status
- [x] Accessible with aria-expanded attribute
- [x] Scroll-triggered animation

---

## Discord / Community

### US-7.1: Discord CTA banner

**As a** visitor ready to join,
**I want to** see a prominent Discord call-to-action,
**so that** I can easily join the community.

**Status:** [x]

**Acceptance Criteria:**
- [x] Dedicated section with Discord join button
- [x] Social links (Discord, Steam, Twitter)
- [x] Noise overlay for visual texture
- [x] Scroll-triggered animation

---

## Footer

### US-8.1: Site footer

**As a** visitor,
**I want to** see consistent footer information,
**so that** I can find links, copyright, and social info.

**Status:** [x]

**Acceptance Criteria:**
- [x] Footer component shared across pages
- [x] Copyright and clan branding
- [ ] Navigation links duplicated in footer
- [ ] Social links in footer

---

## Design System

### US-9.1: Dark tactical theme

**As a** visitor,
**I want** the entire site to have a cohesive dark militaristic look,
**so that** it feels premium and matches the clan's identity.

**Status:** [x]

**Acceptance Criteria:**
- [x] Dark background (#09090B) with off-white text
- [x] Cyber Yellow (#FFD700) accent color
- [x] Custom CSS properties for all design tokens
- [x] Noise overlay textures
- [x] Sharp corners (rounded-none / rounded-sm)
- [x] Fast transitions (150-200ms)

---

### US-9.2: Responsive design

**As a** mobile user,
**I want** the site to work well on my phone,
**so that** I can browse and apply from any device.

**Status:** [~]

**Acceptance Criteria:**
- [x] Stacked layouts on mobile
- [x] Hamburger menu for nav on small screens
- [~] Grid adjustments for tablet (2-col) and desktop (4-col)
- [ ] Verified on actual mobile devices / responsive testing

---

### US-9.3: Typography system

**As a** visitor,
**I want** consistent, tactical typography,
**so that** the text reinforces the militaristic brand.

**Status:** [x]

**Acceptance Criteria:**
- [x] Headline fonts (Bebas Neue, Barlow Condensed)
- [x] Body font (DM Sans)
- [x] Mono font (IBM Plex Mono)
- [x] Custom brand font (NASTUP) loaded locally
- [x] Section tags in uppercase monospace with accent color

---

## Animations

### US-10.1: Scroll-triggered animations

**As a** visitor,
**I want** sections to animate in as I scroll,
**so that** the page feels dynamic and engaging.

**Status:** [x]

**Acceptance Criteria:**
- [x] Framer Motion used for all scroll animations
- [x] Sections fade in on viewport entry
- [x] `once: true` — animations don't replay on re-scroll
- [x] Staggered delays within sections

---

### US-10.2: Hero entrance choreography

**As a** visitor,
**I want** the hero section to animate in with cinematic timing,
**so that** the first impression is impactful.

**Status:** [x]

**Acceptance Criteria:**
- [x] Tag, headline, subtitle, CTAs, stats — each staggered
- [x] HUD panel fades in after main content
- [x] Terminal starts typing after initial delay
- [x] Smooth easeOut curves

---

### US-10.3: Hover micro-interactions

**As a** visitor,
**I want** interactive elements to respond to hover,
**so that** the site feels alive and clickable.

**Status:** [~]

**Acceptance Criteria:**
- [x] Button hover states (color flip, border accent)
- [x] Card hover states (border accent change)
- [~] FAQ accordion hover feedback
- [ ] Social icon hover animations
- [ ] Nav link hover underline/highlight

---

## Performance

### US-11.1: Fast initial load

**As a** visitor,
**I want** the site to load quickly,
**so that** I don't leave before seeing the content.

**Status:** [ ]

**Acceptance Criteria:**
- [ ] Lighthouse performance score 90+
- [ ] Hero video optimized (compressed, lazy or priority)
- [ ] Fonts preloaded / swap strategy
- [ ] No unused JavaScript shipped
- [ ] Images optimized with Next.js Image component

---

## Code Quality

### US-12.1: Component architecture

**As a** developer,
**I want** reusable, well-structured components,
**so that** the codebase is maintainable.

**Status:** [~]

**Acceptance Criteria:**
- [x] Navbar extracted as shared component
- [x] Footer extracted as shared component
- [ ] Section components extracted from monolithic page.tsx
- [ ] Roster data moved to separate data file
- [ ] globals.css reduced — migrate CSS classes to Tailwind utilities
- [ ] cn() utility actually used in components
