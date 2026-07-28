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
