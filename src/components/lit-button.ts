import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Rules copied from src/css/styles.css `.button { … }` block, with --helium-* renamed to --lithium-*.
const styles = css`
    :host {
        display: inline-block;
    }
    /* Card buttons span the full width of their container (like the original .card). */
    :host([card]) {
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
        border: none;
        font-family: inherit;
        cursor: pointer;
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
    .button.primary {
        color: var(--white);
        background-color: var(--lithium-blue);
    }
    .button.primary:active {
        background-color: var(--lithium-blue-press);
    }
    .button.circle {
        height: var(--size);
        width: var(--size);
        padding: 0;
        justify-content: center;
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
    .button.card ::slotted(svg),
    .button.card ::slotted(lit-icon) {
        width: 21px;
        height: 21px;
    }
    .button:not(.card):not(.circle):has(::slotted(svg)),
    .button:not(.card):not(.circle):has(::slotted(lit-icon)) {
        padding-inline-start: 14px;
    }
    .button:disabled {
        color: var(--tertiary);
        pointer-events: none;
    }
    .button:disabled:not(.transparent) {
        background-color: var(--lithium-elevated-5);
    }
    .button:disabled:not(.selected) {
        box-shadow: none;
    }
    .button.selected {
        box-shadow:
            0 0 0 1px var(--primary) inset,
            0 0 0 1px var(--primary);
    }
    .button ::slotted(svg),
    .button ::slotted(lit-icon) {
        flex: 0 0 auto;
        height: 18px;
        width: 18px;
        stroke-width: 1.8px;
    }
    @media (hover: hover) {
        .button:hover {
            background-color: var(--lithium-elevated-10);
        }
        .button:hover:active {
            background-color: var(--lithium-elevated-15);
        }
        .button.primary:hover {
            background-color: var(--lithium-blue-hover);
        }
        .button.primary:hover:active {
            background-color: var(--lithium-blue-press);
        }
    }
    .button:focus-visible {
        outline: 2px var(--primary) solid;
        outline-offset: 3px;
    }
`;

const FLAGS = ["primary", "transparent", "card", "selected", "circle"] as const;

export class LitButton extends LithiumElement {
    static tag = "lit-button";
    static styles = styles;
    static get observedAttributes() {
        return [...FLAGS, "disabled", "type"];
    }

    private btn!: HTMLButtonElement;

    get primary() {
        return this.bool("primary");
    }
    set primary(v: boolean) {
        this.setBool("primary", v);
    }

    protected render(): string {
        return `<button class="button" part="button"><slot></slot></button>`;
    }
    protected afterRender(): void {
        this.btn = this.root.querySelector("button")!;
    }
    protected update(): void {
        for (const f of FLAGS) this.btn.classList.toggle(f, this.bool(f));
        this.btn.disabled = this.bool("disabled");
        this.btn.type = (this.getAttribute("type") as "button" | "submit" | "reset") ?? "button";
    }
}
LitButton.register();
