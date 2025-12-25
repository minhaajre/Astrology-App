export interface NumberMeaning {
  number: number;
  core: string;
  essence: string;
  strengths: string[];
  traps: string[];
  money: string[];
  relationships: string[];
  shadowWork: string;
  careers: string[];
  dailyForecast: string;
  masterLabel?: string;
}

export const masterNumberLabels: Record<number, string> = {
  11: "Inspired Healer",
  22: "Master Builder",
  33: "Master Teacher",
};

export interface SpecialDateInfo {
  date: number;
  theme: string;
  number: number;
  category: string;
  bestFor: string[];
  avoidFor?: string[];
  note?: string;
}

export const specialDates: SpecialDateInfo[] = [
  // Day 1
  { date: 1, theme: "Initiation · Leadership · Independence", number: 1, category: "👑 Leadership & Control", bestFor: ["Starting projects", "Deciding", "Asserting"], avoidFor: ["Waiting", "Indecision"] },
  
  // Day 2
  { date: 2, theme: "Partnership · Sensitivity · Diplomacy", number: 2, category: "❤️ Relationships & Harmony", bestFor: ["Cooperation", "Mediation", "Team work"], avoidFor: ["Confrontation"] },
  
  // Day 3
  { date: 3, theme: "Expression · Creativity · Communication", number: 3, category: "📢 Expression & Visibility", bestFor: ["Content creation", "Marketing", "Speaking"], avoidFor: ["Gossip", "Overpromising"] },
  
  // Day 4
  { date: 4, theme: "Structure · Discipline · Foundations", number: 4, category: "🧱 Structure & Systems", bestFor: ["Planning", "Systems building", "Infrastructure"], avoidFor: ["Shortcuts"] },
  
  // Day 5
  { date: 5, theme: "Change · Movement · Freedom", number: 5, category: "🌍 Change & Travel", bestFor: ["Travel", "Promotion", "Outreach"], avoidFor: ["Long-term commitments", "Rigidity"] },
  
  // Day 6
  { date: 6, theme: "Responsibility · Harmony · Care", number: 6, category: "❤️ Relationships & Harmony", bestFor: ["Relationships", "Family", "Repair work"], avoidFor: ["Over-giving"] },
  
  // Day 7
  { date: 7, theme: "Analysis · Truth · Introspection", number: 7, category: "🧠 Knowledge & Strategy", bestFor: ["Research", "Strategy", "Reflection"], avoidFor: ["Forcing outcomes"] },
  
  // Day 8
  { date: 8, theme: "Money · Power · Authority", number: 8, category: "💰 Money & Wealth", bestFor: ["Business decisions", "Negotiations", "Finance"], avoidFor: ["Emotional decisions"] },
  
  // Day 9
  { date: 9, theme: "Completion · Release · Closure", number: 9, category: "🔮 Completion & Transition", bestFor: ["Endings", "Finishing projects", "Letting go"], avoidFor: ["Starting long-term ventures"] },
  
  // Day 10 (1+0=1)
  { date: 10, theme: "Leadership Reset · Authority", number: 1, category: "👑 Leadership & Control", bestFor: ["Strategic direction", "Rebranding"], avoidFor: ["Hesitation"], note: "Double-digit: How to achieve leadership. Single-digit: Where it ends (1)" },
  
  // Day 11 - MASTER NUMBER
  { date: 11, theme: "Intuition · Insight · Sensitivity", number: 11, category: "🧩 Master Numbers", bestFor: ["Vision", "Creativity", "Spiritual work"], avoidFor: ["Emotional overload"], note: "Master Number 11: Vision with high emotional cost" },
  
  // Day 12 (1+2=3)
  { date: 12, theme: "Structured Communication", number: 3, category: "📢 Expression & Visibility", bestFor: ["Writing pitches", "Negotiation", "PR strategy"], avoidFor: ["Charm without clarity"], note: "Double-digit: Persuasive messaging. Reduces to 3" },
  
  // Day 13 (1+3=4)
  { date: 13, theme: "Forced Discipline · Hard Work", number: 4, category: "🧱 Structure & Systems", bestFor: ["Restructuring", "System building"], avoidFor: ["Laziness"], note: "Double-digit: Pressure to build. Reduces to 4" },
  
  // Day 14 (1+4=5)
  { date: 14, theme: "Unstable Change · Risk", number: 5, category: "🌍 Change & Travel", bestFor: ["Controlled transitions"], avoidFor: ["Recklessness", "Addiction"], note: "Double-digit: High-risk energy. Reduces to 5" },
  
  // Day 15 (1+5=6)
  { date: 15, theme: "Attraction · Magnetism · Bonding", number: 6, category: "❤️ Relationships & Harmony", bestFor: ["Dates", "Reconciliation", "Client relationships"], avoidFor: ["Manipulation"], note: "Double-digit: Social magnetism. Reduces to 6" },
  
  // Day 16 (1+6=7)
  { date: 16, theme: "Reality Check · Ego Collapse", number: 7, category: "🧠 Knowledge & Strategy", bestFor: ["Audits", "Truth-seeking"], avoidFor: ["Pride", "Denial"], note: "Double-digit: Can be humbling. Reduces to 7" },
  
  // Day 17 (1+7=8)
  { date: 17, theme: "Earned Wealth · Disciplined Power", number: 8, category: "💰 Money & Wealth", bestFor: ["Long-term investments", "Leadership"], avoidFor: ["Ego", "Isolation"], note: "Double-digit: Earned success through discipline. Reduces to 8" },
  
  // Day 18 (1+8=9)
  { date: 18, theme: "Karmic Clearing", number: 9, category: "🔮 Completion & Transition", bestFor: ["Closure tied to power/money"], avoidFor: ["Revenge"], note: "Double-digit: Karmic weight. Reduces to 9" },
  
  // Day 19 (1+9=10→1)
  { date: 19, theme: "Independent Leadership", number: 1, category: "👑 Leadership & Control", bestFor: ["Solo decisions", "Independence", "Exits"], avoidFor: ["Burning bridges"], note: "Double-digit: Independence path. Reduces to 1" },
  
  // Day 20 (2+0=2)
  { date: 20, theme: "Heightened Sensitivity · Cooperation", number: 2, category: "❤️ Relationships & Harmony", bestFor: ["Negotiation", "Diplomacy"], avoidFor: ["Emotional dependency"], note: "Double-digit: Amplified intuition. Reduces to 2" },
  
  // Day 21 (2+1=3)
  { date: 21, theme: "Social Expansion · Networking", number: 3, category: "📢 Expression & Visibility", bestFor: ["Collaboration", "Community building"], avoidFor: ["Overcommitment"], note: "Double-digit: People-centered expression. Reduces to 3" },
  
  // Day 22 - MASTER NUMBER
  { date: 22, theme: "Master Builder · Large-Scale Execution", number: 22, category: "🧱 Structure & Systems", bestFor: ["Institutions", "Long-term projects"], avoidFor: ["Misuse of power"], note: "Master Number 22: Builds systems that outlast the individual" },
  
  // Day 23 (2+3=5)
  { date: 23, theme: "Communication-Driven Change", number: 5, category: "🌍 Change & Travel", bestFor: ["Marketing", "Sales", "Media"], avoidFor: ["Gossip"], note: "Double-digit: Words drive movement. Reduces to 5" },
  
  // Day 24 (2+4=6)
  { date: 24, theme: "Domestic Stability · Trust", number: 6, category: "❤️ Relationships & Harmony", bestFor: ["Housing", "Family agreements"], avoidFor: ["Stagnation"], note: "Double-digit: Long-term trust. Reduces to 6" },
  
  // Day 25 (2+5=7)
  { date: 25, theme: "Strategic Withdrawal", number: 7, category: "🧠 Knowledge & Strategy", bestFor: ["Review", "Recalibration"], avoidFor: ["Rushing"], note: "Double-digit: Pause for wisdom. Reduces to 7" },
  
  // Day 26 (2+6=8)
  { date: 26, theme: "Partnership Wealth · Contracts", number: 8, category: "💰 Money & Wealth", bestFor: ["Joint ventures", "Legal matters"], avoidFor: ["Unequal effort"], note: "Double-digit: Shared power dynamics. Reduces to 8" },
  
  // Day 27 (2+7=9)
  { date: 27, theme: "Spiritual Completion", number: 9, category: "🔮 Completion & Transition", bestFor: ["Reflection", "Endings"], avoidFor: ["Attachment"], note: "Double-digit: Soul-level closure. Reduces to 9" },
  
  // Day 28 (2+8=10→1)
  { date: 28, theme: "Money Reset · Forced Independence", number: 1, category: "💰 Money & Wealth", bestFor: ["Business launches", "Financial pivots"], avoidFor: ["Relying on others"], note: "Most emphasized money day. Reduces to 1" },
  
  // Day 29 (2+9=11)
  { date: 29, theme: "Emotional Mastery · Tests", number: 11, category: "🧩 Master Numbers", bestFor: ["Inner work", "Compassion"], avoidFor: ["Emotional extremes"], note: "Double-digit: Emotional insight. Master energy" },
  
  // Day 30 (3+0=3)
  { date: 30, theme: "Visibility Spike · Big Expression", number: 3, category: "📢 Expression & Visibility", bestFor: ["Announcements", "Creative pushes"], avoidFor: ["Careless reputation damage"], note: "Double-digit: Maximum visibility. Reduces to 3" },
];

export const numberMeanings: Record<number, NumberMeaning> = {
  1: {
    number: 1,
    core: "Leadership & Self-Direction",
    essence: "The Pioneer. You are the initiator, the spark that starts the fire. Number 1 carries the energy of new beginnings, independence, and the courage to forge your own path. You are meant to lead, not follow. Your soul craves autonomy, and you thrive when you can make your own decisions without seeking approval. The world needs your vision and your willingness to go first where others hesitate.",
    strengths: ["Natural leadership ability", "Strong initiative and drive", "Courage to take risks", "Original thinking", "Self-reliance", "Determination"],
    traps: ["Ego and arrogance", "Impatience with others", "Isolation and loneliness", "Stubbornness", "Fear of asking for help", "Dominating conversations"],
    money: ["Best when leading your own ventures", "Thrives as entrepreneur or CEO", "Avoid partnerships that limit control", "Wealth comes through bold decisions"],
    relationships: ["Needs respect and space to lead", "Attracted to confident partners", "Must balance independence with intimacy", "Can struggle with compromise"],
    shadowWork: "Learn that true strength includes vulnerability. Your independence is a gift, but isolation is a trap. The greatest leaders lift others—they don't stand alone on a pedestal.",
    careers: ["Entrepreneur", "CEO", "Military Officer", "Surgeon", "Inventor", "Director", "Life Coach"],
    dailyForecast: "Today favors bold action. Take initiative on something you've been putting off. Your confidence is magnetic—use it to inspire others, not to overpower them."
  },
  2: {
    number: 2,
    core: "Cooperation & Diplomacy",
    essence: "The Mediator. You are the bridge between opposing forces, the gentle hand that brings harmony where there was conflict. Number 2 vibrates with the energy of partnership, intuition, and emotional intelligence. You sense what others miss—the unspoken feelings, the hidden tensions. Your power lies not in force, but in patience and the art of listening. You are the peacemaker the world desperately needs.",
    strengths: ["Deep emotional intelligence", "Natural mediator and peacemaker", "Excellent listener", "Patient and supportive", "Intuitive perception", "Collaborative spirit"],
    traps: ["Indecision and self-doubt", "People-pleasing at your own expense", "Over-sensitivity to criticism", "Codependency", "Avoiding conflict", "Losing yourself in relationships"],
    money: ["Best in team environments", "Thrives in partnerships and collaborations", "Avoid high-risk solo ventures", "Steady accumulation over time"],
    relationships: ["Needs safety and emotional consistency", "Deeply loyal partner", "Requires open communication", "May attract dominant personalities"],
    shadowWork: "Your kindness is not weakness, but learn to set boundaries. Saying 'no' doesn't make you unkind—it makes you honest. True peace starts within, not in pleasing everyone around you.",
    careers: ["Counselor", "Mediator", "Diplomat", "HR Specialist", "Nurse", "Social Worker", "Assistant", "Therapist"],
    dailyForecast: "Collaboration is your superpower today. Seek partnerships and listen more than you speak. Your intuition is heightened—trust the subtle messages you receive."
  },
  3: {
    number: 3,
    core: "Expression & Communication",
    essence: "The Artist. You are the voice, the creative spark, the one who turns thoughts into words and emotions into art. Number 3 carries the vibration of joy, creativity, and self-expression. You have a gift for making the complex simple, the heavy light. Your words can heal, inspire, or entertain—but this same power can wound if misused. You are here to create and communicate your unique truth.",
    strengths: ["Creative expression", "Excellent communication skills", "Humor and wit", "Social magnetism", "Optimism and enthusiasm", "Artistic talent"],
    traps: ["Scattered focus and unfinished projects", "Mood-driven speech and actions", "Superficiality", "Gossip and careless words", "Escapism", "Fear of deeper emotions"],
    money: ["Monetize your voice—writing, speaking, content", "Teaching and coaching opportunities", "Creative industries favor you", "Multiple income streams work well"],
    relationships: ["Needs fun, laughter, and honesty", "Expressive and affectionate", "May avoid deep emotional conversations", "Requires mental stimulation"],
    shadowWork: "Your light is a gift, but don't use humor to hide from pain. Depth doesn't diminish your brightness—it grounds it. Learn to finish what you start; completion brings mastery.",
    careers: ["Writer", "Public Speaker", "Actor", "Artist", "Marketing Creative", "Teacher", "Content Creator", "Comedian"],
    dailyForecast: "Express yourself today. Write, speak, create, or share something meaningful. Your words carry extra weight—use them to uplift rather than criticize."
  },
  4: {
    number: 4,
    core: "Structure & Discipline",
    essence: "The Builder. You are the foundation upon which great things are constructed. Number 4 resonates with order, hard work, and determination. While others dream, you build. You have the rare ability to turn vision into reality through methodical effort. Stability isn't boring to you—it's the platform from which empires rise. The world needs your reliability and your commitment to doing things right.",
    strengths: ["Reliability and trustworthiness", "Strong work ethic", "Systematic thinking", "Attention to detail", "Patience and perseverance", "Practical problem-solving"],
    traps: ["Rigidity and resistance to change", "Workaholism", "Stubbornness", "Missing the big picture", "Control issues", "Fear of taking risks"],
    money: ["Build long-term assets", "Real estate and investments suit you", "Avoid get-rich-quick schemes", "Wealth through steady accumulation"],
    relationships: ["Needs loyalty and consistency", "Shows love through actions, not words", "May struggle with emotional expression", "Provides security to loved ones"],
    shadowWork: "Structure serves life—don't let it imprison it. Learn to bend without breaking. Not everything valuable can be measured or scheduled. Allow spontaneity in small doses.",
    careers: ["Architect", "Engineer", "Accountant", "Project Manager", "Contractor", "Systems Analyst", "Administrator", "Surgeon"],
    dailyForecast: "Focus on building something lasting today. Tackle tasks that require patience and precision. Your discipline is your advantage—use it to make progress on long-term goals."
  },
  5: {
    number: 5,
    core: "Change & Freedom",
    essence: "The Adventurer. You are the wind—impossible to contain, always in motion, bringing change wherever you go. Number 5 vibrates with freedom, curiosity, and the thrill of new experiences. You are here to explore, to taste all that life offers, to break free from limitations. Routine is your enemy; variety is your fuel. Through your experiences, you gain wisdom that others can only read about.",
    strengths: ["Adaptability and flexibility", "Sales and persuasion ability", "Curiosity and open-mindedness", "Courage for adventure", "Quick thinking", "Magnetic personality"],
    traps: ["Restlessness and instability", "Impulsive decisions", "Commitment phobia", "Overindulgence in sensory pleasures", "Irresponsibility", "Scattered energy"],
    money: ["Fast cycles and variety work best", "Sales and commission-based income", "Multiple streams and side hustles", "Avoid long-term commitments that feel restrictive"],
    relationships: ["Needs independence and excitement", "Fears being trapped or controlled", "Must balance freedom with commitment", "Requires a partner who grows with you"],
    shadowWork: "Freedom without roots is just running away. Learn that commitment can be liberating, not constraining. The deepest adventures happen within, not just outside.",
    careers: ["Sales Representative", "Travel Writer", "Pilot", "Entrepreneur", "Marketing Strategist", "Tour Guide", "Journalist", "Stunt Performer"],
    dailyForecast: "Embrace change today—something unexpected may shift your plans for the better. Your adaptability is needed. Stay curious and say yes to new opportunities."
  },
  6: {
    number: 6,
    core: "Care & Responsibility",
    essence: "The Nurturer. You are the heart of the home, the one who creates sanctuaries and holds families together. Number 6 carries the energy of love, responsibility, and service. You find purpose in caring for others, in creating beauty and harmony in your environment. Your sense of duty is profound, and your capacity for love runs deep. You are the rock that others lean on in times of need.",
    strengths: ["Nurturing and supportive nature", "Strong sense of responsibility", "Creating beauty and harmony", "Loyalty and devotion", "Community building", "Healing presence"],
    traps: ["Over-giving until depleted", "Control disguised as care", "Martyrdom and guilt", "Difficulty receiving", "Meddling in others' lives", "Neglecting self-care"],
    money: ["Steady service-based income", "Healthcare and wellness fields", "Home-related businesses", "Teaching and mentoring roles"],
    relationships: ["Needs commitment and appreciation", "Deeply devoted partner", "May over-sacrifice for loved ones", "Creates beautiful home environments"],
    shadowWork: "Your love is not a debt others must repay. Give freely or not at all. Taking care of yourself is not selfish—it's necessary. You cannot pour from an empty cup.",
    careers: ["Nurse", "Teacher", "Interior Designer", "Chef", "Counselor", "Veterinarian", "Social Worker", "Event Planner"],
    dailyForecast: "Your nurturing energy is needed today. Care for someone who needs support, but don't forget yourself. Create something beautiful in your environment."
  },
  7: {
    number: 7,
    core: "Truth & Inner Mastery",
    essence: "The Seeker. You are the philosopher, the mystic, the one who looks beyond the surface to find deeper meaning. Number 7 vibrates with the frequency of spiritual wisdom, analytical precision, and inner knowing. You are not satisfied with easy answers—you dig until you find truth. Your mind is a powerful instrument for pattern recognition and research. In a world of noise, you seek the silence where wisdom whispers.",
    strengths: ["Deep research abilities", "Pattern recognition", "Spiritual depth and intuition", "Analytical precision", "Independent thinking", "Wisdom and insight"],
    traps: ["Cynicism and distrust", "Isolation and withdrawal", "Overthinking and analysis paralysis", "Fear of vulnerability", "Intellectual arrogance", "Depression from disconnection"],
    money: ["Wealth through expertise", "Consulting and specialized knowledge", "Research and development", "Avoid partnership-dependent ventures"],
    relationships: ["Needs depth and authenticity", "Requires significant alone time", "Trust is earned slowly", "Values intellectual connection"],
    shadowWork: "Knowledge without connection is lonely. Your fortress of analysis can become a prison. Let people in. Wisdom includes knowing that some truths are felt, not thought.",
    careers: ["Researcher", "Scientist", "Philosopher", "Analyst", "Professor", "Detective", "Programmer", "Spiritual Teacher"],
    dailyForecast: "Seek solitude and reflection today. Answers you've been searching for may surface in quiet moments. Trust your intuition over external opinions."
  },
  8: {
    number: 8,
    core: "Power & Material Mastery",
    essence: "The Executive. You are meant for positions of authority and influence. Number 8 carries the vibration of abundance, power, and karmic balance. What you send out returns multiplied—for better or worse. You have the capacity to build empires, to create lasting wealth, to command respect. But this power comes with responsibility. Your relationship with money and authority defines your path.",
    strengths: ["Executive leadership", "Strategic thinking", "Financial acumen", "Authority and presence", "Goal achievement", "Organizational ability"],
    traps: ["Control and domination", "Material obsession", "Harshness and intimidation", "Karmic backlash from misused power", "Workaholism", "Measuring worth by wealth"],
    money: ["High ceiling with integrity", "Business ownership and investment", "Real estate and large-scale ventures", "Karma affects finances directly"],
    relationships: ["Needs trust and mutual respect", "Can dominate or be dominated", "Power dynamics must be balanced", "Provides security but may neglect emotions"],
    shadowWork: "Power reveals character—it doesn't create it. The goal isn't to have power over others, but over yourself. Money is a tool, not a measure of your worth.",
    careers: ["CEO", "Financial Advisor", "Real Estate Developer", "Banker", "Judge", "Politician", "Business Owner", "Corporate Attorney"],
    dailyForecast: "Financial and career matters are highlighted today. Make bold decisions about money or authority. What you give returns amplified—be generous and ethical."
  },
  9: {
    number: 9,
    core: "Completion & Universal Love",
    essence: "The Humanitarian. You are the old soul, the one who has walked many paths and gained wisdom from each. Number 9 vibrates with completion, universal love, and selfless service. You see the bigger picture when others are lost in details. Your purpose transcends personal gain—you are here to leave the world better than you found it. Endings and transformations are your territory.",
    strengths: ["Compassion and empathy", "Big-picture vision", "Artistic and creative talent", "Wisdom from experience", "Humanitarian drive", "Transformational leadership"],
    traps: ["Martyrdom complex", "Difficulty letting go", "Messiah syndrome", "Emotional overwhelm", "Unresolved past trauma", "Resentment from over-giving"],
    money: ["Impact-driven wealth creation", "Non-profit and social enterprise", "Arts and healing professions", "Money flows when aligned with purpose"],
    relationships: ["Needs shared vision and purpose", "Old soul seeking depth", "Must release attachment to outcomes", "Loves unconditionally"],
    shadowWork: "You cannot save everyone, and that's not your burden. Endings are not failures—they are completions. Let go of what has served its purpose so something new can begin.",
    careers: ["Humanitarian Worker", "Artist", "Healer", "Activist", "Filmmaker", "Philanthropist", "Life Coach", "End-of-Life Counselor"],
    dailyForecast: "Focus on the bigger picture today. Release something that has run its course. Your compassion can make a real difference—serve without expectation of return."
  },
  11: {
    number: 11,
    core: "Master Intuition & Illumination",
    masterLabel: "Inspired Healer",
    essence: "The Inspired Healer. You carry a double dose of the pioneering 1 energy, but elevated to a spiritual plane. Number 11 is the first Master Number—a channel for higher wisdom, intuitive downloads, and inspirational leadership. You are here to illuminate, to inspire, to awaken others to possibilities they couldn't see. Your sensitivity is both your gift and your challenge. You walk between worlds.",
    strengths: ["Powerful intuition and psychic ability", "Inspirational presence", "Visionary leadership", "Magnetic charisma", "Spiritual depth", "Bridge between spiritual and material"],
    traps: ["Nervous system overload", "Anxiety and hypersensitivity", "Unrealistic expectations", "Spiritual bypassing", "Difficulty grounding", "Overwhelming intensity"],
    money: ["Best as visionary or spiritual leader", "Consulting and inspirational speaking", "Avoid mundane, routine work", "Income through influence"],
    relationships: ["Needs grounding partner", "Intense emotional connections", "May overwhelm less sensitive people", "Spiritual bond is essential"],
    shadowWork: "Your light is meant to be shared, not hidden. But you must ground your vision in reality. The nervous system needs care—meditation, nature, and rest are not optional.",
    careers: ["Spiritual Teacher", "Intuitive Coach", "Inspirational Speaker", "Artist", "Musician", "Inventor", "Visionary Leader", "Healer"],
    dailyForecast: "Your intuition is extra sharp today. Pay attention to downloads, signs, and synchronicities. Share your vision with someone who needs inspiration."
  },
  22: {
    number: 22,
    core: "Master Builder",
    masterLabel: "Master Builder",
    essence: "The Architect of Dreams. You carry the practical foundation of the 4 doubled and elevated to mastery. Number 22 is the most powerful number for manifesting large-scale visions into reality. You don't just dream—you build dreams that serve humanity. You think in terms of systems, institutions, and legacies that outlast a single lifetime. The pressure is immense, but so is the potential.",
    strengths: ["Massive execution capability", "Legacy thinking", "Practical idealism", "System building", "Organizational genius", "Uniting vision with action"],
    traps: ["Crushing pressure and expectation", "Fear of failure", "Workaholic tendencies", "Perfectionism", "Overwhelm from big vision", "Ignoring personal needs"],
    money: ["Scale systems for income", "Infrastructure and institution building", "Large-scale business", "Generational wealth potential"],
    relationships: ["Needs stable, supportive partner", "Work can overshadow relationships", "Requires understanding of mission", "Loyal and committed"],
    shadowWork: "Not every vision requires completion in your lifetime. Learn to delegate and trust others. Your worth is not determined by the scale of your achievements.",
    careers: ["Architect", "Urban Planner", "CEO of Large Corporation", "Political Leader", "Infrastructure Developer", "Philanthropist", "Technology Founder", "Institution Builder"],
    dailyForecast: "Think big and plan strategically today. Your capacity to turn vision into reality is amplified. Focus on building something that will outlast you."
  },
  33: {
    number: 33,
    core: "Master Teacher",
    masterLabel: "Master Teacher",
    essence: "The Cosmic Nurturer. You carry the loving responsibility of the 6 doubled and raised to universal service. Number 33 is the rarest Master Number—the master teacher, healer, and uplifter of humanity. You feel the suffering of the world and are called to ease it. Your life is devoted to service on a scale that transcends personal interests. The weight is heavy, but your capacity for love is limitless.",
    strengths: ["Profound healing ability", "Universal love and compassion", "Teaching and uplifting humanity", "Self-sacrifice for higher good", "Emotional wisdom", "Transformational presence"],
    traps: ["Excessive self-sacrifice", "Savior complex", "Emotional burnout", "Neglecting personal boundaries", "Feeling responsible for everyone's pain", "Martyrdom"],
    money: ["Earn through uplifting others", "Education and healing professions", "Non-profit and spiritual work", "Money as tool for service"],
    relationships: ["Needs reciprocity and appreciation", "May over-give in relationships", "Attracts those who need healing", "Must maintain boundaries"],
    shadowWork: "You cannot heal the world by depleting yourself. Healthy boundaries are not selfish—they are necessary. Receive as openly as you give.",
    careers: ["Spiritual Master", "Renowned Healer", "Humanitarian Leader", "University Professor", "Medical Pioneer", "Religious Leader", "Global Philanthropist"],
    dailyForecast: "Your healing presence is needed. Teach, guide, or simply be present for someone who needs you. But also take time to receive—you deserve care too."
  }
};

export const vietnamAnimals = ["Rat", "Buffalo", "Tiger", "Cat", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

export const animalFriends: Record<string, string[]> = {
  Rat: ["Dragon", "Monkey", "Buffalo"],
  Buffalo: ["Snake", "Rooster", "Rat"],
  Tiger: ["Horse", "Dog", "Pig"],
  Cat: ["Goat", "Pig", "Dog"],
  Dragon: ["Rat", "Monkey", "Rooster"],
  Snake: ["Buffalo", "Rooster", "Monkey"],
  Horse: ["Tiger", "Dog", "Goat"],
  Goat: ["Cat", "Pig", "Horse"],
  Monkey: ["Rat", "Dragon", "Snake"],
  Rooster: ["Buffalo", "Snake", "Dragon"],
  Dog: ["Tiger", "Horse", "Cat"],
  Pig: ["Cat", "Goat", "Tiger"]
};

export const animalEnemiesPrimary: Record<string, string[]> = {
  Rat: ["Horse"],
  Buffalo: ["Goat"],
  Tiger: ["Monkey"],
  Cat: ["Rooster"],
  Dragon: ["Dog"],
  Snake: ["Pig"],
  Horse: ["Rat"],
  Goat: ["Buffalo"],
  Monkey: ["Tiger"],
  Rooster: ["Cat"],
  Dog: ["Dragon"],
  Pig: ["Snake"]
};

export const animalEnemiesSecondary: Record<string, string[]> = {
  Rat: ["Goat"],
  Buffalo: ["Horse"],
  Tiger: ["Snake"],
  Cat: ["Dragon"],
  Dragon: ["Cat"],
  Snake: ["Tiger"],
  Horse: ["Buffalo"],
  Goat: ["Rat"],
  Monkey: ["Pig"],
  Rooster: ["Dog"],
  Dog: ["Rooster"],
  Pig: ["Monkey"]
};

export const letterMap: Record<string, number> = {};
"AJS".split("").forEach(c => letterMap[c] = 1);
"BKT".split("").forEach(c => letterMap[c] = 2);
"CLU".split("").forEach(c => letterMap[c] = 3);
"DMV".split("").forEach(c => letterMap[c] = 4);
"ENW".split("").forEach(c => letterMap[c] = 5);
"FOX".split("").forEach(c => letterMap[c] = 6);
"GPY".split("").forEach(c => letterMap[c] = 7);
"HQZ".split("").forEach(c => letterMap[c] = 8);
"IR".split("").forEach(c => letterMap[c] = 9);

export const vowels = new Set(["A", "E", "I", "O", "U"]);

export function reduceToSingleDigit(n: number): number {
  while (true) {
    if (n === 11 || n === 22 || n === 33) return n;
    if (n < 10) return n;
    n = String(n).split("").reduce((a, d) => a + Number(d), 0);
  }
}

export function sumDigitsOfString(s: string): number {
  return s.split("").reduce((a, ch) => a + (/\d/.test(ch) ? Number(ch) : 0), 0);
}

export function getLifePath(dob: Date): { lifePath: number; rawTotal: number; mm: string; dd: string; yyyy: string } {
  const mm = String(dob.getMonth() + 1).padStart(2, "0");
  const dd = String(dob.getDate()).padStart(2, "0");
  const yyyy = String(dob.getFullYear());
  const raw = sumDigitsOfString(mm + dd + yyyy);
  return { lifePath: reduceToSingleDigit(raw), rawTotal: raw, mm, dd, yyyy };
}

export function getDayNumber(dob: Date): number {
  return reduceToSingleDigit(dob.getDate());
}

export function getMonthNumber(dob: Date): number {
  return reduceToSingleDigit(dob.getMonth() + 1);
}

export function getVietnamAnimal(year: number): string {
  let idx = (year - 2020) % 12;
  if (idx < 0) idx += 12;
  return vietnamAnimals[idx];
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  dates: string;
}

const zodiacSigns: Record<string, ZodiacSign> = {
  Capricorn: { name: "Capricorn", symbol: "♑", element: "Earth", dates: "Dec 22 - Jan 19" },
  Aquarius: { name: "Aquarius", symbol: "♒", element: "Air", dates: "Jan 20 - Feb 18" },
  Pisces: { name: "Pisces", symbol: "♓", element: "Water", dates: "Feb 19 - Mar 20" },
  Aries: { name: "Aries", symbol: "♈", element: "Fire", dates: "Mar 21 - Apr 19" },
  Taurus: { name: "Taurus", symbol: "♉", element: "Earth", dates: "Apr 20 - May 20" },
  Gemini: { name: "Gemini", symbol: "♊", element: "Air", dates: "May 21 - Jun 20" },
  Cancer: { name: "Cancer", symbol: "♋", element: "Water", dates: "Jun 21 - Jul 22" },
  Leo: { name: "Leo", symbol: "♌", element: "Fire", dates: "Jul 23 - Aug 22" },
  Virgo: { name: "Virgo", symbol: "♍", element: "Earth", dates: "Aug 23 - Sep 22" },
  Libra: { name: "Libra", symbol: "♎", element: "Air", dates: "Sep 23 - Oct 22" },
  Scorpio: { name: "Scorpio", symbol: "♏", element: "Water", dates: "Oct 23 - Nov 21" },
  Sagittarius: { name: "Sagittarius", symbol: "♐", element: "Fire", dates: "Nov 22 - Dec 21" },
};

export function getZodiacSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns.Capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns.Aquarius;
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns.Pisces;
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns.Aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns.Taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns.Gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns.Cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns.Leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns.Virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns.Libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns.Scorpio;
  return zodiacSigns.Sagittarius;
}

export function generateDailyInsight(todayNumber: number, weekNumber: number, monthNumber: number, zodiacSign: ZodiacSign, yearAnimal: string, monthAnimal: string): string {
  const todayMeaning = numberMeanings[todayNumber];
  const weekMeaning = numberMeanings[weekNumber];
  const monthMeaning = numberMeanings[monthNumber];
  
  const insights: string[] = [];
  
  if (todayNumber === weekNumber && weekNumber === monthNumber) {
    insights.push(`All cycles align on ${todayMeaning.core.toLowerCase()} — extraordinary clarity and momentum today.`);
  } else if (todayNumber === weekNumber || todayNumber === monthNumber) {
    insights.push(`Today's ${todayMeaning.core.toLowerCase()} reinforces the week's energy.`);
  } else {
    insights.push(`Today's ${todayMeaning.core.toLowerCase()} flows with the month's ${monthMeaning.core.toLowerCase()} theme.`);
  }

  if (monthAnimal === yearAnimal) {
    return insights[0] + ` Your ${yearAnimal} energy peaks this month — embrace opportunities in ${zodiacSign.element.toLowerCase()} matters.`;
  }
  
  return insights[0] + ` The ${monthAnimal} month brings ${zodiacSign.name} into focus — balance action with reflection.`;
}

export function getAnimalCompatibility(animalA: string, animalB: string): 'Good' | 'Neutral' | 'Enemies' {
  if (animalA === animalB) return 'Good';
  if ((animalFriends[animalA] || []).includes(animalB)) return 'Good';
  if ((animalEnemiesPrimary[animalA] || []).includes(animalB)) return 'Enemies';
  if ((animalEnemiesSecondary[animalA] || []).includes(animalB)) return 'Enemies';
  return 'Neutral';
}

// Get the zodiac animal for the current year
export function getCurrentYearAnimal(date: Date = new Date()): string {
  return getVietnamAnimal(date.getFullYear());
}

// Get the zodiac animal for the current month (Vietnamese lunar month mapping)
// Months cycle through the 12 animals starting with Tiger for month 1 (January)
export function getMonthAnimal(date: Date = new Date()): string {
  const monthIndex = date.getMonth(); // 0-11
  // Vietnamese zodiac months: Tiger starts at month 1 (January/Tháng Giêng)
  const monthAnimals = ["Tiger", "Cat", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig", "Rat", "Buffalo"];
  return monthAnimals[monthIndex];
}

// Evaluate if two numbers have good harmony, are neutral, or are challenging
export type NumberStatus = 'Good' | 'Neutral' | 'Challenging';

export function evaluateNumberHarmony(numberA: number, numberB: number): NumberStatus {
  // Same numbers are always good
  if (numberA === numberB) return 'Good';
  
  // Define harmonious pairs (complementary energies)
  const harmoniousPairs: [number, number][] = [
    [1, 9], [1, 5], [2, 6], [2, 8], [3, 6], [3, 9],
    [4, 8], [5, 7], [6, 9], [7, 9], [11, 2], [22, 4], [33, 6]
  ];
  
  // Define challenging pairs (conflicting energies)
  const challengingPairs: [number, number][] = [
    [1, 8], [2, 5], [3, 4], [4, 5], [6, 7], [7, 8],
    [1, 4], [2, 7], [3, 8], [5, 9]
  ];
  
  // Check harmonious
  for (const [a, b] of harmoniousPairs) {
    if ((numberA === a && numberB === b) || (numberA === b && numberB === a)) {
      return 'Good';
    }
  }
  
  // Check challenging
  for (const [a, b] of challengingPairs) {
    if ((numberA === a && numberB === b) || (numberA === b && numberB === a)) {
      return 'Challenging';
    }
  }
  
  return 'Neutral';
}

// Evaluate overall cycle alignment for personal year/month/day
export function evaluateCycleStatus(lifePath: number, personalCycle: number): NumberStatus {
  // Use the harmony evaluation between life path and personal cycle
  return evaluateNumberHarmony(lifePath, personalCycle);
}

export const animalIconNames: Record<string, string> = {
  Rat: "🐭",
  Buffalo: "🐃",
  Tiger: "🐯",
  Cat: "🐱",
  Dragon: "🐉",
  Snake: "🐍",
  Horse: "🐴",
  Goat: "🐐",
  Monkey: "🐵",
  Rooster: "🐓",
  Dog: "🐶",
  Pig: "🐷"
};

export function getUniversalYear(date: Date = new Date()): number {
  return reduceToSingleDigit(sumDigitsOfString(String(date.getFullYear())));
}

export function getPersonalYear(dob: Date, date: Date = new Date()): number {
  const monthNum = reduceToSingleDigit(dob.getMonth() + 1);
  const dayNum = reduceToSingleDigit(dob.getDate());
  
  // Check if the current date is before the birthday this year
  const currentYear = date.getFullYear();
  const birthdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());
  
  // If current date is before birthday, use previous year's universal year
  const yearForCalculation = date < birthdayThisYear ? currentYear - 1 : currentYear;
  const uy = reduceToSingleDigit(sumDigitsOfString(String(yearForCalculation)));
  
  return reduceToSingleDigit(monthNum + dayNum + uy);
}

export function getPersonalMonth(dob: Date, date: Date = new Date()): number {
  const py = getPersonalYear(dob, date);
  const currentMonth = reduceToSingleDigit(date.getMonth() + 1);
  return reduceToSingleDigit(py + currentMonth);
}

export function getPersonalDay(dob: Date, date: Date = new Date()): number {
  const pm = getPersonalMonth(dob, date);
  const currentDay = reduceToSingleDigit(date.getDate());
  return reduceToSingleDigit(pm + currentDay);
}

export function getNameNumerology(name: string): { 
  clean: string; 
  expressionNumber: number; 
  soulUrge: number; 
  personality: number 
} {
  const clean = (name || "").toUpperCase().replace(/[^A-Z]/g, "");
  let sum = 0, vowelSum = 0, consonantSum = 0;
  for (const ch of clean) {
    const v = letterMap[ch] || 0;
    sum += v;
    if (vowels.has(ch)) vowelSum += v;
    else consonantSum += v;
  }
  return {
    clean,
    expressionNumber: reduceToSingleDigit(sum),
    soulUrge: reduceToSingleDigit(vowelSum),
    personality: reduceToSingleDigit(consonantSum)
  };
}

export function getArabicNumerology(name: string): { 
  clean: string; 
  total: number; 
  reduced: number;
  intensity: number;
} | null {
  if (!name || !name.trim()) return null;
  
  const clean = (name || "").trim();
  let total = 0;
  
  for (const ch of clean) {
    total += abjadMap[ch] || 0;
  }
  
  return {
    clean,
    total,
    reduced: reduceToSingleDigit(total),
    intensity: Math.floor(total / clean.length)
  };
}

export function getNextYearsByAnimals(targetAnimals: string[], count: number, startYear: number): { year: number; animal: string }[] {
  const out: { year: number; animal: string }[] = [];
  let y = startYear;
  while (out.length < count) {
    const a = getVietnamAnimal(y);
    if (targetAnimals.includes(a)) out.push({ year: y, animal: a });
    y += 1;
  }
  return out;
}

export interface CompatibilityResult {
  totalScore: number;
  breakdown: {
    category: string;
    personA: number | string;
    personB: number | string;
    points: number;
    maxPoints: number;
    explanation: string;
  }[];
}

export function getRelationType(a: number, b: number): "same" | "complementary" | "friction" | "neutral" {
  if (a === b) return "same";
  const comp: Record<number, number[]> = {
    1: [3, 5, 7], 2: [4, 6, 8], 3: [1, 5, 9], 4: [2, 8], 5: [1, 3, 7], 6: [2, 9], 7: [1, 5], 8: [2, 4], 9: [3, 6]
  };
  const fric: Record<number, number[]> = {
    1: [2, 6], 2: [1, 5], 3: [4, 8], 4: [3, 9], 5: [2, 8], 6: [1, 7], 7: [6, 8], 8: [3, 5, 7], 9: [4]
  };
  if ((comp[a] || []).includes(b)) return "complementary";
  if ((fric[a] || []).includes(b)) return "friction";
  return "neutral";
}

export function calculateCompatibility(
  personA: { lifePath: number; dayNumber: number; monthNumber: number; animal: string },
  personB: { lifePath: number; dayNumber: number; monthNumber: number; animal: string }
): CompatibilityResult {
  const breakdown: CompatibilityResult["breakdown"] = [];
  
  const lpRelation = getRelationType(personA.lifePath, personB.lifePath);
  const lpPoints = lpRelation === "same" ? 25 : lpRelation === "complementary" ? 30 : lpRelation === "neutral" ? 15 : 5;
  breakdown.push({
    category: "Life Path",
    personA: personA.lifePath,
    personB: personB.lifePath,
    points: lpPoints,
    maxPoints: 30,
    explanation: `Life Paths ${personA.lifePath} and ${personB.lifePath} are ${lpRelation}`
  });

  const dayRelation = getRelationType(personA.dayNumber, personB.dayNumber);
  const dayPoints = dayRelation === "same" ? 18 : dayRelation === "complementary" ? 20 : dayRelation === "neutral" ? 10 : 3;
  breakdown.push({
    category: "Day Number",
    personA: personA.dayNumber,
    personB: personB.dayNumber,
    points: dayPoints,
    maxPoints: 20,
    explanation: `Day Numbers ${personA.dayNumber} and ${personB.dayNumber} are ${dayRelation}`
  });

  const monthRelation = getRelationType(personA.monthNumber, personB.monthNumber);
  const monthPoints = monthRelation === "same" ? 8 : monthRelation === "complementary" ? 10 : monthRelation === "neutral" ? 5 : 2;
  breakdown.push({
    category: "Month Number",
    personA: personA.monthNumber,
    personB: personB.monthNumber,
    points: monthPoints,
    maxPoints: 10,
    explanation: `Month Numbers ${personA.monthNumber} and ${personB.monthNumber} are ${monthRelation}`
  });

  let zodiacPoints = 20;
  let zodiacExplanation = "Neutral compatibility";
  if (personA.animal === personB.animal) {
    zodiacPoints = 28;
    zodiacExplanation = "Same animal sign - strong understanding";
  } else if ((animalFriends[personA.animal] || []).includes(personB.animal)) {
    zodiacPoints = 40;
    zodiacExplanation = "Natural allies - excellent harmony";
  } else if ((animalEnemiesPrimary[personA.animal] || []).includes(personB.animal)) {
    zodiacPoints = 0;
    zodiacExplanation = "Primary clash - significant challenges";
  } else if ((animalEnemiesSecondary[personA.animal] || []).includes(personB.animal)) {
    zodiacPoints = 10;
    zodiacExplanation = "Secondary tension - requires work";
  }
  breakdown.push({
    category: "Zodiac Animals",
    personA: personA.animal,
    personB: personB.animal,
    points: zodiacPoints,
    maxPoints: 40,
    explanation: zodiacExplanation
  });

  const totalScore = breakdown.reduce((sum, b) => sum + b.points, 0);

  return { totalScore, breakdown };
}

export interface OptimalDay {
  date: Date;
  personalDay: number;
  matches: string[];
  score: number;
}

export function getOptimalDays(dob: Date, days: number = 30): OptimalDay[] {
  const lifePath = getLifePath(dob).lifePath;
  const dayNum = getDayNumber(dob);
  const monthNum = getMonthNumber(dob);
  
  const results: OptimalDay[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    
    const pd = getPersonalDay(dob, checkDate);
    const matches: string[] = [];
    let score = 0;
    
    if (pd === lifePath) {
      matches.push("Life Path");
      score += 3;
    }
    if (pd === dayNum) {
      matches.push("Day Number");
      score += 2;
    }
    if (pd === monthNum) {
      matches.push("Month Number");
      score += 1;
    }
    
    if (matches.length > 0) {
      results.push({ date: checkDate, personalDay: pd, matches, score });
    }
  }
  
  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

export interface ReportTemplate {
  id: string;
  combo: string;
  name: string;
  archetype: string;
  summary: string;
  keyInsights: string[];
  advice: string[];
  compatibility?: string;
  career?: string;
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: "7-3-8",
    combo: "7-3-8",
    name: "The Analyst-Communicator",
    archetype: "Strategic Voice of Authority",
    summary: "You possess a rare combination: the depth of a researcher, the gift of communication, and the power to manifest in the material world. Your life path (7) drives you to seek truth and master specialized knowledge. Your day energy (3) gives you the ability to articulate complex ideas in accessible ways. Your month arena (8) positions you in environments of power, money, and authority.",
    keyInsights: [
      "Your sarcasm and sharp wit can be your greatest asset or liability—words carry 8x karmic weight",
      "Wealth comes through expertise translated into influence, not through charm alone",
      "Isolation protects your research mind but blocks the partnerships you need for impact",
      "Authority figures either become your greatest allies or your most significant blockers",
      "Teaching and advising are your natural monetization paths"
    ],
    advice: [
      "Schedule deep solitude for research, but force social interaction for execution",
      "Verify every financial contract twice—month 8 energy attracts complex legalities",
      "Use your voice to teach what you've mastered, not just to criticize what is broken"
    ],
    compatibility: "You thrive with partners who respect your need for silence and intellectual depth. Look for those with 1, 5, or 7 energy.",
    career: "Strategic consulting, specialized research, technical writing, or high-level financial analysis."
  },
  {
    id: "2-5-7",
    combo: "2-5-7",
    name: "The Intuitive Explorer",
    archetype: "Sensitive Strategic Nomad",
    summary: "You possess a unique blend of deep sensitivity, restless curiosity, and analytical depth. Your life path (2) makes you a natural mediator, but your day energy (5) pushes you toward constant movement. Your month arena (7) ensures that every experience is analyzed for deeper truth.",
    keyInsights: [
      "Restlessness is your internal compass seeking new levels of wisdom",
      "You sense emotional undercurrents that others miss, making you a powerful strategist",
      "Freedom is your primary requirement—without it, your intuition shuts down",
      "You translate abstract concepts into relatable human experiences better than most",
      "Your biggest growth comes from staying when you want to run"
    ],
    advice: [
      "Travel with a purpose—field research or spiritual retreats ground your 5 energy",
      "Build a career that rewards mobility and specialized research",
      "Practice emotional boundaries to prevent taking on others' stress as your own"
    ],
    compatibility: "You need a partner who values freedom and intellectual growth. Look for 5, 7, or 9 energies.",
    career: "Travel journalism, psychological research, documentary filmmaking, or intuitive counseling."
  },
  {
    id: "8-1-4",
    combo: "8-1-4",
    name: "The Empire Builder",
    archetype: "Structured Power Executive",
    summary: "You are designed to build lasting structures of power and wealth. Your life path (8) orients you toward material mastery and karmic lessons around authority. Your day energy (1) amplifies your leadership and self-direction. Your month arena (4) grounds you in systems, discipline, and practical execution.",
    keyInsights: [
      "You have CEO energy—but ego can derail the empire before it's built",
      "Every business decision creates karmic ripples; integrity is non-negotiable",
      "Real estate, construction, and infrastructure are your natural domains",
      "Patience with the building process is your hidden superpower",
      "Delegation is harder for you but essential for scale"
    ],
    advice: [
      "Audit your business integrity quarterly; karmic 8 energy reacts quickly to shortcuts",
      "Build from the ground up—your 4 month arena rewards solid foundations over speed",
      "Practice humility in leadership to keep your team's loyalty"
    ],
    compatibility: "You need a supportive yet independent partner. 2, 4, and 6 energies offer the stability you require.",
    career: "Corporate leadership, real estate development, financial management, or industrial engineering."
  },
  {
    id: "9-6-2",
    combo: "9-6-2",
    name: "The Compassionate Healer",
    archetype: "Nurturing Universal Servant",
    summary: "Your entire blueprint is oriented toward service and healing. Your life path (9) gives you the wisdom of completion and universal love. Your day energy (6) amplifies your nurturing instincts and responsibility to others. Your month arena (2) positions you in cooperative, emotionally intelligent environments.",
    keyInsights: [
      "Burnout is your greatest risk—you give until empty and wonder why you're depleted",
      "Healthcare, counseling, and community work are natural fits",
      "Learning to receive is as important as giving",
      "Partnerships amplify your impact—you're not meant to serve alone",
      "Endings and transitions are where you offer the most profound support"
    ],
    advice: [
      "Set strict 'off' hours for your service work to prevent depletion",
      "Practice asking for help once a day—it builds the 2 month's receptivity",
      "Trust that ending a project is a sacred completion, not a personal failure"
    ],
    compatibility: "You thrive with partners who are equally service-oriented. 3, 6, and 9 energies are harmonious.",
    career: "Counseling, non-profit leadership, healthcare, or social advocacy."
  },
  {
    id: "1-5-9",
    combo: "1-5-9",
    name: "The Visionary Pioneer",
    archetype: "Freedom-Seeking World Changer",
    summary: "You are designed for big-picture impact with the freedom to pursue it your way. Your life path (1) makes you a natural leader and initiator. Your day energy (5) gives you adaptability and hunger for new experiences. Your month arena (9) positions you in humanitarian or creative spheres.",
    keyInsights: [
      "Routine kills your spirit—build flexibility into everything you do",
      "Your restlessness is a feature, not a bug; channel it into meaningful pursuits",
      "Leadership through inspiration, not authority, is your style",
      "Travel, media, and global initiatives suit your energy",
      "Letting go of control allows bigger possibilities to emerge"
    ],
    advice: [
      "Structure your business to allow for seasonal shifts or travel",
      "Focus on the 'why' to keep your restless 5 energy engaged in the 1's goal",
      "Practice 'unplugging' to let the humanitarian 9 vision clarify"
    ],
    compatibility: "You need a partner who is adventurous and supportive of your independent vision. 1, 3, and 5 energies match well.",
    career: "Innovation consulting, international entrepreneurship, motivational speaking, or media production."
  },
  {
    id: "3-6-9",
    combo: "3-6-9",
    name: "The Creative Nurturer",
    archetype: "Artistic Humanitarian",
    summary: "You carry the triple vibration of creativity, care, and universal love. Your life path (3) makes you a natural communicator and artist. Your day energy (6) grounds you in responsibility and home. Your month arena (9) expands your canvas to global impact.",
    keyInsights: [
      "Your creativity serves healing—don't separate art from heart",
      "Family dynamics are central to your growth and expression",
      "Teaching through storytelling is your superpower",
      "Over-giving is your shadow; set boundaries early and often",
      "Legacy comes through what you create and nurture"
    ],
    advice: [
      "Monetize your creative gifts through community or teaching projects",
      "Release family expectations that block your creative voice",
      "Create for the joy of it, not just for the service of it"
    ],
    compatibility: "Partners who appreciate art and emotional depth are best. 3, 6, and 9 energies are your natural tribe.",
    career: "Art therapy, creative direction for non-profits, music education, or lifestyle blogging."
  },
  {
    id: "4-2-6",
    combo: "4-2-6",
    name: "The Steady Builder",
    archetype: "Reliable Foundation Creator",
    summary: "You are the rock that others depend on. Your life path (4) gives you the discipline to build lasting structures. Your day energy (2) makes you cooperative and emotionally aware. Your month arena (6) centers you in home, family, and community service.",
    keyInsights: [
      "Real estate, healthcare, and family businesses suit you perfectly",
      "Your reliability is your competitive advantage—don't undervalue it",
      "Partnerships need to be built on mutual respect and shared values",
      "Workaholism is your escape from emotional discomfort",
      "Creating sanctuaries for others is both your gift and your purpose"
    ],
    advice: [
      "Schedule emotional check-ins with yourself as strictly as work meetings",
      "Build your empire around home or family legacy to stay motivated",
      "Learn that resting is part of the building process"
    ],
    compatibility: "You need a partner who values security and tradition. 2, 4, and 8 energies provide the stability you crave.",
    career: "Operations management, family business leadership, architecture, or clinical practice."
  },
  {
    id: "5-7-1",
    combo: "5-7-1",
    name: "The Independent Seeker",
    archetype: "Curious Truth Pioneer",
    summary: "You blend freedom, wisdom, and leadership into a unique path. Your life path (5) drives you toward constant change and new experiences. Your day energy (7) gives you analytical depth and spiritual seeking. Your month arena (1) positions you as an initiator.",
    keyInsights: [
      "Traditional employment rarely satisfies you—entrepreneurship calls",
      "Research and exploration fund your lifestyle",
      "Solo travel and independent study are essential, not optional",
      "Commitment issues stem from fear of losing freedom",
      "Innovation through unconventional thinking is your hallmark"
    ],
    advice: [
      "Design a location-independent business or consulting practice",
      "Trust your 'gut' research over popular opinion or trends",
      "Build a network of independent allies who don't require daily maintenance"
    ],
    compatibility: "You thrive with other independent seekers. 1, 5, and 7 energies understand your need for space.",
    career: "Independent consulting, investigative research, tech innovation, or adventure travel leadership."
  },
  {
    id: "11-22-33",
    combo: "11-22-33",
    name: "The Master Trinity",
    archetype: "Cosmic Channel",
    summary: "You carry the weight of three Master Numbers—an extremely rare and powerful configuration. Your life path (11) gives you intuitive illumination. Your day energy (22) provides massive building capability. Your month arena (33) positions you as a master teacher.",
    keyInsights: [
      "Your nervous system requires extra care—meditation and rest are mandatory",
      "You are meant for institutional-level impact, not small projects",
      "The pressure you feel is proportional to your potential",
      "Ground your visions in practical steps or overwhelm takes over",
      "Service to humanity is not optional—it's your contract"
    ],
    advice: [
      "Prioritize silence and nature daily to manage the master vibration",
      "Say 'no' to projects that aren't large-scale or high-impact",
      "Seek a mentor who understands the weight of master energy"
    ],
    compatibility: "You need a highly evolved partner who can hold space for your intensity. Other master numbers or 7 and 9 energies are suitable.",
    career: "Global education leadership, humanitarian architecture, spiritual master-teaching, or visionary philanthropy."
  }
];

export function getReportTemplate(lifePath: number, dayNum: number, monthNum: number): ReportTemplate | null {
  // Normalize master numbers (11, 22, 33) to their base vibrations (2, 4, 6) for template matching
  // because we only have templates for single digit combinations (except the rare 11-22-33)
  const normalize = (n: number) => {
    if (n === 11) return 2;
    if (n === 22) return 4;
    if (n === 33) return 6;
    return n;
  };

  const lp = normalize(lifePath);
  const d = normalize(dayNum);
  const m = normalize(monthNum);

  const combo = `${lp}-${d}-${m}`;
  
  // Try exact match first (for the 11-22-33 case)
  const exactCombo = `${lifePath}-${dayNum}-${monthNum}`;
  const exactMatch = reportTemplates.find(t => t.combo === exactCombo);
  if (exactMatch) return exactMatch;

  return reportTemplates.find(t => t.combo === combo) || null;
}

export function getDailyForecast(personalDay: number): string {
  const forecasts: Record<number, string> = {
    1: "Today favors bold initiative—start something new or take the lead on a stalled project.",
    2: "Collaboration is your power today; listen deeply and let partnerships guide you forward.",
    3: "Express yourself creatively—write, speak, or share something meaningful with others.",
    4: "Focus on building and organizing; tackle tasks that require patience and attention to detail.",
    5: "Embrace change and stay flexible—unexpected opportunities may redirect your day positively.",
    6: "Nurture your relationships and environment; create beauty and offer support where needed.",
    7: "Seek solitude for reflection; answers emerge in quiet moments of contemplation today.",
    8: "Financial and power matters are highlighted—make decisions with integrity and authority.",
    9: "Release what no longer serves you; focus on the bigger picture and acts of compassion.",
    11: "Your intuition is amplified—trust inner guidance and share your vision with others.",
    22: "Think in terms of legacy today; plan and build something that will outlast you.",
    33: "Your healing presence is needed—teach, guide, and hold space for those who need you."
  };
  return forecasts[personalDay] || "Today is a neutral day—flow with what comes and stay present.";
}

export function getWeeklyForecast(personalDay: number): { forecast: string; strategy: string } {
  const forecasts: Record<number, { forecast: string; strategy: string }> = {
    1: {
      forecast: "This week emphasizes courage and independence. You may feel a strong urge to break free from limitations and assert your authority.",
      strategy: "Channel your leadership energy into one bold decision. Delegate routine tasks so you can focus on pioneering work. Practice asking others for input before acting—it's not weakness, it's wisdom."
    },
    2: {
      forecast: "Partnerships and sensitivity dominate this week. You'll notice emotional currents others miss. Intuition is heightened.",
      strategy: "Schedule time with trusted people—your listening gifts are needed. Set one clear boundary to protect your peace. Practice saying 'I need to think about that' before committing."
    },
    3: {
      forecast: "Communication and creativity flow abundantly. This is your week to shine—share your ideas, create, connect with your community.",
      strategy: "Start that creative project you've been avoiding. Share at least one vulnerable truth with someone you trust. Write or journal daily to capture insights."
    },
    4: {
      forecast: "Foundation-building energy surrounds you. Details matter. This is the time to organize, plan, and create systems that serve you long-term.",
      strategy: "Audit your commitments and structures. Finish one 'stuck' project. Build one new productive habit. Take breaks—discipline without rest becomes burnout."
    },
    5: {
      forecast: "Change is in the air—embrace it. This week offers unexpected opportunities and exciting detours from routine. Stay alert and flexible.",
      strategy: "Say yes to one new experience. Research something that fascinates you. Don't over-commit; keep options open. Ground yourself with one anchoring routine."
    },
    6: {
      forecast: "Service and care are calling. This week highlights relationships, home, and your capacity to create beauty. Community matters deeply.",
      strategy: "Reach out to someone who needs support. Create one meaningful gathering or moment of beauty in your space. Ask for help with one thing—receiving is part of service."
    },
    7: {
      forecast: "This is a week for seeking truth and going deeper. Spiritual insights and quiet breakthroughs are available. Trust your inner knowing.",
      strategy: "Spend time in nature or meditation. Study something that fascinates you. Give yourself permission to say 'I don't know' and sit with mystery. Limit social obligations."
    },
    8: {
      forecast: "Money, power, and opportunity align. This week amplifies your capacity for achievement. Authority and responsibility feel natural.",
      strategy: "Take action on a financial or career goal. Lead with integrity—karma is active. Make one power move with clear ethics. Avoid dominating others."
    },
    9: {
      forecast: "Completion and compassion frame this week. An ending is approaching. You feel called to serve something larger than yourself.",
      strategy: "Release what no longer serves you—a relationship, project, or belief. Contribute to something meaningful. Practice non-attachment. Focus on legacy, not control."
    },
    11: {
      forecast: "Intuitive breakthroughs and inspirational moments abound. Your nervous system is sensitive—take care of it. Vision is crystal clear.",
      strategy: "Meditate or spend quiet time daily. Share your vision with those ready to hear it. Limit overstimulation (noise, crowds, screens). Trust the signs and synchronicities."
    },
    22: {
      forecast: "Your building capacity is strongest now. This week favors projects with grand scope and lasting impact. Think big and act strategically.",
      strategy: "Outline one major project that excites you. Gather your team or resources. Break the big vision into monthly milestones. Rest deliberately—intensity requires recovery."
    },
    33: {
      forecast: "Your healing and teaching gifts are activated. This week you feel deeply how interconnected we all are. Compassion runs deep.",
      strategy: "Volunteer, teach, or mentor someone. Create safe space for others to be vulnerable. Practice receiving—let others care for you too. Protect your energy from overwhelm."
    }
  };
  return forecasts[personalDay] || { 
    forecast: "This week is neutral—focus on presence and small acts of kindness.", 
    strategy: "Stay grounded in daily routines. Notice what brings you peace." 
  };
}

export function getMonthlyForecast(personalMonth: number): { forecast: string; strategy: string } {
  const forecasts: Record<number, { forecast: string; strategy: string }> = {
    1: {
      forecast: "This month is about taking charge of your direction. Leadership opportunities arise. You're in the driver's seat of your life.",
      strategy: "Set clear intentions for the month. Make one significant decision you've been postponing. Start something new, even if it's small. Avoid trying to control others."
    },
    2: {
      forecast: "Collaboration and diplomacy create new possibilities this month. People gravitate toward you for your wisdom and calm presence.",
      strategy: "Invest in key relationships through quality time. Listen more than you speak. Mediate one conflict with compassion. Balance giving with receiving."
    },
    3: {
      forecast: "Creativity and connection peak this month. Your words, ideas, and presence inspire others. Social opportunities multiply.",
      strategy: "Launch a creative project or share your work publicly. Connect with your community. Journal about what you want to express. Finish projects before starting new ones."
    },
    4: {
      forecast: "This is a powerhouse month for building and organizing. Focus and discipline come naturally. Structure creates success.",
      strategy: "Create a solid plan for a major goal. Tackle one significant organizational project. Build one healthy habit. Monitor perfectionism—progress over perfection."
    },
    5: {
      forecast: "Freedom, variety, and unexpected opportunities fill this month. Routine feels restrictive. Adventure calls.",
      strategy: "Plan one trip or new experience. Research what excites you. Seek variety in your work and life. Establish one stabilizing routine so freedom doesn't become chaos."
    },
    6: {
      forecast: "Family, home, and responsibility take the spotlight. This month emphasizes your role as nurturer and caretaker. Beauty and harmony matter.",
      strategy: "Improve your home environment. Deepen one close relationship. Say yes to serving your community. Set clear limits on what you can give."
    },
    7: {
      forecast: "Spiritual seeking and inner wisdom guide this month. You're drawn to deeper understanding and sacred knowledge.",
      strategy: "Invest in a spiritual practice (meditation, study, nature time). Trust your intuition over logic this month. Take time to be alone. Avoid gossip; protect your peace."
    },
    8: {
      forecast: "Abundance, power, and achievement are prominent. What you build this month can have lasting financial or career impact.",
      strategy: "Focus on a major money or power goal. Invest in yourself or your business. Lead with vision and integrity. Watch for control issues."
    },
    9: {
      forecast: "Completion and transformation mark this month. An old cycle ends so a new one can begin. Compassion and wisdom are your guides.",
      strategy: "Close chapters that need closure. Release what's outworn. Contribute to something with purpose. Practice forgiveness, especially of yourself."
    },
    11: {
      forecast: "Inspiration, intuition, and spiritual downloads flow this month. Your gifts of vision are magnified. Ground yourself well.",
      strategy: "Establish a solid meditation or grounding practice. Share your vision with receptive audiences. Rest deeply—high vibration requires recovery. Trust synchronicity."
    },
    22: {
      forecast: "Legacy building peaks this month. You have the energy and focus to manifest something truly significant and lasting.",
      strategy: "Work on your signature project or business expansion. Build a foundation for something that will outlast you. Delegate to conserve energy. Rest is productive."
    },
    33: {
      forecast: "Your capacity to heal, teach, and uplift others is at its peak this month. The world needs your compassion and wisdom.",
      strategy: "Mentor someone or facilitate healing space. Teach what you know. Help one person see their potential. Maintain boundaries—not everyone is your responsibility."
    }
  };
  return forecasts[personalMonth] || { 
    forecast: "This month brings steady progress on your goals.", 
    strategy: "Focus on consistent, incremental improvement." 
  };
}

export function getYearlyForecast(personalYear: number): { forecast: string; strategy: string } {
  const forecasts: Record<number, { forecast: string; strategy: string }> = {
    1: {
      forecast: "New beginnings and fresh starts define this year. You're stepping into a new cycle of life. Independence and courage are essential.",
      strategy: "Plant seeds for what you want to build. Make bold decisions. Start the thing you've been fearing. Trust yourself more than you ever have. Leadership will be tested."
    },
    2: {
      forecast: "Relationships, partnerships, and cooperation dominate this year. Patience and trust are your superpowers. Sensitivity opens doors.",
      strategy: "Deepen key relationships. Form or strengthen one important partnership. Practice patience—things unfold slowly but securely. Listen to your intuition over ego."
    },
    3: {
      forecast: "This is your year of creative expression and joy. Communication, community, and self-expression are heightened.",
      strategy: "Bring your creative gifts into the world. Connect deeply with community. Share your voice and talents. Avoid scattered energy—focus your gifts."
    },
    4: {
      forecast: "A year of building, organizing, and creating lasting foundations. Hard work pays off. Stability and security become possible.",
      strategy: "Build something that lasts—invest in real estate, health, or business infrastructure. Work steadily toward long-term goals. Master one skill deeply. Rest is not laziness."
    },
    5: {
      forecast: "Freedom, change, and adventure characterize this year. You're meant to explore, learn, and expand your horizons.",
      strategy: "Embrace change as it comes. Pursue education or travel. Adapt your path as opportunities appear. Ground yourself with one anchoring commitment."
    },
    6: {
      forecast: "A year of responsibility, family, and service. You're called to nurture—others and yourself. Home and relationships are central.",
      strategy: "Invest in family or community. Create beauty in your home. Say 'yes' to your nurturing gifts. Remember: you cannot pour from an empty cup. Rest is essential."
    },
    7: {
      forecast: "Spiritual awakening and inner mastery mark this year. You're going deeper, seeking truth, and trusting your intuition.",
      strategy: "Establish a spiritual practice. Study what fascinates you. Spend time in solitude and nature. Trust the quiet knowing within. Limit socializing for focus."
    },
    8: {
      forecast: "Power, abundance, and achievement are available this year. Your capacity for success and leadership is amplified. Money flows.",
      strategy: "Go for your biggest goal. Build your business or career. Make power moves with integrity. What goes out returns multiplied—be generous and ethical."
    },
    9: {
      forecast: "Completion and transformation define this year. You're releasing the old to make space for the new. Wisdom and compassion guide you.",
      strategy: "Release relationships, jobs, or beliefs that have run their course. Forgive others and yourself. Contribute meaningfully to the world. Prepare for the next cycle."
    },
    11: {
      forecast: "This is a watershed year for spiritual awakening and inspired action. Your gifts of vision and intuition are meant to illuminate.",
      strategy: "Ground your visions in practical steps. Meditate and journal daily. Share your insights with receptive people. Protect your nervous system—rest is non-negotiable."
    },
    22: {
      forecast: "This is your signature year for manifesting something grand and lasting. Your building capacity is unmatched. Legacy is within reach.",
      strategy: "Commit to your life's work. Build infrastructure for something that will outlast you. Gather your dream team. Expect the path to be intense—recovery time matters."
    },
    33: {
      forecast: "This is a healing and teaching year of profound significance. You're called to uplift humanity. Your presence and wisdom matter.",
      strategy: "Answer your calling to serve. Mentor, heal, or teach. Create sanctuary for others. Remember: your worth isn't measured by how much you give. Receive too."
    }
  };
  return forecasts[personalYear] || { 
    forecast: "This year brings steady evolution and growth.", 
    strategy: "Trust the process and stay committed to your path." 
  };
}

// ==========================================
// TRI-CODE COMPATIBILITY ENGINE
// ==========================================

// Pythagorean letter values (Latin alphabet)
export const pythagoreanMap: Record<string, number> = {
  'a': 1, 'j': 1, 's': 1,
  'b': 2, 'k': 2, 't': 2,
  'c': 3, 'l': 3, 'u': 3,
  'd': 4, 'm': 4, 'v': 4,
  'e': 5, 'n': 5, 'w': 5,
  'f': 6, 'o': 6, 'x': 6,
  'g': 7, 'p': 7, 'y': 7,
  'h': 8, 'q': 8, 'z': 8,
  'i': 9, 'r': 9
};

// Calculate Expression Number from a Latin name
export function calculateExpressionNumber(name: string): number {
  if (!name) return 0;
  
  const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  
  for (const letter of normalized) {
    sum += pythagoreanMap[letter] || 0;
  }
  
  return reduceToSingleDigit(sum);
}

// Wrapper to get Life Path from date
function calculateLifePath(date: Date): number {
  return getLifePath(date).lifePath;
}

// Standard Abjad letter values
export const abjadMap: Record<string, number> = {
  'ا': 1,
  'ب': 2,
  'ج': 3,
  'د': 4,
  'ه': 5,
  'و': 6,
  'ز': 7,
  'ح': 8,
  'ط': 9,
  'ي': 10,
  'ك': 20,
  'ل': 30,
  'م': 40,
  'ن': 50,
  'س': 60,
  'ع': 70,
  'ف': 80,
  'ص': 90,
  'ق': 100,
  'ر': 200,
  'ش': 300,
  'ت': 400,
  'ث': 500,
  'خ': 600,
  'ذ': 700,
  'ض': 800,
  'ظ': 900,
  'غ': 1000
};

// Arabic normalization - critical for accurate Abjad calculation
export function normalizeArabic(input: string): string {
  if (!input) return '';
  
  let normalized = input;
  
  // Remove harakat and diacritics
  const diacritics = /[\u064B-\u065F\u0670]/g;
  normalized = normalized.replace(diacritics, '');
  
  // Remove tatweel
  normalized = normalized.replace(/ـ/g, '');
  
  // Normalize hamza variants to base letters
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  normalized = normalized.replace(/ؤ/g, 'و');
  normalized = normalized.replace(/ئ/g, 'ي');
  
  // Normalize ta marbuta
  normalized = normalized.replace(/ة/g, 'ه');
  
  // Normalize alif maqsura
  normalized = normalized.replace(/ى/g, 'ي');
  
  // Keep only Arabic letters in the mapping set
  const validLetters = Object.keys(abjadMap);
  normalized = normalized.split('').filter(char => validLetters.includes(char)).join('');
  
  return normalized;
}

export interface AbjadResult {
  normalized: string;
  sum: number;
  reduced: number;
  breakdown: Array<{ letter: string; value: number }>;
  mod9: number;
  intensity: 'Low' | 'Medium' | 'High';
}

export function computeAbjad(arabicStr: string): AbjadResult {
  const normalized = normalizeArabic(arabicStr);
  
  const breakdown: Array<{ letter: string; value: number }> = [];
  let sum = 0;
  
  for (const letter of normalized) {
    const value = abjadMap[letter] || 0;
    if (value > 0) {
      breakdown.push({ letter, value });
      sum += value;
    }
  }
  
  const reduced = reduceToSingleDigit(sum);
  const mod9 = sum % 9 === 0 ? 9 : sum % 9;
  
  let intensity: 'Low' | 'Medium' | 'High';
  if (sum < 200) intensity = 'Low';
  else if (sum < 1000) intensity = 'Medium';
  else intensity = 'High';
  
  return { normalized, sum, reduced, breakdown, mod9, intensity };
}

// Tri-Code types
export interface TriCodeEntity {
  nameLatin?: string;
  nameArabic?: string;
  birthDate?: Date;
  anchorDate?: Date; // For places
  isPlace?: boolean;
}

export interface TriCodeCodes {
  DC: number | null;  // Destiny Code (Life Path)
  ICL: number | null; // Identity Code Latin (Expression Number)
  ECA: AbjadResult | null; // Essence Code Arabic
}

export interface AxisScore {
  value: number;
  type: 'same' | 'complementary' | 'neutral' | 'friction';
  label: string;
}

export type ModeLabel = 'Reinforcement' | 'Growth' | 'Extraction' | 'Avoidance' | 'Mixed';

export interface TriCodeResult {
  A: TriCodeCodes;
  B: TriCodeCodes;
  axes: {
    A1_LatinCore: AxisScore | null;
    A2_ArabicCore: AxisScore | null;
    A3_Destiny: AxisScore | null;
    A4_LatinAdaptAB: AxisScore | null;
    A5_LatinAdaptBA: AxisScore | null;
    A6_ArabicAdaptAB: AxisScore | null;
    A7_ArabicAdaptBA: AxisScore | null;
  };
  finalScore: number;
  tensionIndex: number;
  modeLabel: ModeLabel;
  bestUseCases: string[];
  nameDivergence: 'Low' | 'Medium' | 'High' | null;
}

// Axis scoring based on relation type
const axisPoints: Record<string, number> = {
  same: 25,
  complementary: 20,
  neutral: 14,
  friction: 8
};

function getAxisScore(numA: number | null, numB: number | null, label: string): AxisScore | null {
  if (numA === null || numB === null) return null;
  
  const type = getRelationType(numA, numB);
  return {
    value: axisPoints[type],
    type,
    label
  };
}

// Get EC-A comparison value based on mode
function getECACompareValue(eca: AbjadResult | null, useReduced: boolean): number | null {
  if (!eca) return null;
  return useReduced ? eca.reduced : eca.mod9;
}

export function computeTriCodeCompatibility(
  entityA: TriCodeEntity,
  entityB: TriCodeEntity,
  options: { abjadMode: 'reduced' | 'modular' } = { abjadMode: 'modular' }
): TriCodeResult {
  const useReduced = options.abjadMode === 'reduced';
  
  // Compute codes for Entity A
  const A: TriCodeCodes = {
    DC: entityA.birthDate ? calculateLifePath(entityA.birthDate) : null,
    ICL: entityA.nameLatin ? calculateExpressionNumber(entityA.nameLatin) : null,
    ECA: entityA.nameArabic ? computeAbjad(entityA.nameArabic) : null
  };
  
  // Compute codes for Entity B
  const B: TriCodeCodes = {
    DC: entityB.birthDate 
      ? calculateLifePath(entityB.birthDate) 
      : entityB.anchorDate 
        ? calculateLifePath(entityB.anchorDate) 
        : null,
    ICL: entityB.nameLatin ? calculateExpressionNumber(entityB.nameLatin) : null,
    ECA: entityB.nameArabic ? computeAbjad(entityB.nameArabic) : null
  };
  
  // Get EC-A comparison values
  const ecaACompare = getECACompareValue(A.ECA, useReduced);
  const ecaBCompare = getECACompareValue(B.ECA, useReduced);
  
  // Compute all 7 axes
  const axes = {
    A1_LatinCore: getAxisScore(A.ICL, B.ICL, 'Latin Core Alignment'),
    A2_ArabicCore: getAxisScore(ecaACompare, ecaBCompare, 'Arabic Core Alignment'),
    A3_Destiny: getAxisScore(A.DC, B.DC, 'Trajectory Alignment'),
    A4_LatinAdaptAB: getAxisScore(A.ICL, B.DC, 'Latin Adaptation A→B'),
    A5_LatinAdaptBA: getAxisScore(B.ICL, A.DC, 'Latin Adaptation B→A'),
    A6_ArabicAdaptAB: getAxisScore(ecaACompare, B.DC, 'Arabic Adaptation A→B'),
    A7_ArabicAdaptBA: getAxisScore(ecaBCompare, A.DC, 'Arabic Adaptation B→A')
  };
  
  // Default weights
  const defaultWeights = {
    A1: 0.18,
    A2: 0.18,
    A3: 0.22,
    A4: 0.14,
    A5: 0.14,
    A6: 0.07,
    A7: 0.07
  };
  
  // Calculate which axes exist and reweight
  const activeAxes: Array<{ key: string; score: AxisScore; weight: number }> = [];
  let totalWeight = 0;
  
  if (axes.A1_LatinCore) { activeAxes.push({ key: 'A1', score: axes.A1_LatinCore, weight: defaultWeights.A1 }); totalWeight += defaultWeights.A1; }
  if (axes.A2_ArabicCore) { activeAxes.push({ key: 'A2', score: axes.A2_ArabicCore, weight: defaultWeights.A2 }); totalWeight += defaultWeights.A2; }
  if (axes.A3_Destiny) { activeAxes.push({ key: 'A3', score: axes.A3_Destiny, weight: defaultWeights.A3 }); totalWeight += defaultWeights.A3; }
  if (axes.A4_LatinAdaptAB) { activeAxes.push({ key: 'A4', score: axes.A4_LatinAdaptAB, weight: defaultWeights.A4 }); totalWeight += defaultWeights.A4; }
  if (axes.A5_LatinAdaptBA) { activeAxes.push({ key: 'A5', score: axes.A5_LatinAdaptBA, weight: defaultWeights.A5 }); totalWeight += defaultWeights.A5; }
  if (axes.A6_ArabicAdaptAB) { activeAxes.push({ key: 'A6', score: axes.A6_ArabicAdaptAB, weight: defaultWeights.A6 }); totalWeight += defaultWeights.A6; }
  if (axes.A7_ArabicAdaptBA) { activeAxes.push({ key: 'A7', score: axes.A7_ArabicAdaptBA, weight: defaultWeights.A7 }); totalWeight += defaultWeights.A7; }
  
  // Calculate weighted score with renormalized weights
  let rawScore = 0;
  for (const axis of activeAxes) {
    const normalizedWeight = axis.weight / totalWeight;
    rawScore += normalizedWeight * axis.score.value;
  }
  
  const finalScore = activeAxes.length > 0 ? Math.round((rawScore / 25) * 100) : 0;
  
  // Calculate tension index from adaptation axes
  const adaptAxes = [axes.A4_LatinAdaptAB, axes.A5_LatinAdaptBA, axes.A6_ArabicAdaptAB, axes.A7_ArabicAdaptBA].filter(Boolean) as AxisScore[];
  const adaptAvg = adaptAxes.length > 0 
    ? adaptAxes.reduce((sum, a) => sum + a.value, 0) / adaptAxes.length 
    : 14;
  const tensionIndex = 100 - Math.round((adaptAvg / 25) * 100);
  
  // Calculate mode label
  const coreAxes = [axes.A1_LatinCore, axes.A2_ArabicCore].filter(Boolean) as AxisScore[];
  const coreAvg = coreAxes.length > 0 
    ? coreAxes.reduce((sum, a) => sum + a.value, 0) / coreAxes.length 
    : 14;
  const traj = axes.A3_Destiny?.value ?? 14;
  
  let modeLabel: ModeLabel;
  if (coreAvg >= 20 && traj >= 20 && adaptAvg >= 18) {
    modeLabel = 'Reinforcement';
  } else if (coreAvg >= 18 && traj <= 14 && adaptAvg >= 14 && adaptAvg <= 18) {
    modeLabel = 'Growth';
  } else if (coreAvg <= 14 && traj >= 18 && adaptAvg >= 14 && adaptAvg <= 18) {
    modeLabel = 'Extraction';
  } else if (coreAvg <= 14 && traj <= 14 && adaptAvg <= 14) {
    modeLabel = 'Avoidance';
  } else {
    modeLabel = 'Mixed';
  }
  
  // Best use cases based on DC
  const bestUseCases: string[] = [];
  const primaryDC = B.DC ?? A.DC;
  if (primaryDC) {
    if ([8, 1, 4].includes(primaryDC)) bestUseCases.push('Money');
    if ([2, 6].includes(primaryDC)) bestUseCases.push('Relationships');
    if ([7, 9].includes(primaryDC)) bestUseCases.push('Learning');
    if (primaryDC === 5) bestUseCases.push('Expansion');
    if ([3].includes(primaryDC)) bestUseCases.push('Creativity');
    if ([11, 22, 33].includes(primaryDC)) bestUseCases.push('Spiritual Growth');
  }
  if (bestUseCases.length === 0) bestUseCases.push('Balanced');
  
  // Name form divergence check
  let nameDivergence: 'Low' | 'Medium' | 'High' | null = null;
  if (A.ICL !== null && A.ECA !== null) {
    const diff = Math.abs(A.ICL - A.ECA.reduced);
    if (diff <= 2) nameDivergence = 'Low';
    else if (diff <= 5) nameDivergence = 'Medium';
    else nameDivergence = 'High';
  }
  
  return {
    A,
    B,
    axes,
    finalScore,
    tensionIndex,
    modeLabel,
    bestUseCases,
    nameDivergence
  };
}

// Get guidance based on mode label and weak axes
export function getTriCodeGuidance(result: TriCodeResult): {
  whatWorks: string[];
  whatBreaks: string[];
  howToMakeItWork: string[];
} {
  const guidance = {
    whatWorks: [] as string[],
    whatBreaks: [] as string[],
    howToMakeItWork: [] as string[]
  };
  
  switch (result.modeLabel) {
    case 'Reinforcement':
      guidance.whatWorks = ['Natural alignment', 'Shared goals', 'Mutual respect'];
      guidance.whatBreaks = ['Complacency', 'Taking it for granted', 'Lack of challenge'];
      guidance.howToMakeItWork = ['Keep growing together', 'Create shared projects', 'Celebrate wins'];
      break;
    case 'Growth':
      guidance.whatWorks = ['Learning from differences', 'Complementary strengths', 'Patience'];
      guidance.whatBreaks = ['Impatience', 'Trying to change each other', 'Rushing'];
      guidance.howToMakeItWork = ['Embrace the slow build', 'Focus on shared values', 'Give space'];
      break;
    case 'Extraction':
      guidance.whatWorks = ['Clear boundaries', 'Defined roles', 'Short-term projects'];
      guidance.whatBreaks = ['Over-dependence', 'Blurred lines', 'Emotional entanglement'];
      guidance.howToMakeItWork = ['Keep it transactional', 'Set clear timelines', 'Protect your energy'];
      break;
    case 'Avoidance':
      guidance.whatWorks = ['Minimal contact', 'Professional distance', 'Clear exit strategy'];
      guidance.whatBreaks = ['Forced closeness', 'Shared responsibilities', 'Long-term commitments'];
      guidance.howToMakeItWork = ['Keep interactions brief', 'Have backup plans', 'Limit exposure'];
      break;
    case 'Mixed':
      guidance.whatWorks = ['Flexibility', 'Selective engagement', 'Context awareness'];
      guidance.whatBreaks = ['Rigid expectations', 'All-or-nothing thinking', 'Ignoring signals'];
      guidance.howToMakeItWork = ['Adapt to each situation', 'Focus on what works', 'Accept complexity'];
      break;
  }
  
  return guidance;
}

// Lunar phase calculations
export interface LunarPhaseInfo {
  phaseName: string;
  percentage: number;
  isWaxing: boolean;
  nextNewMoon: Date;
  lastNewMoon: Date;
  lastFullMoon: Date;
}

export function getLunarPhase(date: Date = new Date()): LunarPhaseInfo {
  // Known new moon: January 29, 2025 at 02:36 UTC
  const knownNewMoon = new Date(Date.UTC(2025, 0, 29, 2, 36, 0));
  const lunarCycle = 29.53058867; // days
  
  const timeSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePosition = ((timeSinceNewMoon % lunarCycle) + lunarCycle) % lunarCycle;
  const percentage = Math.round((cyclePosition / lunarCycle) * 100);
  const isWaxing = cyclePosition < lunarCycle / 2;
  
  // Determine phase name
  let phaseName = '';
  if (cyclePosition < 1.84) phaseName = 'New Moon';
  else if (cyclePosition < 7.38) phaseName = 'Waxing Crescent';
  else if (cyclePosition < 9.23) phaseName = 'First Quarter';
  else if (cyclePosition < 14.77) phaseName = 'Waxing Gibbous';
  else if (cyclePosition < 16.61) phaseName = 'Full Moon';
  else if (cyclePosition < 22.15) phaseName = 'Waning Gibbous';
  else if (cyclePosition < 23.99) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';
  
  // Calculate next new moon
  const newMoonsBefore = Math.floor(timeSinceNewMoon / lunarCycle);
  const nextNewMoon = new Date(knownNewMoon.getTime() + (newMoonsBefore + 1) * lunarCycle * 24 * 60 * 60 * 1000);
  
  // Calculate last new moon
  const lastNewMoon = new Date(knownNewMoon.getTime() + newMoonsBefore * lunarCycle * 24 * 60 * 60 * 1000);
  
  // Calculate last full moon (half cycle after last new moon)
  const lastFullMoon = new Date(lastNewMoon.getTime() + (lunarCycle / 2) * 24 * 60 * 60 * 1000);
  
  return {
    phaseName,
    percentage,
    isWaxing,
    nextNewMoon,
    lastNewMoon,
    lastFullMoon
  };
}
