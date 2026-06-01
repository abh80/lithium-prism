import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Ported from Dropdown.svelte, --helium-* renamed to --lithium-*.
// Upstream wrapped a native <select> styled as a dropdown trigger with a chevron
// (IconChevronDown). Native popups can't be styled cross-browser, so here the
// trigger is a button that toggles an open panel; options are projected via a
// `slot[name="option"]` and selection emits `change` { value }. The chevron SVG
// is inlined from icons/IconChevronDown.svelte.
const styles = css`
    :host {
        display: inline-block;
        width: fit-content;
        max-width: 100%;
    }
    .dropdown {
        --dropdown-padding-inline: 16px;
        --dropdown-icon-size: 18px;
        position: relative;
        width: fit-content;
        max-width: 100%;
        min-height: 40px;
        cursor: pointer;
    }
    .dropdown-trigger {
        cursor: inherit;
        font-size: 16px;
        line-height: 122%;
        min-height: 40px;
        width: 100%;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: var(--primary);
        background-color: var(--lithium-elevated-7);
        border: none;
        border-radius: 12px;
        font-family: inherit;
        text-align: left;
        padding-inline: var(--dropdown-padding-inline);
        padding-right: calc(var(--dropdown-padding-inline) + var(--dropdown-icon-size) + 9px);
        user-select: none;
        -webkit-user-select: none;
    }
    .dropdown-trigger .dropdown-label {
        flex: 1 1 auto;
    }
    .dropdown-trigger.placeholder .dropdown-label {
        color: var(--tertiary);
    }
    .dropdown.disabled .dropdown-trigger {
        pointer-events: none;
        color: var(--tertiary);
        background-color: var(--lithium-elevated-5);
    }
    .dropdown-icon {
        position: absolute;
        right: var(--dropdown-padding-inline);
        top: 0;
        bottom: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--tertiary);
        pointer-events: none;
        transition:
            transform 0.15s,
            color 0.15s;
    }
    .dropdown:focus-within .dropdown-icon {
        color: var(--primary);
    }
    .dropdown.open .dropdown-icon {
        transform: rotate(180deg);
    }
    .dropdown-icon svg {
        width: var(--dropdown-icon-size);
        height: var(--dropdown-icon-size);
        stroke-width: 1.8px;
    }
    .dropdown-panel {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        min-width: 100%;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 6px;
        background-color: var(--tooltip-bg);
        outline: 1.5px solid var(--lithium-elevated-10);
        outline-offset: -1.5px;
        border-radius: 12px;
        box-shadow: 4px 4px 10px 0 var(--tooltip-shadow);
        pointer-events: none;
        opacity: 0;
        transform: scale(0.96);
        transform-origin: top left;
        transition:
            transform 0.15s,
            opacity 0.15s;
    }
    .dropdown-panel.open {
        pointer-events: auto;
        opacity: 1;
        transform: none;
    }
    ::slotted([slot="option"]) {
        display: block;
        padding: 9px 12px;
        border-radius: 8px;
        font: inherit;
        font-size: 15px;
        color: var(--primary);
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
    }
    @media (hover: hover) {
        ::slotted([slot="option"]:hover) {
            background-color: var(--lithium-elevated-7);
        }
    }
`;

const CHEVRON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6l6 -6" /></svg>`;

export class LitDropdown extends LithiumElement {
    static tag = "lit-dropdown";
    static styles = styles;
    static get observedAttributes() {
        return ["open", "value", "disabled", "placeholder", "aria-label", "width"];
    }

    private trigger!: HTMLButtonElement;
    private panel!: HTMLDivElement;
    private label!: HTMLSpanElement;
    private dropdown!: HTMLDivElement;
    private onDocumentClick = (event: MouseEvent) => {
        if (!this.bool("open")) return;
        // composedPath lets us ignore clicks that originated inside this element
        // (including shadow DOM and slotted light-DOM options).
        if (event.composedPath().includes(this)) return;
        this.setBool("open", false);
    };

    get open() {
        return this.bool("open");
    }
    set open(v: boolean) {
        this.setBool("open", v);
    }

    get value() {
        return this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        this.setAttribute("value", v);
    }

    protected render(): string {
        return `
            <div class="dropdown" part="dropdown">
                <button class="dropdown-trigger" part="trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
                    <span class="dropdown-label" part="label"></span>
                    <span class="dropdown-icon" aria-hidden="true">${CHEVRON}</span>
                </button>
                <div class="dropdown-panel" part="panel" role="listbox">
                    <slot name="option"></slot>
                </div>
            </div>`;
    }

    protected afterRender(): void {
        this.dropdown = this.root.querySelector(".dropdown")!;
        this.trigger = this.root.querySelector(".dropdown-trigger")!;
        this.panel = this.root.querySelector(".dropdown-panel")!;
        this.label = this.root.querySelector(".dropdown-label")!;

        this.trigger.addEventListener("click", () => {
            if (this.bool("disabled")) return;
            this.setBool("open", !this.bool("open"));
        });

        // Slotted options are light-DOM children; a delegated click on the host
        // catches selection of any option carrying a data-value (the click on a
        // slotted child bubbles through the light DOM to the host, not into the
        // shadow panel).
        this.addEventListener("click", (event) => {
            const option = (event.target as HTMLElement)?.closest(
                "[data-value]",
            ) as HTMLElement | null;
            if (!option || !this.contains(option)) return;
            if (option.hasAttribute("disabled") || option.getAttribute("aria-disabled") === "true")
                return;
            const value = option.getAttribute("data-value") ?? "";
            this.value = value;
            this.emit("change", { value });
            this.setBool("open", false);
        });
    }

    connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener("click", this.onDocumentClick);
    }

    disconnectedCallback(): void {
        document.removeEventListener("click", this.onDocumentClick);
    }

    protected update(): void {
        const open = this.bool("open");
        const disabled = this.bool("disabled");

        this.dropdown.classList.toggle("open", open);
        this.dropdown.classList.toggle("disabled", disabled);
        this.panel.classList.toggle("open", open);
        this.trigger.setAttribute("aria-expanded", String(open));
        this.trigger.disabled = disabled;

        const ariaLabel = this.getAttribute("aria-label");
        if (ariaLabel) this.trigger.setAttribute("aria-label", ariaLabel);
        else this.trigger.removeAttribute("aria-label");

        const width = this.getAttribute("width");
        this.dropdown.style.width = width ?? "";

        const value = this.getAttribute("value");
        const placeholder = this.getAttribute("placeholder") ?? "";
        if (value) {
            this.label.textContent = this.labelForValue(value) ?? value;
            this.trigger.classList.remove("placeholder");
        } else {
            this.label.textContent = placeholder;
            this.trigger.classList.toggle("placeholder", placeholder.length > 0);
        }
    }

    private labelForValue(value: string): string | null {
        const option = this.querySelector(`[data-value="${CSS.escape(value)}"]`);
        return option?.textContent?.trim() ?? null;
    }
}
LitDropdown.register();
