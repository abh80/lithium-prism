import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Inlined from icons/IconCopy.svelte, icons/IconLink.svelte, icons/IconCheck.svelte.
const SVG_ATTRS =
    'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

const ICON_COPY = `<svg ${SVG_ATTRS}><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>`;

const ICON_LINK = `<svg ${SVG_ATTRS}><path d="M9 15l6 -6" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" /><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" /></svg>`;

const ICON_CHECK = `<svg ${SVG_ATTRS}><path d="M5 12l5 5l10 -10" /></svg>`;

// Ported from CopyIcon.svelte <style>, --helium-* renamed to --lithium-*.
const styles = css`
    :host {
        display: inline-flex;
    }
    .copy-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--primary);
        cursor: pointer;
        font-family: inherit;
        -webkit-tap-highlight-color: transparent;
    }
    .copy-button:focus-visible {
        outline: 2px var(--primary) solid;
        outline-offset: 3px;
    }
    .copy-animation {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 18px;
        width: 18px;
    }
    .copy-animation svg {
        width: 18px;
        height: 18px;
        will-change: transform;
    }
    .icon-copy,
    .icon-check {
        display: flex;
        position: absolute;
        transition:
            transform 0.25s,
            opacity 0.25s;
    }
    .icon-copy {
        transform: none;
        opacity: 1;
    }
    .icon-check {
        transform: scale(0.4);
        opacity: 0;
    }
    .check .icon-copy {
        transform: scale(0.4);
        opacity: 0;
    }
    .check .icon-check {
        transform: none;
        opacity: 1;
    }
`;

const CHECK_DURATION = 1500;

export class LitCopyIcon extends LithiumElement {
    static tag = "lit-copy-icon";
    static styles = styles;
    static get observedAttributes() {
        return ["value", "link"];
    }

    private btn!: HTMLButtonElement;
    private anim!: HTMLDivElement;
    private timer: ReturnType<typeof setTimeout> | undefined;

    get value() {
        return this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        this.setAttribute("value", v);
    }

    protected render(): string {
        return `
            <button class="copy-button" type="button" part="button" aria-label="Copy">
                <span class="copy-animation" part="animation">
                    <span class="icon-copy">${this.bool("link") ? ICON_LINK : ICON_COPY}</span>
                    <span class="icon-check">${ICON_CHECK}</span>
                </span>
            </button>`;
    }

    protected afterRender(): void {
        this.btn = this.root.querySelector("button")!;
        this.anim = this.root.querySelector(".copy-animation")!;
        this.btn.addEventListener("click", () => {
            void this.copy();
        });
    }

    private async copy(): Promise<void> {
        const value = this.value;
        await navigator.clipboard.writeText(value);
        this.emit("copy", { value });
        this.anim.classList.add("check");
        if (this.timer !== undefined) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.anim.classList.remove("check");
            this.timer = undefined;
        }, CHECK_DURATION);
    }

    protected update(): void {
        const copyIcon = this.root.querySelector(".icon-copy");
        if (copyIcon) copyIcon.innerHTML = this.bool("link") ? ICON_LINK : ICON_COPY;
    }

    disconnectedCallback(): void {
        if (this.timer !== undefined) clearTimeout(this.timer);
    }
}
LitCopyIcon.register();
