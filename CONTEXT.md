# RATS Site

The public site for RATS, a competitive EU clan in Squad. Its job is to present the clan and route visitors to the Discord invite.

## Language

**Member**:
A person in the clan, shown on the site with a callsign and a rank. Sourced live from the Discord guild, with a static fallback list.
_Avoid_: Player, user, soldier

**Callsign**:
The name a Member is known by in-game and on the site. Distinct from their Discord username or server nickname, which are implementation details of how the callsign is fetched.
_Avoid_: Username, nickname, handle

**Rank**:
A Member's standing in the clan, displayed on the site — ДУЧЕ, В.О.ДУЧЕ, SQUAD LEAD, MEMBER. This is what the `role` field on `Member` actually holds.
_Avoid_: Role (ambiguous — see below), title, position

**Discord role**:
An ID-keyed role on the Discord guild, the authoritative source a Rank is derived from. Referenced by ID rather than name so the integration survives renames. The Discord role named "Officer" maps to the Rank "SQUAD LEAD", and "RATS" maps to "MEMBER" — the two vocabularies deliberately differ.
_Avoid_: Role, unqualified

> **On the word "role":** it means three things in this codebase — the `Member.role` field (which holds a Rank), a Discord role, and the mapping between them. Always qualify it: say **Rank** for what the site displays, **Discord role** for the guild entity.

**Roster**:
The list of Members shown on the site. It has two scopes: _featured_ (leadership only, on the homepage) and _full_ (every tracked Rank, on `/roster`).
_Avoid_: Team, lineup, squad list

**Squad Lead**:
A Member who commands a squad in-game — the Rank displayed for the Discord role "Officer".
_Avoid_: Officer (that's the Discord role name), SL, leader

**RATS HQ**:
The clan's own Discord bot — one Team-owned application, replacing the third-party bots in the guild. It owns every Discord write: the site writes rows, RATS HQ makes Discord match them. Its throwaway development counterpart is a separate application, `RATS HQ Dev`, which lives alone in a test guild and never joins the RATS guild.
_Avoid_: The bot (unqualified), the integration, Integration Helper (the retired application)

**Roster post**:
The Discord message that projects a published event's rounds and squads. RATS HQ re-renders it wholesale from the rows and edits it in place; it is never republished, so an event has at most one Roster post for its whole life.
_Avoid_: The roster message, the embed, the announcement

**Call-up**:
A message posted beneath a Roster post, mentioning only the Members whose slots changed since the previous one — added, moved or removed. One per batch of changes, kept as history rather than replaced, because it is the record of who was told what and when.
_Avoid_: Ping, tag, notification, mention message

> **On the word "publish":** it names the state transition — an event gaining a publication time — not the message. The message is the **Roster post**, and it outlives every later edit.

**Напрямок**:
A type of squad, not a position on the map — one of six: `FRONTLINE`·ФРОНТ, `BACKLINE`·ТИЛ, `FLANK`·ФЛАНГ, `FLEX`·ФЛЕКС, `VIC`·ТЕХНІКА, `MORTAR`·МІНОМЕТ. A Member has one primary Напрямок and optionally a second. CMD is not one of them — it is a format-dependent hat marked per slot on the roster.
_Avoid_: Squad type, direction, lane, position, battlefield identity

**Squad role**:
One of the ten in-game kits a Member can play — «Роль» — listed in `src/consts/squad.ts`. **Роль is _what I can do_; Напрямок is _where I belong_.** Always qualified as a *Squad role*, never bare "role", which this file already reserves as ambiguous. Splits in two wherever a Member picks from the list: **базові кіти** (`RIFLER`, `MEDIC`, `LAT`) any загін runs, and **спеціальні кіти** (`HAT`, `GL`, `CE`, `MORTAR`, `CREW`, `CREW_SL`, `SL`) demanding a specific gameplay. RATS does not field Marksman, MG or Pilot, and `CREW`/`CREW_SL` name a *seat*, not a vehicle — the old Tech light/middle/heavy tiers were vehicle tiers, not kits.
_Avoid_: Role (unqualified), kit, class, loadout, Tech light/middle/heavy (removed)

**Атрибут**:
A single 0–100 measure of what a player *wants* from a match, produced by the Squad Assessment tool and never observed from play. Two kinds — a Риса and a Схильність — and the pair of them is the entire vocabulary the assessment's scoring is written against. An Атрибут is always an appetite, never a claim of skill: the tool cannot know how well someone shoots, only what they want the match to turn on. **It is never stored**: an Атрибут is computed, shown to the player who answered, and discarded — no Member row holds one and no officer ever reads one.
_Avoid_: Trait (unqualified), stat, score, rating, personality

**Риса**:
A behavioural Атрибут that feeds the Напрямок recommendation — АГРЕСІЯ, ТЕРПЛЯЧІСТЬ, САМОСТІЙНІСТЬ, АДАПТИВНІСТЬ, ЧИТАННЯ КАРТИ (key `MAP_PLAY`, renamed in Ukrainian only). It is compared against a Профіль напрямку, never summed: overshooting a target counts against a Напрямок exactly as undershooting does. ЛІДЕРСТВО is also a Риса but has importance zero in every Профіль напрямку; it exists solely to name `SL` — and, with ТЕХНІКА, `CREW_SL` — and only at a full 100, since it rests on a single question.
_Avoid_: Personality trait, attribute (that's the parent term), soft skill

**Схильність**:
An Атрибут naming a taste for a *subject* rather than a way of behaving — ТЕХНІКА and НЕПРЯМИЙ ВОГОНЬ. Asked bluntly, one question each, and it floors rather than sums: a low Схильність pushes its Напрямок to the bottom of the result no matter how well the Риси fit, because nobody should be recommended armour they said they don't want to crew. A Схильність is also the only thing that may name a Squad role — ТЕХНІКА names `CREW`, НЕПРЯМИЙ ВОГОНЬ names `MORTAR` — precisely because it was asked outright; no Squad role is ever inferred from a Риса.
_Avoid_: Affinity (unqualified), interest, preference (that's the player's stated choice, a different thing)

**Профіль напрямку**:
What a Напрямок wants from a player: for each Риса, a target value (0–100) and an importance (0–3, where 0 means the Напрямок genuinely does not care). Six profiles, one per Напрямок. A profile states an appetite the squad needs, never a standard the player must meet — «ФРОНТ хоче АГРЕСІЮ дуже високу» is a description of the job, not a bar to clear.
_Avoid_: Weight table (the thing it replaced — weights are signed and a profile is not), ideal player, requirements

**Відповідність**:
How well a player's Риси match a Профіль напрямку — the assessment's output, one figure per Напрямок. It is **relative, not a probability**: «ФЛАНГ 83%» means this Напрямок is much more the player than the others are, never that they belong there with 83% certainty. A low Схильність floors its Напрямок's Відповідність near the bottom without removing it, so the result always shows all six.
_Avoid_: Score, match percentage, confidence (killed as a figure — the model has no basis for one), fit (in Ukrainian copy)

**Рівний результат**:
An assessment that names two Напрями rather than one, because nothing in the answers separates them — the top two are within fifteen displayed points, or every Риса landed mid-range. Its opposite is a **чіткий результат**, which names one. Рівний is a real answer and never an error state: «ти ще не знаєш — ось що спробувати» is a true thing to tell a player, and the two Напрями are presented unordered because ordering them would assert a difference the model did not find.
_Avoid_: Tie, inconclusive, low confidence, unclear

**Вибір гравця**:
The Напрямок a player picks for themselves after reading their result — asked as a choice, never as agreement or disagreement with the recommendation, and always asked last, because asking it first would colour every answer before it. It is what becomes the Member's primary Напрямок. A Вибір гравця that differs from the Відповідність is not a failure of the assessment and is not recorded as a disagreement — it is visible to the player on the result screen at the moment of choosing, and nowhere afterwards to anyone, because the Атрибути it was weighed against are gone. It is the only thing the assessment leaves behind, alongside the kits the player ticked.
_Avoid_: Preference (unqualified — see Схильність), stated preference, agreement, override

**Шортколер**:
The player calling the shots for the team during a scrim, alongside or as CMD. Not a Напрямок and not a Squad role — like CMD, a hat worn for a match. Appears in assessment copy as «CMD/Шортколер».
_Avoid_: Shotcaller (in Ukrainian copy), IGL, каптан

**Scrim slang**:
The register of all player-facing assessment copy: **тригер** / **актуал** (the contested capture point), **райлі** (rally), **фоб** / **хаб**, **логі**, **якір** (the player held back so a squad is never wiped), **позиціонка** (the position a squad fights from), **кап** / **капати**, **войс**, **кіт**, **тікети**. This is how RATS talks in a scrim and it is deliberately not translated into formal Ukrainian — a question a player has to decode measures reading comprehension, not appetite.
_Avoid_: Formalising these into літературна українська, or into English (`rally`, `FOB`) in player-facing copy
