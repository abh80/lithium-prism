import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Ported from OuterLink.svelte <style>. No --helium-* vars present upstream.
// Upstream is a plain external <a class="outer-link"> that, in the Helium app,
// could opt into the global `.button` look via a passed class. Shadow DOM hides
// global classes, so the button styling is carried here and switched on by the
// `button` (+ variant) attributes — mirroring the original `class="button …"` usage.
const styles = css`
    :host {
        display: contents;
    }
    .outer-link {
        text-decoration: none;
    }
    .outer-link:not(.button) {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: fit-content;
        color: var(--white);
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 4px;
    }
    .outer-link:not(.button) ::slotted(svg),
    .outer-link:not(.button) ::slotted(lit-icon) {
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        stroke-width: 2px;
    }
    .outer-link:focus-visible {
        outline: 2px var(--primary) solid;
        outline-offset: 3px;
        border-radius: 5px;
    }

    /* Button-look variants (mirror lit-button), enabled by the \`button\` attribute. */
    .outer-link.button {
        --size: 38px;
        color: var(--primary);
        background-color: var(--lithium-elevated-7);
        font-size: 16px;
        min-height: 38px;
        padding: 9px 16px;
        border-radius: calc(var(--size) / 2);
        transition:
            0.2s background-color,
            0.2s transform;
        will-change: transform;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        width: fit-content;
        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }
    .outer-link.button.transparent {
        background-color: transparent;
    }
    .outer-link.button:active {
        background-color: var(--lithium-elevated-15);
        transform: scale(0.97);
    }
    .outer-link.button.primary {
        color: var(--white);
        background-color: var(--lithium-blue);
    }
    .outer-link.button.primary:active {
        background-color: var(--lithium-blue-press);
    }
    .outer-link.button.circle {
        height: var(--size);
        width: var(--size);
        padding: 0;
        justify-content: center;
    }
    .outer-link.button.card {
        min-height: 0;
        width: 100%;
        text-align: left;
        border-radius: 14px;
        padding: 14px 18px;
        gap: var(--gap-3);
    }
    .outer-link.button:not(.card):not(.circle):has(::slotted(svg)),
    .outer-link.button:not(.card):not(.circle):has(::slotted(lit-icon)) {
        padding-inline-start: 14px;
    }
    @media (hover: hover) {
        .outer-link.button:hover {
            background-color: var(--lithium-elevated-10);
        }
        .outer-link.button.transparent:hover {
            background-color: var(--lithium-elevated-7);
        }
        .outer-link.button.primary:hover {
            background-color: var(--lithium-blue-hover);
        }
    }
    .outer-link.button ::slotted(svg),
    .outer-link.button ::slotted(lit-icon) {
        flex: 0 0 auto;
        height: 18px;
        width: 18px;
        stroke-width: 1.8px;
    }
`;

const VARIANTS = ["button", "primary", "transparent", "card", "circle"] as const;

export class LitOuterLink extends LithiumElement {
    static tag = "lit-outer-link";
    static styles = styles;
    static get observedAttributes() {
        return ["href", "target", "rel", ...VARIANTS];
    }

    private anchor!: HTMLAnchorElement;

    protected render(): string {
        return `<a class="outer-link" part="link"><slot></slot></a>`;
    }

    protected afterRender(): void {
        this.anchor = this.root.querySelector("a")!;
    }

    protected update(): void {
        for (const v of VARIANTS) this.anchor.classList.toggle(v, this.bool(v));

        const href = this.getAttribute("href") ?? "";
        this.anchor.setAttribute("href", href);

        // Default target to _blank for non-fragment links when not explicitly set.
        const targetAttr = this.getAttribute("target");
        const target = targetAttr ?? (href.startsWith("#") ? null : "_blank");
        if (target) {
            this.anchor.setAttribute("target", target);
        } else {
            this.anchor.removeAttribute("target");
        }

        // Default rel to include noopener (noreferrer) when a target is set and rel not given.
        const relAttr = this.getAttribute("rel");
        const rel = relAttr ?? (target ? "noopener noreferrer" : null);
        if (rel) {
            this.anchor.setAttribute("rel", rel);
        } else {
            this.anchor.removeAttribute("rel");
        }
    }
}
LitOuterLink.register();
