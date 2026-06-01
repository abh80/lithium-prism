import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Rules copied from src/css/styles.css (global `.button` + `.card` rules reused by
// CardLink.svelte) plus the component's own `.card-link`/`.link-text` styles, with
// --helium-* renamed to --lithium-* and descendant `svg` selectors -> `::slotted(svg)`.
const styles = css`
    :host {
        display: block;
        width: 100%;
    }
    .button {
        --size: 38px;
        color: var(--primary);
        background-color: transparent;
        font-size: 16px;
        min-height: 38px;
        padding: 9px 16px;
        border-radius: calc(var(--size) / 2);
        transition:
            0.2s background-color,
            0.2s transform,
            0.2s opacity;
        will-change: transform;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }
    .button:not(.transparent) {
        background-color: var(--lithium-elevated-7);
    }
    .button:active {
        background-color: var(--lithium-elevated-15);
        transform: scale(0.97);
    }
    .button.card {
        min-height: 0;
        width: 100%;
        text-align: left;
        border-radius: 14px;
        padding: 14px 18px;
        gap: var(--gap-3);
    }
    .button.card:active {
        transform: none;
    }
    .button.card ::slotted(svg) {
        width: 21px;
        height: 21px;
    }
    .button svg {
        flex: 0 0 auto;
        height: 18px;
        width: 18px;
        stroke-width: 1.8px;
    }
    .button.card svg {
        width: 21px;
        height: 21px;
    }
    @media (hover: hover) {
        .button:hover {
            background-color: var(--lithium-elevated-10);
        }
        .button:hover:active {
            background-color: var(--lithium-elevated-15);
        }
    }
    .button:focus-visible {
        outline: 2px var(--primary) solid;
        outline-offset: 3px;
    }

    /* CardLink.svelte own styles */
    .card-link {
        text-decoration: none;
        align-items: flex-start;
    }
    .link-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        overflow: hidden;
    }
`;

// Inlined from src/lib/components/icons/IconExternalLink.svelte.
const EXTERNAL_LINK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg>`;

export class LitCardLink extends LithiumElement {
    static tag = "lit-card-link";
    static styles = styles;
    static get observedAttributes() {
        return ["href", "target", "rel"];
    }

    private anchor!: HTMLAnchorElement;

    get href() {
        return this.getAttribute("href") ?? "";
    }
    set href(v: string) {
        this.setAttribute("href", v);
    }

    protected render(): string {
        return `<a class="button card card-link" part="link"><slot></slot>${EXTERNAL_LINK_ICON}</a>`;
    }

    protected afterRender(): void {
        this.anchor = this.root.querySelector("a")!;
    }

    protected update(): void {
        const href = this.getAttribute("href");
        if (href === null) this.anchor.removeAttribute("href");
        else this.anchor.setAttribute("href", href);
        this.anchor.target = this.getAttribute("target") ?? "_blank";
        this.anchor.rel = this.getAttribute("rel") ?? "noopener noreferrer";
    }
}
LitCardLink.register();
