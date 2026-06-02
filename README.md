# lithium-prism

Standalone, framework-agnostic UI kit built on native Web Components (custom elements). It ships
the building blocks used by web interfaces with typography, buttons, toggles, inputs, loading states,
icons, and the brand gradient shimmer effect with with zero runtime framework dependency. Drop the
elements into any page or framework (React, Vue, Svelte, plain HTML, etc.).

> [!NOTE]
> lithium-prism is a fork of [imput/helium-prism](https://github.com/imputnet/helium-prism), ported
> from Svelte to native Web Components. Licensed GPL-3.0-only. Original work © The Helium Authors.

## Installation

pnpm:

```sh
pnpm add @abh80/lithium-prism
```

## Usage

### Import the barrel (registers every element)

Import the package root once near your app entry point to register all custom elements, then import
the stylesheet:

```js
import "@abh80/lithium-prism";
import "@abh80/lithium-prism/lithium.css";
```

Once registered, use the elements anywhere in your markup:

```html
<lit-button primary>Button</lit-button>
<lit-button>Button 2</lit-button>
<lit-toggle></lit-toggle>
<lit-icon name="copy"></lit-icon>
```

### Per-element imports

To register only the elements you use, import them individually:

```js
import "@abh80/lithium-prism/element/lit-button";
import "@abh80/lithium-prism/element/lit-toggle";
import "@abh80/lithium-prism/lithium.css";
```

### CDN (no bundler)

Each element can be loaded directly in the browser as an ES module:

```html
<link rel="stylesheet" href="https://unpkg.com/@abh80/lithium-prism/dist/lithium.css" />
<script type="module">
    import "https://unpkg.com/@abh80/lithium-prism/element/lit-button";
</script>

<lit-button primary>Button</lit-button>
```

## Elements

All elements are registered with a `lit-` prefix:

- `lit-button` — buttons (boolean attributes such as `primary`, `circle`, `card`, `transparent`,
  plus `disabled` and `type`)
- `lit-toggle` — toggle switch
- `lit-checkbox` — checkbox
- `lit-input` — text input
- `lit-text` — typography
- `lit-spinner` — loading spinner
- `lit-skeleton` — skeleton placeholder
- `lit-gradient-shimmer` — brand gradient shimmer effect
- `lit-card-link`, `lit-outer-link` — link surfaces
- `lit-search-bar` — search bar
- `lit-tooltip` — tooltip
- `lit-dropdown` — dropdown
- `lit-copy-icon` — copy-to-clipboard icon
- `lit-icon` — icon by name, e.g. `<lit-icon name="copy"></lit-icon>`
- `lit-helium-logo`, `lit-helium-text` — brand mark and wordmark

## Theming

lithium-prism derives every color from four CSS custom properties. Override them on
`:root` (or any subtree — variables pierce the shadow DOM):

| Variable            | Controls                                                                    | Light default           |
| ------------------- | --------------------------------------------------------------------------- | ----------------------- |
| `--lithium-accent`  | Action color: primary button, toggle-on, checkbox, focus, links             | `#3450d1`               |
| `--lithium-bg`      | Page background                                                             | `#fbfcff`               |
| `--lithium-surface` | Elevated tint base (button/input/panel backgrounds); defaults to the accent | `var(--lithium-accent)` |
| `--lithium-fg`      | Text base (`--primary`/`--secondary`/`--tertiary` derive from it)           | `#0d1c64`               |

```css
/* Accent applies in both light and dark from a single override. */
:root {
    --lithium-accent: #c2410c;
}

/* Background and foreground are scheme-specific — set them per scheme. */
:root {
    --lithium-bg: #fff8f3;
    --lithium-fg: #3a1d0c;
}
@media (prefers-color-scheme: dark) {
    :root {
        --lithium-bg: #160f0a;
        --lithium-fg: #f3e9e2;
    }
}

/* Decouple the elevated surface tint from the accent if you want neutral surfaces. */
:root {
    --lithium-surface: #6b7280;
}
```

Derived shades (`hover`/`press`, the `--lithium-elevated-*` tint scale, `--secondary`,
`--tertiary`, the background gradient) are computed from these knobs with `color-mix`, so a
single override cascades through the kit. Requires a browser with `color-mix()` support
(all evergreen browsers since 2023).

## License

lithium-prism is licensed under [GPL-3.0-only](LICENSE).

The icon set is sourced from a separate project under the MIT license; see
[src/components/ICONS-LICENSE](src/components/ICONS-LICENSE).
