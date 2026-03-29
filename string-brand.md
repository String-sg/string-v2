# String Brand System

A portable reference for colors, typography, spacing, and component patterns — applicable across any String repo or product.

> **Note:** String Reports uses dark mode exclusively. The tokens below reflect the Reports implementation. The neutral surface tokens (white/light) apply to light-mode String products (e.g. string.sg).

---

## Colors

### CSS Custom Properties (Reports — dark mode always)

```css
:root {
  /* Backgrounds */
  --background:   #1A1D1F;  /* page background */
  --card:         #33373B;  /* card / panel backgrounds */
  --muted:        #3D4146;  /* subtle backgrounds, inputs */

  /* Primary accent */
  --primary:             #75F8CC;  /* String mint — CTAs, links, active states */
  --primary-foreground:  #33373B;  /* text on mint backgrounds */

  /* Secondary accent */
  --accent:              #C0F4FB;  /* secondary highlight */
  --accent-foreground:   #33373B;

  /* Text */
  --foreground:          #F0F0F0;  /* primary text */
  --muted-foreground:    #9CA3AF;  /* secondary / caption text */

  /* Borders */
  --border:  #3D4146;

  /* Semantic */
  --destructive:  #FF5E5E;
  --ring:         #75F8CC;

  /* Border radius base */
  --radius: 0.75rem;  /* 12px */
}
```

### Brand tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `string-mint` | `#75F8CC` | Primary CTA buttons, active states, highlights, links |
| `string-mint-light` | `#A8FAE0` | Hover / lighter variant of mint |
| `string-mint-dark` | `#2BB389` | Pressed / deeper mint interactions |
| `string-dark` | `#33373B` | Navbar background, card surfaces, icon fills on mint |
| `string-darker` | `#1A1D1F` | Page background |
| `string-light` | `#C0F4FB` | Secondary accent, subtle tinted backgrounds |
| `string-gray` | `#9CA3AF` | Muted text, secondary icons |

### Tailwind 4 (`@theme inline` block)

```css
@theme inline {
  --font-sans:    var(--font-montserrat), 'Montserrat', sans-serif;
  --font-heading: var(--font-space-grotesk), 'Space Grotesk', sans-serif;

  --color-string-mint:        var(--string-mint);
  --color-string-mint-light:  var(--string-mint-light);
  --color-string-mint-dark:   var(--string-mint-dark);
  --color-string-dark:        var(--string-dark);
  --color-string-darker:      var(--string-darker);
  --color-string-light:       var(--string-light);
  --color-string-gray:        var(--string-gray);

  --color-background:         var(--background);
  --color-foreground:         var(--foreground);
  --color-card:               var(--card);
  --color-muted:              var(--muted);
  --color-muted-foreground:   var(--muted-foreground);
  --color-primary:            var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-border:             var(--border);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

---

## Typography

### Fonts

| Role | Family | Weights | Loaded via |
|------|--------|---------|------------|
| Headings (`h1`–`h6`) | **Space Grotesk** | 400, 500, 600, 700 | `next/font/google` → CSS var `--font-space-grotesk` |
| Body / UI text | **Montserrat** | 400, 500, 600, 700 | `next/font/google` → CSS var `--font-montserrat` |

> Always reference via CSS variable first (e.g. `var(--font-space-grotesk), 'Space Grotesk', sans-serif`). The literal string is a fallback only — `next/font` loads fonts as CSS variables, not global `<link>` tags.

### Scale

| Role | Size | Weight | Tailwind class |
|------|------|--------|----------------|
| Hero heading | 36px | 700 | `text-4xl font-bold` |
| Page heading | 30px | 700 | `text-3xl font-bold` |
| Section heading | 18px | 600 | `text-lg font-semibold` |
| Body | 14–16px | 400 | `text-sm` / `text-base` |
| Label / caption | 12px | 400–600 | `text-xs` |
| Eyebrow / overline | 12px | 600 | `text-xs font-semibold uppercase tracking-widest` |

### Base styles

```css
@layer base {
  body {
    font-family: var(--font-montserrat), 'Montserrat', sans-serif;
    @apply bg-background text-foreground antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
  }
}
```

---

## Spacing & Layout

| Concept | Value | Tailwind |
|---------|-------|---------|
| Container (detail page) | 768px | `max-w-3xl` |
| Container (index page) | 1024px | `max-w-5xl` |
| Section gap | 48px | `mb-12` |
| Card padding (default) | 20px | `p-5` |
| Card padding (large / CTA) | 32px | `p-8` |
| Grid gap | 16px | `gap-4` |

---

## Border Radius

| Element | Radius | Tailwind |
|---------|--------|---------|
| Cards, banners, metric tiles | 12px | `rounded-xl` |
| Buttons, tags, badges | 8px | `rounded-lg` |
| Audience pills | 9999px | `rounded-full` |

---

## Component Patterns

### Navbar / Header

```css
bg-[#33373B] border-b border-white/10
/* Logo / brand link */
text-sm font-semibold text-primary tracking-tight
/* Secondary nav link */
text-xs font-medium text-primary hover:underline underline-offset-4
```

### Project Card

```css
/* Outer wrapper — overlay link pattern */
relative flex flex-col rounded-2xl bg-card border border-border p-5 gap-4
hover:border-primary/40 transition-colors

/* Invisible overlay link (covers whole card) */
absolute inset-0 rounded-2xl

/* "Try it" link — sits above overlay */
relative z-10 inline-flex items-center gap-1.5 text-xs font-medium text-primary
```

### Status Badge

| Status | Classes |
|--------|---------|
| Building | `bg-[#75F8CC]/15 text-[#75F8CC] border border-[#75F8CC]/30` |
| Maintenance | `bg-[#C0F4FB]/15 text-[#C0F4FB] border border-[#C0F4FB]/30` |
| Deprecated | `bg-white/8 text-white/40 border border-white/10` |
| Prototype | `bg-amber-400/15 text-amber-300 border border-amber-400/30` |

### Audience Pill

```css
text-xs px-2.5 py-1 rounded-full bg-[#75F8CC]/10 text-[#75F8CC]/80
```

### Metric Tile

```css
rounded-xl bg-card border border-border p-5
/* Label */
text-xs font-semibold uppercase tracking-widest text-primary mb-3
/* Value */
text-3xl font-bold text-foreground leading-none
/* Delta (positive) */
text-sm mt-2 font-medium text-teal-400
/* Delta (negative) */
text-sm mt-2 font-medium text-rose-400
/* Description */
text-xs text-muted-foreground mt-1
```

### Deprecated Alternative Banner

```css
rounded-xl border border-amber-400/30 bg-amber-400/10 p-5 mb-10
/* Icon + label */
text-xs font-semibold uppercase tracking-widest text-amber-400
/* Primary button */
bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300
/* Secondary "Learn more" button */
bg-amber-400/5 hover:bg-amber-400/10 border border-amber-400/20 text-amber-400/70
```

### Updates Timeline

```css
/* Track */
relative border-l border-border ml-3 space-y-8
/* Item */
pl-6 relative
/* Dot */
absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-primary
/* Date label */
text-xs font-semibold text-primary mb-2 uppercase tracking-wider
/* Body */
text-sm text-muted-foreground leading-relaxed
```

### Join CTA Block (non-deprecated products only)

```css
rounded-xl border border-primary/30 bg-primary/5 p-8 text-center
```

---

## Favicon / Icons

For Next.js App Router:

| File | Location | Purpose |
|------|----------|---------|
| `favicon.ico` | `app/` | Auto-detected by Next.js |
| `icon.svg` | `public/` | SVG favicon (referenced in metadata) |
| `icon-light-32x32.png` | `public/` | Light-mode favicon |
| `icon-dark-32x32.png` | `public/` | Dark-mode favicon |
| `apple-icon.png` | `public/` | Apple touch icon (180×180) |

---

## OpenGraph

Static OG image approach (matches diagrams.string.sg pattern).

### Asset spec

| File | Location | Dimensions |
|------|----------|------------|
| `og-image.jpg` | `public/` | 1280 × 1024 px |

### Metadata setup (`app/layout.tsx`)

```ts
export const metadata: Metadata = {
  title: 'String Reports',
  description: 'Impact metrics, updates and learnings from the String volunteer edutech ecosystem.',
  openGraph: {
    title: 'String Reports',
    description: 'Impact metrics, updates and learnings from the String volunteer edutech ecosystem.',
    images: [{ url: '/og-image.jpg', width: 1280, height: 1024 }],
  },
}
```

### Guidelines

- OG image is set once at the root layout — all pages share the same image
- Design the image on a dark background (`#1A1D1F`) using the String mint (`#75F8CC`) and Space Grotesk for any text, to stay on-brand
- Recommended content: String logo / wordmark + tagline + URL (`reports.string.sg`)
- Export as JPEG (not PNG) to keep file size small — aim for under 100 KB
- Test with [opengraph.xyz](https://www.opengraph.xyz) or the Twitter Card Validator after deploying

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use `--primary`, `--card`, `--muted-foreground` tokens | Hardcode `#75F8CC` or `#33373B` directly |
| Reference fonts as `var(--font-space-grotesk), 'Space Grotesk', sans-serif` | List the literal font string before the CSS variable |
| Use `rounded-xl` for cards and banners | Mix arbitrary radii |
| Use `transition-colors` on interactive elements | Skip transitions on hover states |
| Use `Space Grotesk` for all headings | Use Montserrat or system fonts for headings |
| Include `rel="noopener noreferrer"` on external links | Open external URLs without security attributes |
| Use overlay-link pattern for cards with nested external links | Nest `<a>` inside `<Link>` |
