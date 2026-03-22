```markdown
# Design System Strategy: The Editorial Hearth

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Curator**. 

We are moving away from the "recipe blog" trope of cluttered grids and aggressive advertising. Instead, we are designing a high-end digital editorial experience that feels as tactile and intentional as a boutique linen-bound cookbook. The aesthetic identity balances the precision of a professional kitchen with the soul of a sun-drenched home pantry. 

To achieve this, we break the "template" look through **intentional asymmetry**—offsetting imagery from text blocks—and **tonal layering**. We treat the screen not as a flat surface, but as a series of parchment layers, using the warmth of the cream (`#fcf9f2`) to invite the user in, and the boldness of the terracotta (`#994127`) to guide their journey.

## 2. Colors
Our palette is a sophisticated interplay of earth tones designed to feel organic yet authoritative.

*   **Primary (Terracotta - `#994127`):** Use this for brand-defining moments and high-priority actions. It is the "heat" of the kitchen.
*   **Secondary (Sage - `#576247`):** Used for herb-like accents, healthy categories, and grounding elements.
*   **Tertiary (Warm Wood - `#7b542b`):** Reserved for narrative elements and secondary interactive points.

### The "No-Line" Rule
Explicitly prohibit the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a recipe ingredient list should sit on a `surface-container-low` (`#f6f3ec`) section against the main `background` (`#fcf9f2`). Lines are architectural; color shifts are atmospheric.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create nested depth:
*   **Base:** `surface` (`#fcf9f2`) for the main canvas.
*   **Sectioning:** `surface-container-low` (`#f6f3ec`) for large content blocks.
*   **Cards/Elements:** `surface-container-highest` (`#e5e2db`) for focused components.

### The "Glass & Gradient" Rule
To elevate the "homey" feel into "professional," use Glassmorphism for floating navigation bars or recipe "Quick-View" overlays. Use semi-transparent versions of `surface` with a 12px-20px backdrop-blur. For main CTAs (like "Start Cooking"), apply a subtle linear gradient from `primary` (`#994127`) to `primary-container` (`#b8583d`) to add a three-dimensional, "simmering" depth.

## 3. Typography
The typography is the "voice" of the chef: authoritative yet warm.

*   **Display & Headlines (Newsreader):** Use the serif for all high-level storytelling. The `display-lg` (3.5rem) should be used for recipe titles to create an editorial, magazine-like feel. Its classic proportions convey heritage and trust.
*   **Body & Titles (Plus Jakarta Sans):** Use this clean sans-serif for instructions and functional data. It provides the "professional" edge required for legibility during the heat of cooking.
*   **The Hierarchy Hook:** Pair a `headline-sm` in Newsreader with a `label-md` in Plus Jakarta Sans (all-caps, 0.05em tracking) to create a sophisticated, labeled-archive look.

## 4. Elevation & Depth
We eschew traditional "drop shadows" in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` section creates a soft, natural lift that mimics paper resting on a countertop.
*   **Ambient Shadows:** If a floating element (like a "Save Recipe" FAB) is necessary, use an extra-diffused shadow. 
    *   *Blur:* 24px-40px. 
    *   *Opacity:* 5% of `on-surface-variant`.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` (`#dcc1ba`) at 15% opacity. Never use 100% opaque borders; they shatter the organic flow of the "Digital Curator" aesthetic.

## 5. Components

### Buttons
*   **Primary:** High-pill shape (`rounded-full`), `primary` background, `on-primary` text. Apply the "Signature Texture" gradient.
*   **Secondary:** `secondary-container` background with `on-secondary-container` text. No border.
*   **Tertiary:** Text-only in `primary`, using `title-sm` typography for weight.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate ingredients or steps. Use `spacing-4` (1.4rem) or subtle background shifts between `surface-container-low` and `surface-container-high`.
*   **Image Integration:** Recipe cards should feature images with `rounded-xl` (1.5rem) corners to soften the professional layout.

### Input Fields
*   **Style:** Minimalist. Use a `surface-container-highest` background with a `rounded-md` corner.
*   **Focus State:** Transition the background to `surface-container-lowest` and add a 2px "Ghost Border" of `primary` at 30% opacity.

### Additional Contextual Components
*   **The "Prep Timer" Chip:** A `secondary-fixed` chip with an icon, using `label-md` for the duration.
*   **The "Ingredient Toggle":** A custom checkbox that uses `primary` for the checked state, but instead of a standard tick, it subtly strikes through the text in `outline` color.

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetric Grids:** Offset your hero images. Let the typography breathe and "overflow" into whitespace.
*   **Embrace Cream Space:** Treat the `background` as a luxury material. Don't feel the need to fill every corner.
*   **Scale Typographic Contrast:** Use `display-lg` and `body-sm` on the same screen to create a dynamic, curated hierarchy.

### Don't:
*   **Don't use pure black:** Use `on-surface` (`#1c1c18`) for text to maintain the warm, organic feel.
*   **Don't use "Standard" Card Shadows:** Avoid the heavy, grey shadows of default UI kits. Stick to tonal stacking.
*   **Don't use 1px Dividers:** They make the site look like a spreadsheet. Use whitespace (the Spacing Scale) to define "chapters" of content.
*   **Don't Over-round Everything:** Use `rounded-full` for buttons, but stick to `rounded-lg` or `rounded-xl` for cards to keep a "professional" structural integrity.