# Research

Updated: 2026-03-26 12:30
Status: active

## Active Summary
<!-- aif:active-summary:start -->
Topic: Hero Section Visual Enhancement - Test Section
Goal: Build a sandboxed test section (`HeroTest.tsx`) to prototype multiple visual variants, then pick the best one for the real hero.
Constraints: Must reuse existing grid background + grain + vignette from current hero. All animations should be Framer Motion based.
Decisions:
- Test section will live as a standalone component
- 5 initial visual variants planned (Ember RATS, Night Fire, Sniper Sweep, Strobe Pulse, Tracers)
- All variants use same dark tactical aesthetic with Cyber Yellow (#FFD700) accent
Open questions:
- Flash color: white, orange, or yellow-green?
- Flash trigger: random intervals, timed, or scroll-based?
- Which variant wins → decision made after testing
Success signals: Can visually compare 5+ variants side by side, pick clearly superior option
Next step: /aif-plan build test section with visual variants
<!-- aif:active-summary:end -->

## Sessions
<!-- aif:sessions:start -->
### 2026-03-26 12:30 — Hero Visual Enhancement Research
What changed:
- Clarified user's vision: night combat artillery flash effect (shells explode, brief illumination, back to darkness)
- Agreed on approach: build test section with 5 variants to compare and pick best
Key notes:
- User wants sandboxed test section before committing to one visual style
- All variants reuse existing hero grid/grain/vignette layers
- 5 planned variants: Ember RATS (muted glow), Night Fire (shell flash), Sniper Sweep (searchlight), Strobe Pulse, Tracers
Links (paths):
- `/src/components/sections/Hero.tsx` — current hero
- `/src/app/globals.css` lines 317-520 — current hero CSS
</section>
<!-- aif:sessions:end -->
