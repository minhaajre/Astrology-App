export interface ProfectionEntry {
  house: number;
  focus: string;
  copy: string;
  planetary_joy?: string;
  how_to_use: string[];
  prompts: string[];
  cautions: string[];
}

export const houseThemes = [
  { house: 1, theme: "Self, personality, appearance, vitality", ages: [12, 24, 36, 48, 60, 72] },
  { house: 2, theme: "Money, resources, possessions, self-worth", ages: [1, 13, 25, 37, 49, 61, 73] },
  { house: 3, theme: "Communication, siblings, short travel, learning", ages: [2, 14, 26, 38, 50, 62, 74] },
  { house: 4, theme: "Home, family, roots, living situation, parents", ages: [3, 15, 27, 39, 51, 63, 75] },
  { house: 5, theme: "Pleasure, romance, creativity, children, fun", ages: [4, 16, 28, 40, 52, 64, 76] },
  { house: 6, theme: "Health, work, daily routine, service, pets", ages: [5, 17, 29, 41, 53, 65, 77] },
  { house: 7, theme: "Relationships, marriage, partnerships, open enemies", ages: [6, 18, 30, 42, 54, 66, 78] },
  { house: 8, theme: "Shared resources, death, transformation, inheritances", ages: [7, 19, 31, 43, 55, 67, 79] },
  { house: 9, theme: "Travel, higher education, philosophy, beliefs", ages: [8, 20, 32, 44, 56, 68, 80] },
  { house: 10, theme: "Career, public image, reputation, life direction", ages: [9, 21, 33, 45, 57, 69, 81] },
  { house: 11, theme: "Friends, groups, hopes, goals, future aspirations", ages: [10, 22, 34, 46, 58, 70, 82] },
  { house: 12, theme: "Secrets, self-undoing, isolation, hidden matters, spirituality", ages: [11, 23, 35, 47, 59, 71, 83] },
];

export const profections: Record<number, ProfectionEntry> = {
  1: {
    house: 1,
    focus: "self, body, identity, vitality, style, presence, personal direction",
    copy: "In a 1st house profection year, attention naturally returns to the self: your body, energy, identity, presentation, and the way you move through the world. This is less about “reinventing” and more about refining what is true and sustainable for you. Notice how your vitality, confidence, and sense of direction respond to your daily choices.",
    how_to_use: [
      "Prioritize consistent routines that support wellbeing",
      "Reduce identity pressure; choose authenticity over image",
      "Track energy and boundaries weekly"
    ],
    prompts: [
      "What version of me is trying to emerge right now?",
      "What strengthens my vitality, and what drains it?",
      "Where am I performing instead of being present?"
    ],
    cautions: [
      "Over-identifying with appearances or roles",
      "Forcing drastic change without stability"
    ]
  },
  2: {
    house: 2,
    focus: "values, self-worth, money, income, skills, possessions, resources",
    copy: "A 2nd house year foregrounds what you value and how you resource your life: finances, earning, spending, possessions, talents, and the relationship between money and self-worth. This year works well for building sustainable foundations—especially when spending aligns with values rather than impulse.",
    how_to_use: [
      "Track income/outflow patterns monthly",
      "Strengthen one core skill or resource stream",
      "Make values explicit before big purchases"
    ],
    prompts: [
      "What do I truly value, beyond comfort or fear?",
      "Where does my money reflect my priorities?",
      "What skill, if strengthened, increases stability?"
    ],
    cautions: [
      "Spending to regulate emotion",
      "Confusing wealth with worth"
    ]
  },
  3: {
    house: 3,
    focus: "communication, learning, mindset, writing, siblings/relatives, local travel, daily crafts",
    copy: "A 3rd house year emphasizes how you think, speak, learn, and connect locally—through writing, teaching, short trips, daily communication, and relationships with siblings or relatives. This can be a year of refining your mental habits and aligning your expression with what is true.",
    how_to_use: [
      "Build a simple writing/learning rhythm",
      "Practice clearer boundaries around information intake",
      "Improve one communication habit (tone, pacing, listening)"
    ],
    prompts: [
      "What narratives shape my choices right now?",
      "How do I communicate under stress?",
      "What daily practice strengthens my mind?"
    ],
    cautions: [
      "Information overload",
      "Speaking/reacting too quickly"
    ]
  },
  4: {
    house: 4,
    focus: "home, family, roots, ancestry, belonging, inner foundation, emotional base",
    copy: "A 4th house year draws attention to your home life, family patterns, ancestry, and the places where you feel safe and rooted. This can be a time to strengthen foundations—literal (home, living situation) and inner (belonging, emotional security, family stories).",
    how_to_use: [
      "Stabilize your living environment",
      "Do reflective work around family patterns (without blame)",
      "Build a private rhythm that supports rest"
    ],
    prompts: [
      "Where do I feel truly at home—inside and outside?",
      "What inherited pattern am I ready to soften?",
      "What foundation do I need before I expand?"
    ],
    cautions: [
      "Avoiding inner work through busyness",
      "Trying to control family dynamics"
    ]
  },
  5: {
    house: 5,
    focus: "joy, creativity, pleasure, romance, hobbies, play, children, vitality",
    copy: "A 5th house year emphasizes joy, creativity, desire, and the life-force that comes from play and expression. It can support creative projects, romance, and hobbies, not as escape but as nourishment. The key is to let pleasure be conscious and aligned, not compulsive.",
    how_to_use: [
      "Schedule regular creative/play time",
      "Express affection with sincerity and boundaries",
      "Track what genuinely restores you"
    ],
    prompts: [
      "What gives me clean joy (not a crash after)?",
      "Where am I withholding my creative voice?",
      "What would playful discipline look like?"
    ],
    cautions: [
      "Indulgence that undermines wellbeing",
      "Seeking validation through attention"
    ]
  },
  6: {
    house: 6,
    focus: "daily work, routines, health habits, service, colleagues, responsibilities, pets",
    copy: "A 6th house year foregrounds routines, health, daily work, and the structure of your life. This is about what you repeatedly do—habits, service, duty, maintenance. It can feel “work heavy,” so the key is building routines that are firm but humane.",
    how_to_use: [
      "Create one sustainable routine stack (sleep, food, movement)",
      "Audit your day for friction points",
      "Improve systems before chasing goals"
    ],
    prompts: [
      "What habit most changes my life if consistent?",
      "Where do I leak energy in daily life?",
      "What does service look like without self-erasure?"
    ],
    cautions: [
      "Overwork and burnout",
      "Harsh self-criticism around productivity"
    ]
  },
  7: {
    house: 7,
    focus: "partnerships, marriage, business partners, clients, contracts, one-to-one dynamics",
    copy: "A 7th house year emphasizes one-to-one relationships: romantic partners, business partners, clients, and close personal bonds. This is often a year of learning through mirrors—how you relate, negotiate, commit, and set boundaries.",
    how_to_use: [
      "Clarify expectations and agreements",
      "Practice repair skills: listening, naming needs, negotiating",
      "Track patterns: pursuit/avoidance, control/surrender"
    ],
    prompts: [
      "What do I truly need from partnership?",
      "What do I repeatedly recreate in one-to-one bonds?",
      "Where does commitment require clearer boundaries?"
    ],
    cautions: [
      "Making promises to avoid discomfort",
      "Repeating relational patterns unconsciously"
    ]
  },
  8: {
    house: 8,
    focus: "transformation, shared resources, taxes, debts, grants, inheritances, intimacy, deep boundaries",
    copy: "An 8th house year emphasizes shared resources and deeper transformation: joint finances, debt, taxes, inheritances (literal or symbolic), and the emotional bonds that require trust and boundaries. This year often asks for clean accounting—financially and emotionally—so that intimacy becomes clearer rather than entangling.",
    how_to_use: [
      "Review shared finances and obligations carefully",
      "Strengthen emotional + financial boundaries",
      "Do honest “what am I carrying that isn’t mine?” reflection"
    ],
    prompts: [
      "What am I merging with, and why?",
      "What debt (emotional or financial) needs clarity?",
      "What part of me wants transformation—and what resists it?"
    ],
    cautions: [
      "Avoiding hard conversations about money/boundaries",
      "Turning intensity into drama"
    ]
  },
  9: {
    house: 9,
    focus: "long-distance travel, higher education, worldview, beliefs, religion/spirituality, philosophy, teaching/publishing",
    copy: "A 9th house year foregrounds meaning: learning, travel, higher education, beliefs, spirituality, philosophy, teaching, and publishing. It’s less about collecting facts and more about expanding perspective in a way that matures character.",
    how_to_use: [
      "Commit to one serious study thread",
      "Revisit beliefs: what’s lived truth vs inherited idea",
      "Teach or publish in a grounded way"
    ],
    prompts: [
      "What do I believe, and why?",
      "What experience expanded my worldview recently?",
      "What wisdom am I meant to live—not just know?"
    ],
    cautions: [
      "Dogmatism or preaching",
      "Escaping daily responsibilities through “big ideas”"
    ]
  },
  10: {
    house: 10,
    focus: "career, vocation, reputation, public role, visibility, leadership, legacy",
    copy: "A 10th house year emphasizes your public life: career direction, authority, responsibility, visibility, and legacy. It invites clarity about what you want to be known for and what path deserves your effort.",
    how_to_use: [
      "Define one core professional aim",
      "Build proof through consistent output",
      "Refine public persona to match reality"
    ],
    prompts: [
      "What am I building that will still matter later?",
      "What responsibility am I ready to hold?",
      "Where is my public image misaligned with truth?"
    ],
    cautions: [
      "Chasing status over substance",
      "Overworking for external approval"
    ]
  },
  11: {
    house: 11,
    focus: "friendships, communities, networks, alliances, groups, hopes, long-term goals",
    copy: "An 11th house year emphasizes friends, communities, collaborators, networks, and the long view—hopes and long-term goals. The invitation is to choose community with discernment: not quantity of connections, but quality of mutual purpose and integrity.",
    how_to_use: [
      "Join or deepen one aligned community",
      "Collaborate with clear roles and expectations",
      "Set a realistic long-term goal and track it"
    ],
    prompts: [
      "Who supports my best self—and how do I support them?",
      "What goal deserves steady investment this year? ",
      "Where do I belong, not just participate?"
    ],
    cautions: [
      "Over-socializing to avoid solitude",
      "Losing direction in group dynamics"
    ]
  },
  12: {
    house: 12,
    focus: "retreat, inner life, hidden patterns, subconscious, dreams, solitude, renewal, endings, spiritual hygiene",
    copy: "A 12th house year emphasizes the inner world: retreat, renewal, hidden patterns, dreams, solitude, and the unseen forces shaping behavior. This year can support deep repair—mental, emotional, spiritual—through simplicity and quiet structure.",
    how_to_use: [
      "Protect sleep and nervous system",
      "Reduce stimulation and increase contemplative time",
      "Do therapy/journaling/retreat work if supportive"
    ],
    prompts: [
      "What pattern repeats when I’m stressed or tired?",
      "What does my nervous system need to feel safe?",
      "What am I ready to release without drama?"
    ],
    cautions: [
      "Isolation without support",
      "Escapism or numbness instead of renewal"
    ]
  }
};
