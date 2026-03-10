# Style Guide

## Global Variables (CSS Custom Properties)

**Colors**
- `--background`: `#09090B` (Vantablack / Deep Charcoal)
- `--foreground`: `#FAFAFA` (Off-white)
- `--accent-primary`: `#FFD700` (Cyber/Tactical Yellow)
- `--accent-secondary`: `#1E1E1E` (Gunmetal Grey)
- `--border`: `#27272A` (Zinc-800)
- `--muted-text`: `#A1A1AA` (Zinc-400)

**Typography**
- `--font-headline`: `Space Grotesk` or `Oswald`
- `--font-body`: `Inter` or `Geist`
- `--font-mono`: `JetBrains Mono`

## Typography Rules
- **Headlines (H1/H2)**: Bold, uppercase, tracking-tight. Color: Foreground.
- **Section Tags (Small headers)**: Uppercase, tracking-widest, color: Accent Primary (`#FFD700`). Monospace font.
- **Body Text**: Muted text (`text-zinc-400`), highly legible line-height (`leading-relaxed`).

## Component Patterns

### Buttons
- **Primary**:
  - Background: `bg-[#FFD700]`
  - Text: `text-black font-bold uppercase`
  - Shape: `rounded-none` (sharp corners)
  - Hover: High-contrast flip (e.g., `bg-white` or dark with yellow border).
- **Secondary**:
  - Background: Transparent
  - Border: `border border-zinc-700`
  - Text: `text-white uppercase`
  - Hover: `border-[#FFD700] text-[#FFD700]`

### Cards (Stats, Roster, Requirements)
- Background: `bg-zinc-900` or `bg-zinc-900/50`
- Border: `border border-zinc-800`
- Radius: `rounded-none` or `rounded-sm` (0px to 4px max)
- Hover: Border changes to primary accent (`hover:border-[#FFD700]`).

## Visual Effects
- **Glows**: Very subtle, mostly restricted to the primary accent color or hover states.
- **Textures**: Background should feel gritty. Consider a fixed noise overlay (`bg-noise` pattern or an SVG overlay).
- **Transitions**: Sharp, fast (`duration-150` or `duration-200`). Avoid soft/slow fades unless for scroll reveal.

## Spacing and Layout
- **Containers**: Max-width constraints (`max-w-7xl`).
- **Section Padding**: `py-24` or `py-32` for deep separation between sections.
- **Grids**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` for data-heavy sections (Roster, Stats).

## Changelog
- **[Date]**: Initial Style Guide created based on tactical/militaristic moodboard.
