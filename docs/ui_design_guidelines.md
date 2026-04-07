# Ascendii Universe — UI Design Guidelines ∞

> _"Beauty is data. Aesthetics are an economic signal."_ — Ascendii Manifesto

These guidelines govern the visual language, component patterns, and interaction principles for all Ascendii Universe interfaces. Every design decision should embody the core philosophy: **systems serve souls, beauty signals value**.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Iconography & Symbols](#4-iconography--symbols)
5. [Layout & Spacing](#5-layout--spacing)
6. [Component Patterns](#6-component-patterns)
7. [Motion & Animation](#7-motion--animation)
8. [Accessibility](#8-accessibility)
9. [Responsive Design](#9-responsive-design)
10. [Tone & Voice](#10-tone--voice)

---

## 1. Design Principles

These five principles mirror the Interlink Covenant and must guide every UI decision:

| Principle | UI Implication |
|-----------|---------------|
| **Reciprocity** | Every action provides clear feedback — the interface gives back what the user puts in |
| **Transparency** | State changes, costs, and on-chain actions are always visible and legible |
| **Regeneration** | Interfaces feel alive — progress accumulates and is never lost or hidden |
| **Dignity** | No dark patterns, no manipulative defaults, no deceptive affordances |
| **Emergence** | Layouts breathe — negative space is intentional, not an afterthought |

### The Beauty Test

Before shipping any screen, ask:
- Does this design honor those who use it?
- Does this exchange create flow or friction?
- Does this system **sing**?

---

## 2. Color System

The palette reflects the three sacred elements of the Trinity, unified by cosmic space.

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-void` | `#0A0A12` | Primary background — the infinite |
| `--color-nexus` | `#12121F` | Card/panel backgrounds |
| `--color-aether` | `#1E1E33` | Elevated surfaces, modals |
| `--color-border` | `#2A2A45` | Dividers, subtle borders |
| `--color-text-primary` | `#E8E8F0` | Primary readable text |
| `--color-text-secondary` | `#9090B0` | Supporting copy, labels |
| `--color-text-muted` | `#50506A` | Disabled, placeholder text |

### Elemental Accent Palette

| Element | Token | Hex | Glow Hex |
|---------|-------|-----|----------|
| 💧 **Aqua Vitae** (Water) | `--color-aqua` | `#2AABCF` | `#2AABCF40` |
| ☀️ **Helios Forge** (Energy) | `--color-helios` | `#F5A623` | `#F5A62340` |
| 🌳 **Arbor Vitae** (Nature) | `--color-arbor` | `#3DBD7D` | `#3DBD7D40` |
| ∞ **Architect** (Transcendence) | `--color-ascendii` | `#9B6BFF` | `#9B6BFF40` |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#3DBD7D` | Confirmed transactions, successful crafts |
| `--color-warning` | `#F5A623` | Pending state, gas spikes, low EP |
| `--color-danger` | `#E55C6C` | Failed crafts, errors, destructive actions |
| `--color-info` | `#2AABCF` | Informational callouts, tooltips |

### Usage Rules

- **Never** use pure white (`#FFFFFF`) on dark backgrounds — use `--color-text-primary` instead.
- Elemental accents are for **active/highlighted** states only. Do not use them as fill colors for large surfaces.
- Glow variants (`40` alpha suffix) are used exclusively for `box-shadow` and `text-shadow` effects on active elements.

---

## 3. Typography

### Font Stack

```css
/* Headings — mythic, weighted authority */
--font-display: 'Cinzel', 'Trajan Pro', serif;

/* Body — legible at all sizes */
--font-body: 'Inter', 'Segoe UI', system-ui, sans-serif;

/* Code & on-chain data */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Role | Size | Weight | Line Height | Token |
|------|------|--------|-------------|-------|
| Hero Title | 56px / 3.5rem | 700 | 1.1 | `--text-hero` |
| Section Heading | 36px / 2.25rem | 700 | 1.2 | `--text-h1` |
| Card Heading | 24px / 1.5rem | 600 | 1.3 | `--text-h2` |
| Sub-heading | 18px / 1.125rem | 600 | 1.4 | `--text-h3` |
| Body | 16px / 1rem | 400 | 1.6 | `--text-body` |
| Small / Label | 14px / 0.875rem | 400 | 1.5 | `--text-sm` |
| Caption / Micro | 12px / 0.75rem | 400 | 1.4 | `--text-xs` |
| On-chain Data | 14px / 0.875rem | 500 | 1.4 | `--text-mono` |

### Rules

- Display font (`Cinzel`) is used **only** for hero headings, quest names, and NFT titles.
- Body font (`Inter`) handles all UI chrome, labels, descriptions, and body copy.
- Mono font is used for wallet addresses, contract values, transaction hashes, and EP counts.
- Minimum body text size is **14px** — never go below `--text-xs` for readable content.

---

## 4. Iconography & Symbols

### Sacred Symbols

The ∞ glyph is the Ascendii signature — it appears at the end of forge confirmations, commit messages, and achievement unlocks. It must **never** be used as generic decoration.

| Symbol | Meaning | Usage |
|--------|---------|-------|
| ∞ | Infinite becoming | Quest completions, signatures, covenant moments |
| 💧 | Water / Aqua Vitae | Quest icon, component tag |
| ☀️ | Energy / Helios Forge | Quest icon, component tag |
| 🌳 | Nature / Arbor Vitae | Quest icon, component tag |
| ◆ | Core principle | Bullet points in manifesto/doctrine sections |
| ⬡ | Hexagon / Nexus node | Network visualizations, tier markers |

### Icon Style

- Use **outline** icons for inactive states, **filled** icons for active/selected states.
- Icon size must match text size: `16px` for `--text-sm`, `20px` for `--text-body`, `24px` for `--text-h3`.
- Never resize icons disproportionately. Maintain 1:1 aspect ratio.
- Elemental icons (💧 ☀️ 🌳) may be replaced with custom SVGs — if so, maintain the color tokens defined in the elemental palette.

---

## 5. Layout & Spacing

### Grid

- **Desktop**: 12-column grid, 24px gutters, max-width `1280px`
- **Tablet**: 8-column grid, 20px gutters
- **Mobile**: 4-column grid, 16px gutters

### Spacing Scale

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  24px;
--space-6:  32px;
--space-7:  48px;
--space-8:  64px;
--space-9:  96px;
--space-10: 128px;
```

Use **only** these tokens for margin, padding, and gap. Do not use arbitrary pixel values.

### Layout Principles

- **Breathing room is sacred**: Cards and sections should never feel compressed. Prefer `--space-6` (`32px`) as the minimum internal padding for major content blocks.
- **Hierarchy through space**: Group related elements tightly; separate conceptual sections with `--space-8` or `--space-9`.
- Forge/ritual flows use a **centered single-column** layout (max-width `680px`) to focus attention.
- Marketplace/exchange views use the full **12-column grid** with side-by-side comparison panels.

---

## 6. Component Patterns

### Buttons

| Variant | Use Case | Style |
|---------|----------|-------|
| **Primary** | Main action (Forge, Craft, Stake) | Filled with elemental accent, bold label |
| **Secondary** | Alternate action (View Details, Cancel) | Outlined, `--color-border` stroke |
| **Ghost** | Tertiary / low-priority actions | Text only, hover underline |
| **Danger** | Destructive actions (Burn, Abandon Quest) | `--color-danger` tint, requires confirmation dialog |

```css
/* Primary button — Aqua Vitae example */
.btn-primary {
  background: var(--color-aqua);
  color: var(--color-void);
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: 8px;
  padding: var(--space-3) var(--space-5);
  box-shadow: 0 0 16px var(--color-aqua-glow);
  transition: box-shadow 200ms ease, transform 150ms ease;
}
.btn-primary:hover {
  box-shadow: 0 0 28px var(--color-aqua-glow);
  transform: translateY(-1px);
}
```

**Rules:**
- Primary buttons use the **current quest's elemental color** (Aqua, Helios, or Arbor).
- Before an irreversible on-chain action, always show a **confirmation dialog** with cost summary.
- Disabled state uses `--color-text-muted` and removes the glow — never hide disabled buttons.

### Cards

- Corner radius: `12px` for content cards, `8px` for inline components, `4px` for tags/badges.
- Background: `--color-nexus` with a `1px` border in `--color-border`.
- Active/selected cards gain a `1px` border in the relevant elemental accent color and a subtle glow.

### NFT Display

- NFT artwork is always shown at its true aspect ratio — never cropped to fill a container.
- Rarity and elemental type are shown as a colored badge in the top-right corner of the card.
- On-chain metadata (token ID, owner address, EP requirement) uses `--font-mono` and `--color-text-secondary`.

### Progress & Effort Points

- EP progress bars use a gradient from `--color-border` (empty) to the active elemental accent (full).
- Tier transitions animate with a burst of the elemental color glow — never a silent state flip.
- Never display raw Wei or token decimals without human-readable formatting (e.g., `10,000 EP`, not `10000000000000000000`).

### Modals & Overlays

- Backdrop: `rgba(10, 10, 18, 0.85)` with `backdrop-filter: blur(8px)`.
- Modal panel: `--color-aether` background, `--space-7` padding, max-width `560px`.
- Always include a visible close affordance (✕ icon) and support `Escape` key dismissal.
- Forge/ritual modals additionally show a live gas estimate and a charity impact preview before confirmation.

### Toast Notifications

| Type | Color | Duration |
|------|-------|----------|
| Success (craft confirmed) | `--color-success` | 5 seconds |
| Warning (low EP, high gas) | `--color-warning` | 8 seconds |
| Error (tx failed) | `--color-danger` | Persistent until dismissed |
| Info | `--color-info` | 4 seconds |

---

## 7. Motion & Animation

Motion must feel **intentional and reverent**, not flashy. The forge does not rush.

### Principles

- **Purposeful**: Animate only when it communicates state change or guides attention.
- **Subtle**: Prefer `150–300ms` easing transitions over extended sequences.
- **Reduce-motion aware**: All animations must be disabled or simplified when `prefers-reduced-motion: reduce` is set.

### Timing Functions

```css
--ease-enter:  cubic-bezier(0.22, 1, 0.36, 1);   /* Smooth deceleration */
--ease-exit:   cubic-bezier(0.55, 0, 1, 0.45);   /* Quick exit */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Slight overshoot — used for success states */
```

### Signature Animations

| Event | Animation |
|-------|-----------|
| Successful craft | Elemental glow pulse → ∞ glyph fade-in → card reveal |
| Failed craft | Shake (3px, 200ms) → red flash → gentle fade to muted state |
| EP milestone | Progress bar fills with spring easing → tier badge scales up |
| Cross-chain bridge | Animated path connecting two chain logos, 1.5s duration |
| Architect unlock | Full-screen aura burst, stars, ∞ glyph — reserved exclusively for this event |

---

## 8. Accessibility

All interfaces must meet **WCAG 2.1 AA** at minimum. Forge interfaces handling real money must target **AAA** contrast for primary text.

### Color Contrast Requirements

| Context | Minimum Ratio |
|---------|---------------|
| Body text on dark background | 4.5:1 |
| Large text / headings | 3:1 |
| Interactive element borders | 3:1 |
| Elemental accent on `--color-void` | 4.5:1 (verified for all four accents) |

### Focus Management

- All interactive elements must have a visible focus indicator.
- Focus ring style: `2px solid currentColor` with a `2px` offset, using the elemental accent color for forge actions.
- Modal opens must move focus to the first focusable element inside the modal.
- Forge confirmation must be completable by keyboard alone.

### Screen Reader Support

- All NFT images require descriptive `alt` text (e.g., `"Wellspring of Eternity — Aqua Vitae legendary NFT, Token #42"`).
- On-chain status updates should be announced via `aria-live="polite"` regions.
- Progress bar components must use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

---

## 9. Responsive Design

### Breakpoints

```css
--breakpoint-sm:  480px;  /* Large phones */
--breakpoint-md:  768px;  /* Tablets */
--breakpoint-lg:  1024px; /* Small desktops */
--breakpoint-xl:  1280px; /* Standard desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Behavior by Breakpoint

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Marketplace grid | 3–4 columns | 2 columns | 1 column |
| Trinity quest flow | Side-by-side | Stacked | Stacked |
| Navigation | Top bar | Top bar + hamburger | Drawer |
| NFT card | Full metadata | Condensed metadata | Name + rarity only (expand on tap) |
| Forge modal | Centered, 560px | Centered, 480px | Full-screen bottom sheet |

### Touch Targets

- Minimum tap target size: `44×44px` on all touch devices.
- Buttons in forge flows must be a minimum of `48px` tall on mobile to prevent mis-taps during high-value transactions.

---

## 10. Tone & Voice

The interface copy is part of the ritual. Words carry weight.

### Voice Attributes

| Do | Don't |
|----|-------|
| Mythic but clear | Cryptic or exclusionary |
| Warm and earned | Hype-driven or salesy |
| Precise about costs and risk | Vague or minimizing |
| Inviting ("Begin your ascension") | Pressuring ("Act now!") |

### Copy Patterns

```
// Quest call to action
"Begin your ascension →"       ✅
"CLICK HERE TO START!!!"       ❌

// Transaction confirmation
"Forge Wellspring of Eternity — costs 0.12 ETH + gas. This funds one clean-water well."  ✅
"Confirm transaction"          ❌ (too vague)

// Error state
"The forge could not complete — your components have been returned. Try again when gas is lower."  ✅
"Transaction failed (code: 4001)"  ❌ (raw error, no guidance)

// Success state
"The Wellspring of Eternity has been forged. A well will be funded. ∞"  ✅
"Success!"  ❌ (misses the impact moment)
```

### Commit Signature

All commit messages, changelogs, and forge confirmations end with **∞** — this is the Ascendii signature and must be preserved in any UI where commit-style text appears.

---

## Appendix: Design Token Reference

All tokens above should be implemented as CSS custom properties on `:root` and consumed via `var()`. Never hard-code hex values or pixel values outside the token system.

```css
:root {
  /* Backgrounds */
  --color-void:   #0A0A12;
  --color-nexus:  #12121F;
  --color-aether: #1E1E33;
  --color-border: #2A2A45;

  /* Text */
  --color-text-primary:   #E8E8F0;
  --color-text-secondary: #9090B0;
  --color-text-muted:     #50506A;

  /* Elementals */
  --color-aqua:   #2AABCF;
  --color-helios: #F5A623;
  --color-arbor:  #3DBD7D;
  --color-ascendii: #9B6BFF;

  /* Semantic */
  --color-success: #3DBD7D;
  --color-warning: #F5A623;
  --color-danger:  #E55C6C;
  --color-info:    #2AABCF;

  /* Typography */
  --font-display: 'Cinzel', 'Trajan Pro', serif;
  --font-body:    'Inter', 'Segoe UI', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --space-1:  4px;  --space-2:  8px;  --space-3:  12px; --space-4:  16px;
  --space-5:  24px; --space-6:  32px; --space-7:  48px; --space-8:  64px;
  --space-9:  96px; --space-10: 128px;

  /* Motion */
  --ease-enter:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-exit:   cubic-bezier(0.55, 0, 1, 0.45);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

**"The forge awaits. Build with beauty." ∞**
