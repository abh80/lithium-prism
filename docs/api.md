# Lithium Prism API

Standalone native Web Components. Every primitive is a custom element registered as
`lit-<name>`; works in any framework or none. A fork of
[imput/helium-prism](https://github.com/imputnet/helium-prism), ported from Svelte.

### Navigation

- [Package exports](#package-exports)
- [Setup](#setup)
- [Theming](#theming)
- [Text](#text)
- [Buttons and links](#buttons-and-links)
- [Inputs](#inputs)
- [Checkbox and toggle](#checkbox-and-toggle)
- [Shimmer](#shimmer)
- [Feedback and utility](#feedback-and-utility)
- [Icons](#icons)

## Package exports

- `.`: side-effect entry that registers **every** element on import, and re-exports the
  element classes from `src/index.ts`.
- `./element/lit-button` (and any `lit-*`): registers a **single** element — tree-shakeable.
- `./lithium.css`: design tokens (CSS custom properties) + the light/dark theme. Load once.

Elements registered by the barrel:

- `lit-text`
- `lit-button`, `lit-card-link`, `lit-outer-link`
- `lit-input`, `lit-search-bar`, `lit-dropdown`, `lit-checkbox`, `lit-toggle`
- `lit-gradient-shimmer`, `lit-spinner`, `lit-skeleton`, `lit-copy-icon`, `lit-tooltip`
- `lit-helium-logo`, `lit-helium-text`
- `lit-icon` (single registry element, see [Icons](#icons))

## Setup

Load the theme stylesheet once, then import the elements.

```html
<link rel="stylesheet" href="@abh80/lithium-prism/lithium.css" />
<script type="module">
    import "@abh80/lithium-prism"; // registers every element
</script>

<lit-button primary>Continue</lit-button>
```

Tree-shake to only the elements you use:

```js
import "@abh80/lithium-prism/element/lit-button";
import "@abh80/lithium-prism/element/lit-toggle";
```

CDN, no build step:

```html
<link rel="stylesheet" href="https://unpkg.com/@abh80/lithium-prism/dist/lithium.css" />
<script type="module" src="https://unpkg.com/@abh80/lithium-prism"></script>
```

The package augments `HTMLElementTagNameMap`, so `document.createElement("lit-toggle")` and
`querySelector("lit-toggle")` are typed.

**Framework notes.** Custom elements work in any framework. Attributes are set as-is; rich
state uses JS properties; state changes are `CustomEvent`s (not callback props):

- React (19+): pass attributes/properties directly and listen with `onChange` via a ref or
  `addEventListener`. Two-way binding is manual.
- Vue: `<lit-toggle :checked="on" @change="on = $event.detail.checked" />`.
- Vanilla: `el.checked = true; el.addEventListener("change", e => …)`.

## Theming

Every color derives from four base knobs defined in `lithium.css` and resolved through the
shadow boundary (custom properties inherit into shadow roots). Override them on `:root` (or
any subtree) to retheme the whole kit. Light/dark switch automatically via
`prefers-color-scheme`.

| Variable            | Controls                                                          | Light default           |
| ------------------- | ---------------------------------------------------------------- | ----------------------- |
| `--lithium-accent`  | Action color: primary button, toggle-on, checkbox, focus, links  | `#3450d1`               |
| `--lithium-bg`      | Page background                                                   | `#fbfcff`               |
| `--lithium-surface` | Elevated tint base (button/input/panel tints); defaults to accent | `var(--lithium-accent)` |
| `--lithium-fg`      | Text base (`--primary`/`--secondary`/`--tertiary` derive from it) | `#0d1c64`               |

```css
/* Accent applies in both light and dark from a single override. */
:root {
    --lithium-accent: #c2410c;
}

/* Background and foreground are scheme-specific — set them per scheme. */
@media (prefers-color-scheme: dark) {
    :root {
        --lithium-bg: #160f0a;
        --lithium-fg: #f3e9e2;
    }
}
```

Every other token is derived from these knobs with `color-mix`: `--lithium-blue`
(+`-hover`/`-press`), the `--lithium-elevated-*` surface-tint scale, `--bg-surface`/
`--background` and the background gradient, `--primary`/`--secondary`/`--tertiary` text, and
the `--tooltip-*` surface. Component internals consume the derived names, so a single knob
override cascades everywhere. The dark `@media` block overrides `--lithium-bg`/`-fg`/`-surface`
but never the accent, so an accent override holds across both schemes. Requires `color-mix()`
support (all evergreen browsers since 2023).

## Text

`lit-text` renders the matching heading or paragraph element for a typography variant. Use the
`tag` attribute when the semantic element must be explicit.

```html
<lit-text variant="display">Display</lit-text>
<lit-text variant="title">Title</lit-text>
<lit-text variant="heading">Heading</lit-text>
<lit-text variant="subheading">Subheading</lit-text>
<lit-text variant="body">Body copy.</lit-text>
<lit-text variant="caption">Caption copy.</lit-text>

<lit-text tag="h3" tone="secondary">Semantic heading</lit-text>
<lit-text tag="p" center>Centered paragraph.</lit-text>
```

Attributes: `variant` (`display`, `title`, `heading`, `subheading`, `body`, `caption`),
`tone` (`primary`, `secondary`, `tertiary`, `white`), `tag`, and `center`. The element/tag is
chosen once at render; later `variant`/`tag` changes do not re-tag.

## Buttons and links

`lit-button` exposes the style variants as boolean attributes: `primary`, `transparent`,
`card`, `selected`, `circle`, plus native `disabled` and `type`. Icons go in the default slot.

```html
<lit-button>Cancel</lit-button>
<lit-button primary>Continue <lit-icon name="arrow-right"></lit-icon></lit-button>
<lit-button transparent>Secondary action</lit-button>
<lit-button disabled><lit-icon name="download"></lit-icon> Download</lit-button>
<lit-button selected>Selected</lit-button>
<lit-button circle aria-label="Continue"><lit-icon name="arrow-right"></lit-icon></lit-button>

<lit-button card>
    <span>Card action</span>
    <lit-icon name="arrow-right"></lit-icon>
</lit-button>
```

`lit-outer-link` is an external anchor. It opens non-hash URLs in a new tab by default and
adds `rel="noopener noreferrer"`; hash links stay on the page. Add the `button` attribute (and
optional `primary`/`transparent`/`card`/`circle`) to render it with the button look.

```html
<lit-outer-link href="https://helium.computer">Helium</lit-outer-link>
<lit-outer-link button primary href="https://helium.computer">
    <lit-icon name="external-link"></lit-icon> Get Helium
</lit-outer-link>
```

`lit-card-link` is a full-width action card with a built-in trailing external-link icon. Slot
the title/description content.

```html
<lit-card-link href="https://example.com">
    <div>
        <lit-text variant="subheading">Read more</lit-text>
        <lit-text variant="body">Open the documentation.</lit-text>
    </div>
</lit-card-link>
```

Attributes: `lit-card-link` and `lit-outer-link` take `href`, `target`, `rel`.

## Inputs

`lit-input`, `lit-search-bar`, and `lit-dropdown` expose `value` as both an attribute and a JS
property (`el.value`). State changes dispatch `CustomEvent`s; two-way binding is the consumer's
job.

`lit-input` accepts `small` for a compact field, `width`, `placeholder`, `disabled`, `id`,
`aria-label`, and named `leading`/`trailing` slots for accessories. It emits `input` with
`detail.value`.

`lit-search-bar` has a built-in leading search icon, `placeholder`, and `value`. It emits
`input` with `detail.value` while typing and `search` with `detail.value` on Enter.

`lit-dropdown` takes `value`, `placeholder`, `width`, `aria-label`, `disabled`, and an `open`
attribute. Options are slotted children carrying `slot="option"` and `data-value`; selecting
one emits `change` with `detail.value` and closes the panel.

```html
<lit-search-bar id="search" aria-label="Search" placeholder="Search"></lit-search-bar>

<lit-input id="email" aria-label="Email" placeholder="Email">
    <lit-icon slot="leading" name="link"></lit-icon>
    <lit-icon slot="trailing" name="chevron-down"></lit-icon>
</lit-input>
<lit-input id="email-small" small aria-label="Small input"></lit-input>

<lit-dropdown id="channel" value="stable" width="260px" aria-label="Release channel">
    <div slot="option" data-value="stable" role="option">Stable channel</div>
    <div slot="option" data-value="beta" role="option">Beta channel</div>
    <div slot="option" data-value="nightly" role="option">Nightly channel</div>
</lit-dropdown>

<script type="module">
    const dd = document.querySelector("#channel");
    dd.addEventListener("change", (e) => console.log(e.detail.value));
    const search = document.querySelector("#search");
    search.addEventListener("search", (e) => runSearch(e.detail.value));
</script>
```

Give inputs an `id` and `aria-label`. Placeholders are visual hints, not labels.

## Checkbox and toggle

Both expose `checked` as an attribute and a JS property and emit `change` with
`detail.checked` on user interaction.

```html
<lit-checkbox id="terms" checked>Checkbox text</lit-checkbox>

<lit-toggle checked name="Setting" desc="Short setting description."></lit-toggle>

<script type="module">
    const t = document.querySelector("lit-toggle");
    t.addEventListener("change", (e) => console.log(e.detail.checked));
    t.checked = false; // property setter reflects to the attribute
</script>
```

`lit-checkbox`: `checked`, `disabled`, `id`, `aria-label`; default slot for the label.
`lit-toggle`: `checked`, `name`, `desc`, `disabled`; renders `role="switch"`. Provide custom
content via the default slot instead of `name`/`desc`.

## Shimmer

`lit-gradient-shimmer` fills its parent by default. Add the `background` attribute to position
it fixed over the viewport. The intro animation runs on mount unless the `no-intro` attribute
is set. The element exposes `intro()` and `emphasize()` methods.

```html
<div style="height: 320px">
    <lit-gradient-shimmer no-intro></lit-gradient-shimmer>
</div>

<lit-button id="replay">Replay intro</lit-button>
<script type="module">
    const shimmer = document.querySelector("lit-gradient-shimmer");
    document.querySelector("#replay").addEventListener("click", () => shimmer.intro());
</script>
```

Attributes:

- `no-intro`: skip the intro animation on mount (intro runs by default).
- `background`: position the canvas fixed to the viewport.

Methods: `intro()` replays the intro; `emphasize()` triggers the emphasis wave.

## Feedback and utility

```html
<lit-helium-logo></lit-helium-logo>
<lit-helium-logo height="32px"></lit-helium-logo>
<lit-helium-text></lit-helium-text>
<lit-helium-text height="32px"></lit-helium-text>

<lit-spinner></lit-spinner>
<lit-spinner size="18"></lit-spinner>

<lit-skeleton width="120px" height="38px"></lit-skeleton>

<lit-copy-icon value="https://helium.computer"></lit-copy-icon>

<lit-tooltip text="Tooltip content">
    <lit-button>Hover</lit-button>
</lit-tooltip>
```

- `lit-helium-logo` / `lit-helium-text`: brand marks; `height` sizes them (width auto).
- `lit-spinner`: `size` in px (default 24).
- `lit-skeleton`: `width`, `height`.
- `lit-copy-icon`: copies its `value` to the clipboard on click, animates to a check, and
  emits `copy` with `detail.value`. Pass `link` to show the link icon instead of the copy icon.
- `lit-tooltip`: `text` sets the tip; the default slot is the trigger. Shows on hover/focus.

## Icons

`lit-icon` is a single registry element. Set `name` to one of the icon names; it renders an
inline SVG inheriting `currentColor` and sized to `1em` (override with `width`/`height` via
CSS, or let a host component size it — buttons/inputs size slotted icons automatically).

```html
<lit-icon name="arrow-right"></lit-icon>
<lit-icon name="download" style="width: 24px; height: 24px"></lit-icon>
```

Names: `arrow-down`, `arrow-left`, `arrow-right`, `arrow-up`, `bang`, `check`, `chevron-down`,
`copy`, `download`, `external-link`, `info`, `link`, `loader`, `search`, `world`, `x`.
