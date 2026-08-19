# Source material: what RATS has already written about squads and playstyle

Research for [#47](https://github.com/stubbornweb/ratsquad.gg/issues/47), a child of map
[#46 — Wayfinder: the Squad Assessment tool](https://github.com/stubbornweb/ratsquad.gg/issues/46).

**This is an inventory, not doctrine.** Nothing here is invented. Where the clan has
not written something down, that absence is recorded as a finding. Contradictions
between sources are reported, not resolved — resolving them is
[#49](https://github.com/stubbornweb/ratsquad.gg/issues/49)'s job.

Sources swept: every file on every branch and in the whole git history of
`stubbornweb/ratsquad.gg`; every issue (52 of them) with all comments; all PRs;
GitHub Discussions (disabled) and the wiki (disabled).

---

## 0. Summary of what exists and what does not

| Item #47 asked for | Status |
| --- | --- |
| «Improve Recruitment Form» documentation | **Not found.** Not in the repo, not in history, not in the tracker. Quoted second-hand only. |
| Its squad-type descriptions / responsibilities / role descriptions | **Not found** as a primary document — see §1. |
| Full clan squad doctrine, verbatim | **Found**, complete — §2. |
| Expanded EN + UA squad-type write-ups (mission / responsibilities / typical tasks / «best suited for» / strengths / weaknesses) | **Not found.** #47 asserts they were «supplied during this map's charting session»; they exist nowhere in the tracker or the repo — §3. |
| The three Mermaid playstyle-test schemas | **Not found.** Only their conclusions survive — §4. |
| #17's axis fixes | **Found**, complete — §4. |
| `docs/` material on recruitment / playstyle / roles / squad types | **Found**, and it is thinner than expected — §5. |
| The 14 роль labels + Ukrainian glosses on `prototype/registration-profile` | **Found**, verbatim — §6. |

---

## 1. The «Improve Recruitment Form» document — NOT FOUND

**It does not exist in anything this repo or its tracker can reach.**

Searches performed, all negative:

- `git grep -il "improve recruitment"` over `git rev-list --all` — no hits in any blob,
  on any branch, in the entire history.
- `git log --all --diff-filter=A --name-only` filtered for `recruit|form|squad|role|playstyle|doctrine`
  — the only ever-added files matching are `scripts/list-discord-roles.ts`,
  `src/consts/squad.ts`, `src/consts/squad.test.ts`,
  `src/db/schema/create_table_member_roles.ts`, `src/db/schema/create_table_squads.ts`,
  and two agent definitions. No document.
- All 52 issues dumped with comments and grepped for `improve recr`, `recruitment form`,
  `mermaid`, `Battlefield Role`, `Assessment Confidence`. The **only** hit for any of
  these across the whole tracker is issue #47's own body.
- `gh search issues --owner stubbornweb "recruitment form"` — returns #47 only.
- Discussions are disabled (HTTP 410); the wiki is disabled (`has_wiki: false`).

### What we have instead: second-hand quotation

The document is referred to throughout map #46 and its children as **«the source spec»**.
Its contents are known *only* through what those tickets quote from it. Collected here,
each with its exact location, because this is the entire surviving record:

| Claim attributed to the source spec | Where it is quoted |
| --- | --- |
| A three-layer sketch: **Battlefield Identity / Battlefield Role / Kit**, where Battlefield Role = Assault / Support / AT / Medic / Engineer / Driver / Gunner / Commander | [#46 body](https://github.com/stubbornweb/ratsquad.gg/issues/46), «Settled when this map was chartered»; restated in [#15 resolution](https://github.com/stubbornweb/ratsquad.gg/issues/15#issuecomment-5343650560), «Consequences» |
| Ten hidden attributes: Aggression, Patience, Independence, Team Orientation, Leadership, Adaptability, Strategic Thinking, Communication, Mechanical Confidence, Vehicle Affinity | [#48 body](https://github.com/stubbornweb/ratsquad.gg/issues/48), question 1 preamble |
| 15–20 questions; **never mention Frontline or Backline** in a question | [#50 body](https://github.com/stubbornweb/ratsquad.gg/issues/50), rule + question 1 |
| Sketched напрямок profiles: «Frontline: High Aggression + High Communication + Medium/High Team Orientation», «Flex: Very High Adaptability + Balanced across most» | [#49 body](https://github.com/stubbornweb/ratsquad.gg/issues/49), item 1 |
| Result screen shows `Frontline 91% ███████ / Flank 86% ██████ / Flex 82% █████` | [#52 body](https://github.com/stubbornweb/ratsquad.gg/issues/52), item 1; also [#49](https://github.com/stubbornweb/ratsquad.gg/issues/49) |
| «the player never sees this calculation» — attribute scores hidden from the player, visible to the captain | [#52 body](https://github.com/stubbornweb/ratsquad.gg/issues/52), item 2 |
| Disagree path: «Do you agree? ○ Yes ○ I'd prefer Backline ○ I'd prefer Vehicle» | [#52 body](https://github.com/stubbornweb/ratsquad.gg/issues/52), item 5 |
| **Role descriptions** nested per напрямок: «Inside Frontline: LAT ★★★★★, Rifleman ★★★★★, Grenadier ★★★★☆…» | [#51 body](https://github.com/stubbornweb/ratsquad.gg/issues/51), item 2 |
| The spec's kit list is **eight** — LAT, HAT, Medic, GL, Rifleman, Marksman, MG, Engineer — omitting Tech light/middle/heavy, Pilot, SL, Mortar | [#51 body](https://github.com/stubbornweb/ratsquad.gg/issues/51), item 3 |
| Captain dashboard: assessment percentages, attribute stars, preferred kits, player's own stated preference, «Assessment Confidence 94%» | [#46 body](https://github.com/stubbornweb/ratsquad.gg/issues/46), «Not yet specified»; figure in [#49](https://github.com/stubbornweb/ratsquad.gg/issues/49) |
| «RATS Tactical Profile» — the player leaves with something memorable and shareable, «almost like a personality test» | [#46 body](https://github.com/stubbornweb/ratsquad.gg/issues/46), «Not yet specified» |
| Recruit application: six fields — in-game nickname, game hours, age, country, city, previous clans (optional, yes/no + details) — and «nothing more should be requested during the first registration» | [#57 body](https://github.com/stubbornweb/ratsquad.gg/issues/57) |
| Steam ID deliberately deferred to the extended profile | [#57 body](https://github.com/stubbornweb/ratsquad.gg/issues/57), item 4 |

**The prototype #47 says the document contains is not quoted anywhere.** No ticket
reproduces a prototype, a screen, or a wireframe from it — only the bullet facts above.

**Where it probably is:** Discord, or an external doc (Google Docs / Notion) held by a
clan member. Nothing in the repo or tracker names a location, an author, or a link.
**This needs a human in RATS to produce it.** Until then, every «the source spec says…»
in #48–#52 is unverifiable against its original.

---

## 2. The full clan squad doctrine — FOUND, verbatim

Location: [#18 resolution comment](https://github.com/stubbornweb/ratsquad.gg/issues/18#issuecomment-5125158517),
section «Source doctrine (verbatim, for the doctrine-page map)».

Provenance stated there: «Supplied by the clan during this session.» It is Ukrainian
throughout, and it is the **only first-party doctrine text that exists anywhere**.

Reproduced exactly:

> ## Frontline
>
> Основний штурмовий загін, який веде наступ та утримує позиції:
>
> - Захоплення та утримання ключових точок
> - Прямий контакт з противником
> - Координація з іншими загонами для просування або ефективного утримання
>
> ## Backline
>
> Загін підтримки та прикриття / командний загін:
>
> - Забезпечення вогневого прикриття
> - Захист тилу FOB/HAB
> - Розподіл ресурсів та постачання
> - Координація всіх загонів
> - Підтримка Frontline і Flank загонів
>
> Note: може містити Mortar задачі
>
> ## Flank
>
> Мобільний загін для обходу:
>
> - Атака з флангів
> - Знищення ворожих FOB/HAB
> - Розвідка та виявлення ворожих позицій
> - Підтримка Frontline загонів, утримання їх флангів
>
> ## Flex
>
> Універсальний загін швидкого реагування:
>
> - Підтримка будь-якого напрямку за потребою
> - Швидке перекидання між точками або напрямками
> - Заміна втрат інших загонів
> - Знищення ворожих FOB/HAB або мінометів
> - Підтримка усіх типів загонів
>
> ## VIC (Vehicle)
>
> Загін бронетехніки:
>
> - Підтримка піхоти вогнем
> - Знищення ворожої техніки або її здержування
> - Транспортування загонів та встановлення запасних ралі
> - Підтримка усіх типів загонів
>
> Note: Якщо екіпаж втрачає свою машину він повинен:
> Надати підсилення в союзний склад залежно від ситуації на полі гри або зайнятися знищенням тилових ворожиш сквадів.
> Перед перекидуванням або діями варто запитати та попередити CMD що ви плануєте робити як супорт одиниці котрі з'явилися після втрати вашої техніки.
>
> ## Mortar
>
> Мінометний загін:
>
> - Ураження мінометним вогнем пріоритетних цілей або напрямків
> - Встановлення димових завіс
> - Придушення ворожих позицій
> - Знищення або подавлення статичних цілей
> - Підтримка усіх типів загонів

### The condensed form lines settled from it

Same comment, the six-row table:

| Label | UA | Form line |
| --- | --- | --- |
| **FRONTLINE** | ФРОНТ | Штурм і утримання точок. Прямий контакт. |
| **BACKLINE** | ТИЛ | Прикриття, логістика, захист FOB. |
| **FLANK** | ФЛАНГ | Обхід, розвідка, знищення ворожих FOB. |
| **FLEX** | ФЛЕКС | Швидке реагування. Заміна втрат, підсилення будь-якого напрямку. |
| **VIC** | ТЕХНІКА | Бронетехніка. Вогнева підтримка, транспорт, ралі. |
| **MORTAR** | МІНОМЕТ | Мінометний вогонь, дими, придушення позицій. |

### Rulings attached to the doctrine, all in the same comment

- **Six напрями, one shared enum** serving `members.direction_*` and `squads.type_tag`.
  The earlier four were «read off the CSV's column values».
- **English labels, Ukrainian gloss alongside** — not replacing the sentence.
  `ФЛЕКС` is a transliteration carrying no meaning, «kept only so one of six cells
  isn't visibly empty; the sentence is what explains that tile».
  `VIC → ТЕХНІКА` deliberately reuses the word on the `TECH LIGHT/MIDDLE/HEAVY` tiles.
- **Dropped from the condensation:** «Підтримка усіх типів загонів», because it appears
  on Flex, VIC and Mortar — «three of six, so it discriminates nothing».
- **Flex is a real job, not a shrug** — the QRF squad. «швидке реагування, заміна втрат
  інших загонів, знищення ворожих тилових FOB та мінометів». Two structural guards
  (drop Flex; Flex-primary-only) were **proposed and both withdrawn**. Stated plainly in
  the comment: «nothing structural now prevents the shrug from returning».
- **ТИЛ stays one bucket** — splitting logistics/FOB from support-by-fire rejected,
  because the роль axis already separates them.
- **CMD is not a напрямок** — a format-dependent hat: «20 / 26 — often no CMD at all; if
  there is one it is the most experienced player, sitting in whatever squad type he is
  already in. 36 — CMD sits in the Backline squad, because that is where asset drops come
  from.» It becomes a per-slot marker in the roster builder.
- «командний загін» comes **off** the BACKLINE form line but **stays** in Backline's
  doctrine text.
- **The profile form becomes the canonical public definition** of a напрямок, ahead of the
  doctrine page — «the doctrine page expands on these, but must agree with them».

---

## 3. The expanded EN + UA squad-type write-ups — NOT FOUND

#47's second bullet asks for «the expanded English + Ukrainian squad-type write-ups
supplied during this map's charting session (mission, responsibilities, typical tasks,
"best suited for players who", strengths, weaknesses per напрямок)».

**No such material exists in the tracker or the repo.** Grepping all 52 issue bodies and
every comment for `best suited`, `Strengths`, `Weaknesses`, `Typical tasks`,
`найкраще підходить`, `сильні сторони`, `слабкі` returns only issue #47 itself and
[#52](https://github.com/stubbornweb/ratsquad.gg/issues/52) — and #52's hit is the phrase
«найкраще підходить / також підходить» used as a *proposed result-screen label*, not a
squad-type write-up.

Map #46's own body ([issue #46](https://github.com/stubbornweb/ratsquad.gg/issues/46)),
which is where a charting session records its output, contains no such write-ups either.

**This is a hard absence.** Either the material was produced in a session and never
committed to the tracker, or #47's description of it is aspirational. **A human must be
asked.** Nothing downstream should assume «mission / strengths / weaknesses / best suited
for» text exists for any напрямок: the only per-напрямок prose RATS has written is §2's
doctrine (a mission line plus a responsibilities list, Ukrainian only, no strengths, no
weaknesses, no player-fit statement) and §2's six condensed form lines.

Specifically missing, per напрямок, for all six:

- No English version of any doctrine text.
- No «strengths» or «weaknesses».
- No «best suited for players who…» statement — **which is precisely what the weight
  table in [#49](https://github.com/stubbornweb/ratsquad.gg/issues/49) needs and does not
  have.** The clan has written what a squad *does*; it has never written what kind of
  *player* belongs in it. That gap is the single largest one this inventory found.

---

## 4. The three Mermaid playstyle-test schemas — NOT FOUND; #17's axis fixes — FOUND

### The schemas themselves

[#17](https://github.com/stubbornweb/ratsquad.gg/issues/17) says the playstyle test «was
grilled in an earlier session against three Mermaid schemas supplied by a clan member».

**The schemas are not preserved.** Searching all 52 issues and all comments for `mermaid`
hits only #17 and #47. Searching for `graph TD` / `flowchart` across the tracker returns
nothing. `git grep -il mermaid` over the entire history returns nothing. #17 preserves the
*conclusions drawn from* the schemas; the schemas are gone.

Everything #17 tells us about their content, verbatim:

- They ran **Кіт → Позиціонка → Гемплей → Напрямок** ([#17 body](https://github.com/stubbornweb/ratsquad.gg/issues/17), «Shape»).
- **Кіт gated nothing** in the source schemas.
- They contained a **source table of nine cells** (mobility × gameplay).
- **The three schemas contradict each other** on the mobility × gameplay → direction
  lookup ([#17 body](https://github.com/stubbornweb/ratsquad.gg/issues/17), «Still open when it was parked»).
- Schema 2 specifically: the shrug option unlocked more directions than the real answers.
- Their kit grouping was **Стрілок/Медик, ГП/LAT, Тандем/Сапер**.

That is the complete surviving record of them.

### #17's axis fixes — verbatim from the issue body

> **Позиціонка was not one axis.** «Люблю спавнитись кожний раз в новому місці» is about
> death tolerance, not mobility — a player could honestly tick two options. Reframed as
> the aggressive/expendable end of mobility: «завжди на вістрі, гину і повертаюсь».

> **Гемплей`s third option was a shrug.** «Як вийде, так і настріляю» is an absence of
> intent, not a stance — and in Schema 2 it unlocked *more* directions than the two real
> answers. Replaced with «залежить від ситуації», which is genuine adaptability.

> **Флекс is not a direction.** It is a versatility claim tangled into a list about
> position. It becomes a flag set by the adaptable gameplay answer — «Фланг, гнучкий» is a
> better row than «Флекс».

> **Def appeared in all nine cells** of the source table and **Флекс in six** — neither
> discriminated, so neither carried information.

> **Kits were grouped only to keep the diagram to three branches** (Стрілок/Медик, ГП/LAT,
> Тандем/Сапер). Two of the three pairs are incoherent. Since Кіт does not branch, ungroup
> them.

### #17's other settled shape decisions

- One flow for everyone; no newcomer vs member routing.
- Multiple choice, **max 3 options, auto-advance on tap**. Not yes/no — «binary nodes
  create false dichotomies between the mobility options and make the flow *longer*, not
  shorter».
- **«The site never declares a verdict.»** «The last screen narrows; the player picks. No
  scoring model — a computed answer would encode opinions nobody in the clan agreed to,
  and invites an argument the clan does not need.»
- Still open when parked: the mobility × gameplay → direction lookup table, and the
  definitions of each напрямок.

---

## 5. Everything under `docs/`, plus `CONTEXT.md` and `CLAUDE.md`

### Present on `develop`

`docs/` contains twelve files. Grepping all of them for `recruitment|playstyle|mermaid|напрям|загін`
returns hits in **two**:

- `docs/planning/discovery.md` — recruitment as a *funnel* only. Line 12 «Game: Squad»,
  line 18 «Current recruitment relies entirely on Discord — site drives traffic there»,
  line 24 «Recruitment process: Discord-based, site will funnel visitors to Discord»,
  line 66 «Forbidden: No ads, no tracking, no signup forms».
- `docs/planning/project-description.md` — line 11 «recruitment funnel», line 23
  «Hardcore Squad players with 100+ hours».

Neither says anything about squad types, ролі, напрями or playstyle. The remaining
`docs/` files (`docs/agents/*.md`, `docs/setup/provisioning.md`, `docs/research/*.md`)
are process and infrastructure and carry nothing on this topic.

**`docs/` contains no doctrine, no role descriptions, no squad-type material at all.**
The doctrine lives entirely in issue #18's comment (§2) and in code (§5.2).

### Historic files, since deleted

`git log --all --diff-filter=A` shows these once existed and were removed:
`docs/PROJECT_REQUIREMENTS.md`, `docs/product-brief.md`, `docs/planning/user-stories.md`,
`docs/planning/phases/phase-1..4.md`, `website-guidelines/product-brief.md`,
`website-sections/6.faq.md`, `PROJECT.md`, `.ai-factory/*.md`, `.ww-kit/*.md`. They match
the recruitment/`напрям` grep, but their hits are the same marketing-funnel language as
above — none is the «Improve Recruitment Form» document (§1's grep for that string over
all history is negative).

### `CONTEXT.md` (45 lines)

Defines: Member, Callsign, Rank, Discord role, Roster, Squad Lead, RATS HQ, Roster post,
Call-up. Plus a note that «role» means three things and must always be qualified.

**`CONTEXT.md` has no entry for Роль (Squad role), Напрямок, Загін, Сквад, Івент or
Ростер.** [Map #7](https://github.com/stubbornweb/ratsquad.gg/issues/7) acknowledges this
explicitly under *Not yet specified*: «`CONTEXT.md` has no terms for Роль, Напрямок,
Сквад, Івент, Ростер, and explicitly says avoid "Player".»
[#48](https://github.com/stubbornweb/ratsquad.gg/issues/48) instructs that the settled
attribute terms be added to `CONTEXT.md`.

Note the collision this creates for the assessment tool: `CONTEXT.md:16` defines **Rank**
as ДУЧЕ / В.О.ДУЧЕ / SQUAD LEAD / MEMBER, while `src/consts/squad.ts:103-110` defines
`RANKS` as `DUCHE, VO_DUCHE, OFFICER, RATS, RECRUIT, INACTIVE`. Two vocabularies, both
current. Reported, not resolved.

### `CLAUDE.md`

Bears on this topic only in setting register: UI copy is Ukrainian, «terse uppercase
register already in `src/data/`»; dark mode only; sharp corners; 150–200ms transitions.
It lists no doctrine or taxonomy file.

### 5.2 The taxonomy as it exists in code on `develop`

`src/consts/squad.ts` is the live source of truth.

- `SQUAD_ROLES` (lines 18–33): 14 screaming-snake IDs.
- `SQUAD_ROLE_LABELS` (lines 38–53): `Rifler, Medic, LAT, HAT, GL, MG, Marksman, CE, SL,
  Tech light, Tech middle, Tech heavy, Pilot, Mortar` — «English labels, matching how the
  clan writes them in Discord».
- `SQUAD_ROLE_HINTS` (lines 56–60): **only three roles carry a hint** —
  `TECH_LIGHT: "RWS, BRDM"`, `TECH_MIDDLE: "BTR, LAV"`, `TECH_HEAVY: "Tank, ZBD"`.
- `MAX_ROLE_PREFERENCES = 3` (line 63), «A maximum, not a quota».
- `DIRECTIONS` (lines 72–79) and `DIRECTION_LABELS` (lines 87–94): the six, English key +
  Ukrainian gloss.
- `RANKS` (lines 103–110).

**Finding: the six form sentences #18 settled are not in the codebase.** `grep -rn
"Штурм і утримання"` across `src/` returns nothing, and `src/consts/squad.ts` has
`DIRECTION_LABELS` but no hints/sentences constant. #18 declared «Sentences always
visible, directly under each tile label» and made the form «the canonical public
definition of a напрямок» — the sentences currently live only in an issue comment.

**Finding: the eleven non-Tech ролі have no gloss on `develop` at all.** The Ukrainian
glosses exist only on the prototype branch (§6). `src/consts/squad.ts:56` deliberately
scopes hints to the Tech tiers.

Schema wiring: `src/db/schema/create_table_members.ts:37-38`
(`direction_primary`, `direction_secondary`, both nullable, both `enum: DIRECTIONS`);
`src/db/schema/create_table_member_roles.ts:28,38` (`role` + nullable `preference`);
`src/db/schema/create_table_squads.ts:27` (same enum as `members.direction_*`).

---

## 6. `src/app/prototype/profile/_data.ts` on `prototype/registration-profile`

Read via `git show prototype/registration-profile:src/app/prototype/profile/_data.ts`.
Not checked out. The file's own header calls it «PROTOTYPE — throwaway».

### The 14 ролі, exactly as written

| `id` | `label` | `hint` (Ukrainian gloss) | `group` |
| --- | --- | --- | --- |
| `rifler` | `RIFLER` | стрілець | infantry |
| `medic` | `MEDIC` | медик | infantry |
| `lat` | `LAT` | легке ПТ | infantry |
| `hat` | `HAT` | важке ПТ | infantry |
| `gl` | `GL` | гранатометник | infantry |
| `mg` | `MG` | кулеметник | infantry |
| `marksman` | `MARKSMAN` | влучний стрілець | infantry |
| `ce` | `CE` | сапер | infantry |
| `tech-light` | `TECH LIGHT` | RWS, BRDM | vehicle |
| `tech-middle` | `TECH MIDDLE` | BTR, LAV | vehicle |
| `tech-heavy` | `TECH HEAVY` | Tank, ZBD | vehicle |
| `pilot` | `PILOT` | пілот | vehicle |
| `sl` | `SL` | командир загону | other |
| `mortar` | `MORTAR` | міномет | other |

`GROUP_LABELS`: `infantry: "ПІХОТА"`, `vehicle: "ТЕХНІКА"`, `other: "ІНШЕ"`.

The file's own comments describe the `hint` field as «Ukrainian gloss, to test whether 14
unglossed options is a wall», and `label` as «Squad kit name — what players actually say
out loud, so left in English».

**These eleven Ukrainian glosses are the only ones RATS has written for the non-Tech
ролі, and they exist only on a branch explicitly labelled throwaway.** They are not on
`develop` (§5.2). The three Tech hints are identical to
`src/consts/squad.ts:56-60`, so those three have been promoted; the other eleven have not.

### The stale напрями on that branch

```ts
export type Direction = "frontline" | "backline" | "flank" | "flex";

export const DIRECTIONS: { id: Direction; label: string; hint: string }[] = [
  { id: "frontline", label: "ФРОНТ", hint: "перший контакт, штурм" },
  { id: "backline", label: "ТИЛ", hint: "логістика, підтримка, FOB" },
  { id: "flank", label: "ФЛАНГ", hint: "обхід, розвідка, тиск збоку" },
  { id: "flex", label: "ФЛЕКС", hint: "куди поставлять" },
];
```

`FILLED_DRAFT` on the same file carries `direction: "frontline"`,
`directionSecondary: "flex"`.

This is **known stale** and deliberately left so —
[#15 resolution](https://github.com/stubbornweb/ratsquad.gg/issues/15#issuecomment-5343650560),
«Branch state»: «`DIRECTIONS` in `_data.ts` is still the stale four with Ukrainian-only
labels and `flex` glossed «куди поставлять»… #18's six tiles were never applied. Do not
fix them in place — they land as part of the rebuild.» Same instruction repeated in
[#66](https://github.com/stubbornweb/ratsquad.gg/issues/66).

---

## 7. Contradictions found — reported, not resolved

1. **#17 vs #18 on Flex.** #17: «Флекс is not a direction… a versatility claim tangled
   into a list about position». #18: «That premise was wrong. Flex is the QRF squad… It
   has a doctrine and not everyone can fill it.» #18 explains the difference (#17 read the
   playstyle schemas; #18 read the squad doctrine), but #17 remains open and unretracted
   as written text. **#49 must decide which reading its weight table encodes** — and
   #18 itself warns «nothing structural now prevents the shrug from returning».

2. **#17 vs #46/#15 on scoring at all.** #17: «The site never declares a verdict… No
   scoring model — a computed answer would encode opinions nobody in the clan agreed to.»
   #46 and #15's resolution knowingly reverse this. The reversal is documented and priced
   (the weight table must be clan-agreed), but the two statements are directly opposed and
   both are labelled «settled» by their own tickets.

3. **The source spec's middle layer vs #13/#18's axes.** The spec's «Battlefield Role»
   (Assault / Support / AT / Medic / Engineer / Driver / Gunner / Commander) mixes kits,
   crew positions and the CMD hat. Explicitly **not adopted** by
   [#15's resolution](https://github.com/stubbornweb/ratsquad.gg/issues/15#issuecomment-5343650560)
   and [#46](https://github.com/stubbornweb/ratsquad.gg/issues/46) — but the source spec
   is still the material this map is «supposed to be built *on*», so the rejection has to
   be re-stated wherever the spec is consulted.

4. **The source spec's kit list is 8; the model's is 14.** Noted in
   [#51](https://github.com/stubbornweb/ratsquad.gg/issues/51) item 3. The six missing —
   Tech light/middle/heavy, Pilot, SL, Mortar — are «exactly the ones needing experience,
   not preference».

5. **`Mortar` is both a роль and a напрямок.** `SQUAD_ROLES` includes `MORTAR`
   (`src/consts/squad.ts:32`) and `DIRECTIONS` includes `MORTAR`
   (`src/consts/squad.ts:78`). Deliberate under «роль is what I can do; напрямок is where
   I belong», but the doctrine adds a wrinkle: Backline's text carries «Note: може містити
   Mortar задачі», so mortar work is not exclusive to the Mortar напрямок. Likewise `SL`
   is a роль while CMD is neither роль nor напрямок.

6. **«Підтримка усіх типів загонів» appears in three of six doctrine entries** (Flex, VIC,
   Mortar). #18 dropped it from the form lines for exactly the reason #17 dropped `Def`
   and `Флекс` — non-discriminating. It remains in the full doctrine text, so a weight
   table derived naively from §2 will inherit the non-discrimination.

7. **Rank vocabulary split.** `CONTEXT.md:16` (ДУЧЕ / В.О.ДУЧЕ / SQUAD LEAD / MEMBER) vs
   `src/consts/squad.ts:103-110` (`DUCHE, VO_DUCHE, OFFICER, RATS, RECRUIT, INACTIVE`).
   Only tangential to this map, but #53's Officer-only visibility rule reads against one
   of these.

8. **Age.** `src/data/join.ts:11` says «Вік від 18+»; the old data contains a 16-year-old
   ([#7](https://github.com/stubbornweb/ratsquad.gg/issues/7) *Out of scope*,
   [#57](https://github.com/stubbornweb/ratsquad.gg/issues/57) item 3). Carried to map
   #56, not this one. Recorded so it is not rediscovered.

---

## 8. What a later session must get from a human

Nothing below can be answered from any written source RATS currently has.

1. **Produce the «Improve Recruitment Form» document itself** — a link or an export. Every
   «source spec» claim in #48–#52 is currently a quotation with no original, and #47 says
   it holds a prototype that no ticket reproduces.
2. **Per-напрямок «best suited for players who…»** — the clan has written what each squad
   *does*, never what kind of *player* fits it. #49's weight table has no written basis
   without this.
3. **Strengths and weaknesses per напрямок** — do not exist in any form.
4. **English doctrine text** — the doctrine is Ukrainian-only.
5. **Ukrainian glosses for the eleven non-Tech ролі**, promoted off the throwaway branch
   and blessed, or rewritten.
6. **Whether the three Mermaid schemas can be recovered** from Discord — #17 records that
   they contradicted each other on the mobility × gameplay → direction lookup, which is
   the exact shape #49 and #50 are trying to rebuild. Recovering them would show what the
   clan member who wrote them actually believed.
