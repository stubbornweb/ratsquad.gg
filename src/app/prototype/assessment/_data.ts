/**
 * PROTOTYPE — THROWAWAY. Wayfinder ticket #55.
 *
 * Every string below is TRANSCRIBED, not authored. #50 found that player-facing
 * scrim copy written without a clan member in the loop fails three ways, and
 * handed #55 the instruction «transcribe it, don't rewrite it». So:
 *
 *   - the eighteen questions and their options  → #50's resolution, verbatim
 *   - the eight Атрибут sentences               → #48's resolution, verbatim
 *   - the ten reason fragments and the deck     → #52's resolution, verbatim
 *   - the thirty targets and importances        → #49's resolution, verbatim
 *
 * Anything here that is NOT from those four comments is marked `UNSIGNED` and
 * is chrome (a nav label, a kit gloss) — never a situation the player decodes.
 *
 * The ten Squad roles are #51's, and deliberately local to this file: the real
 * `src/consts/squad.ts` still lists fourteen, and cutting it is #70's job on
 * map #7, not this prototype's.
 */

/* ═══════════════════════════════════════════════════════
   Атрибути — #48, renamed by #50
   ═══════════════════════════════════════════════════════ */

/** The five summing Риси, plus ЛІДЕРСТВО which weighs zero against every напрямок. */
export const TRAITS = [
  "AGGRESSION",
  "PATIENCE",
  "INDEPENDENCE",
  "ADAPTABILITY",
  "MAP_PLAY",
  "LEADERSHIP",
] as const;

export type Trait = (typeof TRAITS)[number];

/** The five that actually feed the weight table. ЛІДЕРСТВО is not among them. */
export const SCORING_TRAITS = TRAITS.filter(
  (t) => t !== "LEADERSHIP",
) as readonly Exclude<Trait, "LEADERSHIP">[];

export const INCLINATIONS = ["VEHICLES", "INDIRECT_FIRE"] as const;

export type Inclination = (typeof INCLINATIONS)[number];

/** #50 renamed MAP_PLAY to ЧИТАННЯ КАРТИ in Ukrainian. The key is unchanged. */
export const TRAIT_LABELS: Record<Trait, string> = {
  AGGRESSION: "АГРЕСІЯ",
  PATIENCE: "ТЕРПЛЯЧІСТЬ",
  INDEPENDENCE: "САМОСТІЙНІСТЬ",
  ADAPTABILITY: "АДАПТИВНІСТЬ",
  MAP_PLAY: "ЧИТАННЯ КАРТИ",
  LEADERSHIP: "ЛІДЕРСТВО",
};

export const INCLINATION_LABELS: Record<Inclination, string> = {
  VEHICLES: "ТЕХНІКА",
  INDIRECT_FIRE: "НЕПРЯМИЙ ВОГОНЬ",
};

/** #48's sentences, verbatim. #52: shown to the player, all eight, always. */
export const TRAIT_SENTENCES: Record<Trait, string> = {
  AGGRESSION: "Хочеш бути там, де стріляють — штурм, прямий контакт, високий темп.",
  PATIENCE: "Готовий довго не робити нічого, якщо це готує один правильний момент.",
  INDEPENDENCE: "Хочеш діяти сам, без постійного контакту з рештою команди.",
  ADAPTABILITY:
    "Хочеш, щоб задача змінювалась посеред бою, і не тримаєшся за початковий план.",
  MAP_PLAY: "Хочеш впливати на бій через карту й план, а не через власну стрільбу.",
  LEADERSHIP: "Готовий приймати рішення за інших і відповідати за них.",
};

export const INCLINATION_SENTENCES: Record<Inclination, string> = {
  VEHICLES: "Хочеш проводити бій в екіпажі, а не в піхоті.",
  INDIRECT_FIRE:
    "Хочеш працювати за координатами, впливаючи на бій без прямого контакту.",
};

/* ═══════════════════════════════════════════════════════
   Напрями — #18's enum, #49's table
   ═══════════════════════════════════════════════════════ */

export const DIRECTIONS = [
  "FRONTLINE",
  "BACKLINE",
  "FLANK",
  "FLEX",
  "VIC",
  "MORTAR",
] as const;

export type Direction = (typeof DIRECTIONS)[number];

export const DIRECTION_LABELS: Record<Direction, string> = {
  FRONTLINE: "ФРОНТ",
  BACKLINE: "ТИЛ",
  FLANK: "ФЛАНГ",
  FLEX: "ФЛЕКС",
  VIC: "ТЕХНІКА",
  MORTAR: "МІНОМЕТ",
};

export type Cell = { target: number; importance: number };

/**
 * #49's thirty numbers, verbatim. A DRAFT until #69 closes — the structure is
 * settled, the numbers are not, and nothing player-facing ships before then.
 *
 * ЛІДЕРСТВО is absent because its importance is 0 against all six.
 */
export const DIRECTION_PROFILES: Record<
  Direction,
  Record<Exclude<Trait, "LEADERSHIP">, Cell>
> = {
  FRONTLINE: {
    AGGRESSION: { target: 95, importance: 3 },
    PATIENCE: { target: 25, importance: 2 },
    INDEPENDENCE: { target: 25, importance: 2 },
    ADAPTABILITY: { target: 65, importance: 1 },
    MAP_PLAY: { target: 30, importance: 1 },
  },
  BACKLINE: {
    AGGRESSION: { target: 20, importance: 2 },
    PATIENCE: { target: 85, importance: 3 },
    INDEPENDENCE: { target: 30, importance: 2 },
    ADAPTABILITY: { target: 45, importance: 0 },
    MAP_PLAY: { target: 85, importance: 3 },
  },
  FLANK: {
    AGGRESSION: { target: 55, importance: 1 },
    PATIENCE: { target: 75, importance: 2 },
    INDEPENDENCE: { target: 95, importance: 3 },
    ADAPTABILITY: { target: 70, importance: 1 },
    MAP_PLAY: { target: 80, importance: 3 },
  },
  FLEX: {
    AGGRESSION: { target: 70, importance: 2 },
    PATIENCE: { target: 55, importance: 1 },
    INDEPENDENCE: { target: 70, importance: 2 },
    ADAPTABILITY: { target: 95, importance: 3 },
    MAP_PLAY: { target: 70, importance: 2 },
  },
  VIC: {
    AGGRESSION: { target: 40, importance: 1 },
    PATIENCE: { target: 80, importance: 3 },
    INDEPENDENCE: { target: 25, importance: 3 },
    ADAPTABILITY: { target: 45, importance: 0 },
    MAP_PLAY: { target: 60, importance: 1 },
  },
  MORTAR: {
    AGGRESSION: { target: 10, importance: 3 },
    PATIENCE: { target: 95, importance: 3 },
    INDEPENDENCE: { target: 40, importance: 1 },
    ADAPTABILITY: { target: 30, importance: 1 },
    MAP_PLAY: { target: 90, importance: 2 },
  },
};

/** Which Схильність floors which напрямок. The other four are never floored. */
export const DIRECTION_GATE: Partial<Record<Direction, Inclination>> = {
  VIC: "VEHICLES",
  MORTAR: "INDIRECT_FIRE",
};

/* ═══════════════════════════════════════════════════════
   The eighteen — #50, verbatim, in #50's hand-authored order
   ═══════════════════════════════════════════════════════ */

export type TraitQuestion = {
  kind: "trait";
  n: number;
  trait: Trait;
  situation: string;
  options: { value: 100 | 55 | 10; label: string }[];
};

export type InclinationQuestion = {
  kind: "inclination";
  n: number;
  inclination: Inclination;
  situation: string;
  options: { value: 100 | 0; label: string }[];
};

export type Question = TraitQuestion | InclinationQuestion;

export const QUESTIONS: Question[] = [
  {
    kind: "trait",
    n: 1,
    trait: "AGGRESSION",
    situation: "Матч почався, ваш загін висадився першим, точка ще нічия.",
    options: [
      { value: 100, label: "Першим в актуалі/головному трігері." },
      { value: 55, label: "Близько, але не першим — заходжу другою хвилею." },
      { value: 10, label: "Там, звідки я бачу бій, а не в ньому." },
    ],
  },
  {
    kind: "trait",
    n: 2,
    trait: "PATIENCE",
    situation: "Ти на позиції. 5-10 хвилин нічого не відбувається.",
    options: [
      { value: 100, label: "Це нормально. Я тут не просто так." },
      { value: 55, label: "Використаю час — підготую позицію, підвезу ресурси." },
      { value: 10, label: "5 хвилин? Я вже давно пішов шукати противника." },
    ],
  },
  {
    kind: "trait",
    n: 3,
    trait: "INDEPENDENCE",
    situation: "Ти отримав задачу і зрозумів її. Що далі?",
    options: [
      { value: 100, label: "Далі я сам. Доповім, коли буде результат." },
      { value: 55, label: "Зроблю по-своєму, але триматиму зв'язок." },
      { value: 10, label: "Хочу робити це разом з рештою загону." },
    ],
  },
  {
    kind: "trait",
    n: 4,
    trait: "ADAPTABILITY",
    situation: "CMD/Шортколер змінює вам задачу втретє за короткий проміжок часу.",
    options: [
      { value: 100, label: "Нормально. Значить, ми потрібні скрізь." },
      { value: 55, label: "Виконаю, але хочу розуміти, чому." },
      { value: 10, label: "Дайте нам доробити те, що почали." },
    ],
  },
  {
    kind: "trait",
    n: 5,
    trait: "MAP_PLAY",
    situation: "Як часто ти відкриваєш карту під час бою?",
    options: [
      { value: 100, label: "Постійно. Я весь час знаю, де що." },
      { value: 55, label: "Коли треба зорієнтуватись або щось позначити." },
      { value: 10, label: "Рідко. Я дивлюсь на те, що переді мною." },
    ],
  },
  {
    kind: "trait",
    n: 6,
    trait: "AGGRESSION",
    situation: "Що дає тобі найбільше задоволення за матч?",
    options: [
      { value: 100, label: "Перестрілка, яку я виграв упритул." },
      { value: 55, label: "Точка, яку ми взяли, поки я тримав тиск." },
      { value: 10, label: "Ворог, який навіть не зрозумів, звідки прилетіло." },
    ],
  },
  {
    kind: "trait",
    n: 7,
    trait: "PATIENCE",
    situation: "Що для тебе гірше?",
    options: [
      { value: 100, label: "Поспішити і зірвати те, що готувалось." },
      { value: 55, label: "Зробити все правильно, але запізно." },
      { value: 10, label: "Просидіти весь бій без жодного пострілу." },
    ],
  },
  {
    kind: "trait",
    n: 8,
    trait: "LEADERSHIP",
    situation: "Перед скрімом не вистачає SL на один загін.",
    options: [
      { value: 100, label: "Візьму загін. Мені це подобається." },
      { value: 55, label: "Загін не беру, але можу допомогти з організацією." },
      { value: 10, label: "Хай веде хтось інший. Я хочу грати свій кіт." },
    ],
  },
  {
    kind: "trait",
    n: 9,
    trait: "INDEPENDENCE",
    situation: "Загін пішов в один бік, і ти бачиш кращий варіант в інший.",
    options: [
      { value: 100, label: "Піду сам. Поясню потім." },
      { value: 55, label: "Скажу в войсі й піду, якщо ніхто не проти." },
      { value: 10, label: "Залишусь з загоном. Разом ефективніше." },
    ],
  },
  {
    kind: "trait",
    n: 10,
    trait: "ADAPTABILITY",
    situation: "Тобі дали кіт, яким ти майже не грав.",
    options: [
      { value: 100, label: "Цікаво. Розберусь по ходу." },
      { value: 55, label: "Візьму, якщо поясните задачу під нього." },
      { value: 10, label: "Краще дайте те, чим я граю добре." },
    ],
  },
  {
    kind: "trait",
    n: 11,
    trait: "MAP_PLAY",
    situation: "Команда програє. Що ти хочеш зробити?",
    options: [
      { value: 100, label: "Подивитись на карту й зрозуміти, де ми її втрачаємо." },
      { value: 55, label: "Знайти собі задачу, яка дасть команді час." },
      { value: 10, label: "Настріляти більше. Це те, що я контролюю." },
    ],
  },
  {
    kind: "trait",
    n: 12,
    trait: "AGGRESSION",
    situation: "Твій загін втратив половину складу при атаці.",
    options: [
      { value: 100, label: "Іти далі, поки в них ще не відновилась оборона." },
      { value: 55, label: "Закріпитись там, де ми є, і почекати на підкріплення." },
      { value: 10, label: "Відійти і зайти інакше." },
    ],
  },
  {
    kind: "trait",
    n: 13,
    trait: "PATIENCE",
    situation: "Ваш загін на фланзі. Як хочеш це грати?",
    options: [
      {
        value: 100,
        label:
          "Акуратно: постійно тримати якір, при втраті 3-4 — деф райліка на новий спавн.",
      },
      { value: 55, label: "Холдити позиціонку й перестрілювати їх звідти." },
      {
        value: 10,
        label:
          "Агресивно: 1-2 обходять і палять їхній спавн, доки інші відволікають.",
      },
    ],
  },
  {
    kind: "trait",
    n: 14,
    trait: "INDEPENDENCE",
    situation: "Ваш загін захоплює головний тригер.",
    options: [
      {
        value: 100,
        label: "Йду сам шукати й палити їхнє райлі, поки хлопці капають.",
      },
      { value: 55, label: "Тримаю підхід збоку — окремо від групи, але поруч." },
      { value: 10, label: "Капаю разом з усіма в тригері." },
    ],
  },
  {
    kind: "trait",
    n: 15,
    trait: "MAP_PLAY",
    situation: "Ти відкрив карту. На що дивишся першим?",
    options: [
      { value: 100, label: "Де їхні фоби й хаби, звідки підуть ротації." },
      { value: 55, label: "Де наші загони і хто що тримає." },
      { value: 10, label: "Де я і куди мені йти." },
    ],
  },
  {
    kind: "trait",
    n: 16,
    trait: "ADAPTABILITY",
    situation: "Між раундами тебе переставляють в інший загін.",
    options: [
      {
        value: 100,
        label: "Нормально. Мені цікавіше грати різні задачі, ніж одну.",
      },
      { value: 55, label: "Піду, але хочу там ту саму задачу, до якої звик." },
      { value: 10, label: "Хочу грати зі своїм складом, з яким зіграний." },
    ],
  },
  {
    kind: "inclination",
    n: 17,
    inclination: "VEHICLES",
    situation: "Ти хочеш провести скрім в екіпажі — танк, БТР, гелікоптер?",
    options: [
      { value: 100, label: "Так. Техніка — це те, заради чого я тут." },
      { value: 0, label: "Ні. Я хочу бути в піхоті." },
    ],
  },
  {
    kind: "inclination",
    n: 18,
    inclination: "INDIRECT_FIRE",
    situation:
      "Ти хочеш працювати за координатами — коли ціль бачить хтось інший, а вирішуєш бій ти?",
    options: [
      { value: 100, label: "Так, це моє." },
      { value: 0, label: "Ні. Я хочу бачити, у що стріляю." },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   Squad roles — #51's ten
   ═══════════════════════════════════════════════════════ */

export const BASIC_KITS = ["RIFLER", "MEDIC", "LAT"] as const;

export const SPECIAL_KITS = [
  "HAT",
  "GL",
  "CE",
  "MORTAR",
  "CREW",
  "CREW_SL",
  "SL",
] as const;

export type Kit = (typeof BASIC_KITS)[number] | (typeof SPECIAL_KITS)[number];

export const KIT_LABELS: Record<Kit, string> = {
  RIFLER: "Rifler",
  MEDIC: "Medic",
  LAT: "LAT",
  HAT: "HAT",
  GL: "GL",
  CE: "CE",
  MORTAR: "Mortar",
  CREW: "Crew",
  CREW_SL: "Crew SL",
  SL: "SL",
};

/**
 * UNSIGNED — chrome, not doctrine. #47 found 11 of 14 ролі have no Ukrainian
 * gloss, and #51's two new kits have none anywhere; the map still carries that
 * as fog. Two words so the grid is readable on a phone; not a copy decision.
 */
export const KIT_HINTS: Partial<Record<Kit, string>> = {
  CREW: "в екіпажі",
  CREW_SL: "командир екіпажу",
};

/* ═══════════════════════════════════════════════════════
   The copy deck — #52, verbatim
   ═══════════════════════════════════════════════════════ */

export const COPY = {
  headlineClear: (direction: string) => `ТВІЙ НАПРЯМОК — ${direction}`,
  headlineEven: "ТИ ЩЕ НЕ ЗНАЄШ — ОСЬ ЩО СПРОБУВАТИ",
  reason: (a: string, b: string) => `Бо ти ${a} і ${b}.`,
  tier1: "НАЙКРАЩЕ ПІДХОДИТЬ",
  tier2: "ТАКОЖ ПІДХОДИТЬ",
  tier3: "ТИ СКАЗАВ, ЩО НЕ ХОЧЕШ",
  flooredVic: "Ти сказав, що не хочеш проводити бій в екіпажі.",
  flooredMortar: "Ти сказав, що не хочеш працювати за координатами.",
  flexSuppressed:
    "ФЛЕКС тут не показується — його дають за досвід у клані, а не за відповіді.",
  attributesHeader: "ЩО ТИ ВІДПОВІВ",
  chipYes: "ХОЧУ",
  chipNo: "НЕ ХОЧУ",
  choice: "А ЩО ОБЕРЕШ ТИ?",
  choiceSub: "Зберігаємо твій вибір, не наш.",
  evidencedHeader: "ТВОЇ ВІДПОВІДІ ВКАЗУЮТЬ НА",
  evidencedEmpty:
    "Твої відповіді не вказують на жоден спеціальний кіт — це нормально.",
  gridHeader: "ПОСТАВ, ЩО ВМІЄШ",
  groupBasic: "БАЗОВІ КІТИ",
  groupSpecial: "СПЕЦІАЛЬНІ КІТИ",
  saveHeader: "ЩО ЗБЕРЕЖЕТЬСЯ",
  // #53: «gains one line in the opposite direction, now simply true».
  saveNoAttributes: "АТРИБУТИ НЕ ЗБЕРІГАЮТЬСЯ.",
  cta: "ЗБЕРЕГТИ В ПРОФІЛЬ",
  ctaSecondary: "ПРОЙТИ ЩЕ РАЗ",
} as const;

/** #52's evidenced-kit reason lines, verbatim. */
export const KIT_REASONS: Partial<Record<Kit, string>> = {
  CREW: "Ти сказав, що хочеш проводити бій в екіпажі.",
  CREW_SL: "Ти хочеш в екіпаж і готовий відповідати за рішення.",
  MORTAR: "Ти сказав, що хочеш працювати за координатами.",
  SL: "Ти готовий приймати рішення за інших.",
};

/** #51: the SL invitation hangs off the SL entry, never as a banner. */
export const SL_INVITATION = "Поговори з офіцерами.";

/* ═══════════════════════════════════════════════════════
   Round two — the kits. NOT from a closed ticket.
   ═══════════════════════════════════════════════════════ */

/**
 * The cap. `MAX_ROLE_PREFERENCES` in `src/consts/squad.ts` is already 3, and
 * this is that field — the **top-3 preference**, not the capability set.
 *
 * That distinction is the whole cost of this change and is flagged on #55:
 * an uncapped grid answers «що вмієш» and writes `member_roles`; a grid capped
 * at three answers «що граєш основним» and writes `preference`. #53 wrote
 * `member_roles` and left `preference` untouched. Capping swaps which of the
 * two the tool fills, and «хто ще може сісти в танк?» stops being answerable
 * from anything this tool collects.
 */
export const MAX_MAIN_KITS = 3;

/**
 * Round two: three ordered slots, not an unordered pick.
 *
 * **The three `question` strings are the clan's, verbatim** — including the
 * secondary's parenthetical, which is the actual domain reason a second choice
 * exists at all. Everything else on this screen is `UNSIGNED` microcopy.
 *
 * REGISTER MISMATCH, FLAGGED ON #55: these speak «ви», while #50's eighteen and
 * #52's whole deck speak «ти» («Ти на позиції», «А ЩО ОБЕРЕШ ТИ?»). The screen
 * is kept internally consistent in «ви» rather than half-converted; which way
 * the tool unifies is the clan's call, not mine to make silently.
 *
 * VOCABULARY, ALSO FLAGGED: the clan's text says «роль». `CONTEXT.md` reserves
 * bare "role" as ambiguous and #52's deck says «кіт» throughout.
 */
export const ROLE_SLOTS = [
  {
    key: "primary",
    question: "Яка ваша основна роль?",
    note: null,
    // UNSIGNED
    hint: "Кіт, який ви берете, коли вибір за вами — те, чим граєте найчастіше.",
    required: true,
  },
  {
    key: "secondary",
    question: "Яка ваша другорядна роль?",
    note: "(В разі, якщо основна використовується кимось іншим)",
    // UNSIGNED
    hint: "Те, на що перемикаєтесь, коли основну вже зайняли в загоні.",
    required: false,
  },
  {
    key: "tertiary",
    question: "Яка ваша третьорядна роль?",
    note: null,
    // UNSIGNED
    hint: "Те, чим ще будете корисним, якщо перші дві зайняті.",
    required: false,
  },
] as const;

/**
 * UNSIGNED — round two's chrome.
 *
 * The clan's source text carried `*` on the first and third questions but not
 * the second. Read as a copy-paste artifact from an existing form: **primary is
 * required, the other two are optional**, which is also the only reading that
 * makes domain sense. Flagged on #55 rather than assumed silently.
 */
export const ROUND_TWO_COPY = {
  eyebrow: "РАУНД 2 / 2",
  title: "ВАШІ РОЛІ",
  criteria:
    "Обирайте за тим, чим реально граєте, а не за тим, чого хочете навчитись. Місця на кіти в загоні обмежені — тому і потрібні три варіанти.",
  slotCounter: (n: number) => `${n} / ${ROLE_SLOTS.length}`,
  taken: "вже обрано",
  skip: "пропустити",
  next: "результат",
} as const;

/** UNSIGNED — round one's own eyebrow, added only because there are now two. */
export const ROUND_ONE_EYEBROW = "РАУНД 1 / 2";

/**
 * #52's ten reason fragments — high form (target ≥ 60) and low form (≤ 40).
 * Ten rather than thirty deliberately, so they survive #69 editing the targets.
 */
export const REASON_FRAGMENTS: Record<
  Exclude<Trait, "LEADERSHIP">,
  { high: string; low: string }
> = {
  AGGRESSION: {
    high: "хочеш бути там, де стріляють",
    low: "не женешся за контактом",
  },
  PATIENCE: {
    high: "готовий довго чекати заради одного моменту",
    low: "не готовий довго сидіти без діла",
  },
  INDEPENDENCE: { high: "хочеш діяти сам", low: "хочеш працювати в зв'язці" },
  ADAPTABILITY: {
    high: "не тримаєшся за початковий план",
    low: "хочеш ясну задачу з початку",
  },
  MAP_PLAY: {
    high: "впливаєш на бій через карту",
    low: "впливаєш на бій своєю стрільбою",
  },
};

/* ═══════════════════════════════════════════════════════
   The returning member — #54's seeded state
   ═══════════════════════════════════════════════════════ */

/**
 * What a returning member already has on file. #54: the grid is seeded from
 * `member_roles` and a Напрямок already on file is offered against the Вибір
 * гравця with no default.
 */
export const MEMBER_ON_FILE = {
  name: "SHVED",
  rank: "RATS",
  directionPrimary: "BACKLINE" as Direction,
  kits: ["RIFLER", "MEDIC", "CE"] as Kit[],
};
