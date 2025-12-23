# Design Guidelines for The Universal Matrix

## Design Approach

**Selected System:** Shadcn UI + Material Design principles
**Rationale:** Data-intensive numerology application requiring clear information hierarchy, efficient data displays, and professional dark interface. Shadcn's component flexibility combined with Material's elevation and emphasis patterns ideal for complex calculations and multi-panel layouts.

## Core Design Principles

1. **Information Density with Breathing Room** - Pack meaningful data while maintaining scanability
2. **Numerical Prominence** - Numbers are the hero; make them bold and unmissable
3. **Progressive Disclosure** - Tab-based architecture reveals complexity in digestible chunks
4. **Confidence Through Clarity** - Explanations must be authoritative and well-structured

## Typography System

**Hierarchy:**
- **Display Numbers:** text-5xl to text-6xl, font-black (Life Path, compatibility scores)
- **Section Headings:** text-2xl, font-bold
- **Subsection Titles:** text-lg, font-semibold
- **Number Labels:** text-sm, font-medium, uppercase tracking-wide
- **Body Content:** text-base, leading-relaxed (meanings, interpretations)
- **Metadata/Pills:** text-xs to text-sm, font-medium

**Font Stack:** System fonts for performance - use `font-sans` with tailwind's default stack

## Layout System

**Spacing Units:** Standardize on 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Card padding: p-6 to p-8
- Section gaps: gap-8 to gap-12
- Tile padding: p-4 to p-6
- Pill padding: px-3 py-1

**Container Structure:**
- Max-width: max-w-7xl for main container
- Grid systems: 
  - 3-column for metric tiles (grid-cols-3)
  - 2-column for compatibility comparisons (grid-cols-2)
  - 4-column for timing calendar views (grid-cols-7 for week layout)

## Component Library

### Navigation
- **Tab Bar:** Horizontal pills with active state emphasis, stick to top on scroll
- Tabs: Overview | Numerology | Zodiac | Compatibility | Timing | Export

### Data Display Components

**Metric Tiles:**
- Rounded containers (rounded-xl)
- Large number at top (text-4xl font-black)
- Label above (text-xs uppercase)
- Brief descriptor below (text-sm muted)
- Border treatment for visual separation

**Meaning Cards:**
- Expandable sections for each number (1-9, 11, 22, 33)
- Header: Number + core essence
- Sections: Strengths (bullets) | Shadow Traits (bullets) | Money Patterns | Relationships | Career Examples (pills)
- Use disclosure triangles for expand/collapse

**Scoring Breakdown Panel:**
- Visual equation layout: "Life Path (7) + Day (3) + Month (8) = X points"
- Progress bars or segmented bars showing contribution percentages
- Step-by-step calculation breakdown in table format

**Timeline/Calendar:**
- Next 30 days view with highlighted optimal dates
- Date cards showing: Date | Personal Day # | Match reason (badge)
- Visual indicators (icons or emphasis) for triple matches

**Daily Forecast Card:**
- Prominent card at top of Timing tab
- Today's date + Personal Day number (large)
- One-sentence forecast (text-lg, italic or distinctive treatment)
- Action suggestion in pill or button

**Report Templates:**
- Accordion or card list for preset combos (7-3-8, etc.)
- Title: "The [Archetype Name]" (e.g., "The Analyst-Communicator")
- Summary paragraph + key insights in structured format

### Form Elements
- Input fields: Clean, minimal border treatment, focus states with glow
- Date picker: Native or Shadcn calendar component
- Buttons: Primary (Generate Report), Secondary (Export, Copy)
- Button sizing: px-6 py-3 for primary actions

### Pills & Badges
- rounded-full with px-3 py-1
- Use for: Career examples, strengths, animal symbols, date tags
- Variant types: default, success (favorable), warning (unfavorable)

### Export Panel
- Textarea showing full report text (min-h-96)
- Action buttons: Copy to Clipboard | Download TXT
- Format preview toggle (Raw | Formatted)

## Layout Patterns

**Overview Tab:**
- Hero metrics row: Life Path | Day | Month (3-col grid)
- Personal cycles row: UY | PY | PM | PD (4-col grid)
- Daily forecast card (full-width)
- Quick themes/risks/levers (3-col grid or stacked cards)

**Numerology Tab:**
- Accordion of detailed number meanings (1-9, 11, 22, 33)
- Each section fully expanded shows ~200-300 words + career pills
- Name numerology calculator in sidebar or separate card

**Zodiac Tab:**
- Animal symbol prominent (text-6xl or icon)
- Friends row (3 animals with icons)
- Enemies rows (primary/secondary with visual distinction)
- Next favorable/unfavorable years timeline

**Compatibility Tab:**
- Two-person input form at top
- Compatibility score (large, centered)
- Scoring breakdown panel (visual equation)
- Animal zodiac compatibility score separate section
- Combined insights paragraph

**Timing Tab:**
- Daily forecast card (prominent, top)
- Calendar view of next 30 days (7-col grid for weeks)
- Top 10 optimal days list (numbered, with details)

**Export Tab:**
- Full report textarea
- Action buttons row
- Format options

## Visual Rhythm

- Establish consistent card elevation through borders and subtle shadows
- Use visual separators (hr elements with opacity) between major sections
- Group related metrics in tiles with consistent sizing
- Maintain alignment across rows and columns
- Use whitespace generously around large numbers for emphasis

## Responsive Behavior

- Desktop (lg): Multi-column layouts as specified
- Tablet (md): 2-column max, some stacking
- Mobile: Single column, tabs become vertical or scrollable, numbers remain prominent

**No Images Required** - This is a data application; visual richness comes from layout, typography, and information design, not photography.