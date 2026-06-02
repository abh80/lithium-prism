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

The stylesheet exposes CSS custom properties prefixed with `--lithium-*` (for example
`--lithium-blue`, `--lithium-blue-hover`, `--lithium-blue-press`, and the elevation scale
`--lithium-elevated-5` … `--lithium-elevated-50`). Override them on `:root` or any ancestor to
customize the theme.

## License

lithium-prism is licensed under [GPL-3.0-only](LICENSE).

The icon set is sourced from a separate project under the MIT license; see
[src/components/ICONS-LICENSE](src/components/ICONS-LICENSE).
