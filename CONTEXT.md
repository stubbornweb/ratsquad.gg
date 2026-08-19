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
One of the fourteen in-game kits a Member can play — «Роль» — listed in `src/consts/squad.ts`. **Роль is _what I can do_; Напрямок is _where I belong_.** Always qualified as a *Squad role*, never bare "role", which this file already reserves as ambiguous.
_Avoid_: Role (unqualified), kit, class, loadout

**Атрибут**:
A single 0–100 measure of what a player *wants* from a match, produced by the Squad Assessment tool and never observed from play. Two kinds — a Риса and a Схильність — and the pair of them is the entire vocabulary the assessment's scoring is written against. An Атрибут is always an appetite, never a claim of skill: the tool cannot know how well someone shoots, only what they want the match to turn on.
_Avoid_: Trait (unqualified), stat, score, rating, personality

**Риса**:
A behavioural Атрибут that sums into a Напрямок recommendation — АГРЕСІЯ, ТЕРПЛЯЧІСТЬ, САМОСТІЙНІСТЬ, АДАПТИВНІСТЬ, ГРА ПО КАРТІ. ЛІДЕРСТВО is also a Риса but weighs zero against every Напрямок; it exists to inform Squad role recommendation.
_Avoid_: Personality trait, attribute (that's the parent term), soft skill

**Схильність**:
An Атрибут naming a taste for a *subject* rather than a way of behaving — ТЕХНІКА and НЕПРЯМИЙ ВОГОНЬ. Asked bluntly, one question each, and it floors rather than sums: a low Схильність pushes its Напрямок to the bottom of the result no matter how well the Риси fit, because nobody should be recommended armour they said they don't want to crew.
_Avoid_: Affinity (unqualified), interest, preference (that's the player's stated choice, a different thing)
