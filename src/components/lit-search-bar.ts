import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Ported from SearchBar.svelte, which composes Input.svelte + IconSearch.svelte.
// To keep components independent for the parallel wave, the input field is
// replicated here with a native <input> and an inlined search SVG rather than
// depending on lit-input. The base .input-field layout is copied from
// src/css/styles.css and the field-specific rules from Input.svelte's <style>,
// with --helium-* renamed to --lithium-* and the search-bar wrapper rules from
// SearchBar.svelte's own <style>.
const styles = css`
    :host {
        display: inline-flex;
        width: 100%;
    }

    .search-bar {
        width: 100%;
    }

    .input-field {
        --input-font-size: 16px;
        --input-icon-size: 18px;
        --input-line-height: 122%;
        --input-padding: 13px 16px;

        color: var(--primary);
        border-radius: 12px;
        align-items: center;
        transition:
            0.2s background-color,
            0.1s outline-color,
            0.1s box-shadow;
        background-color: var(--lithium-elevated-7);
        display: inline-flex;
        gap: 9px;
        width: 100%;
        cursor: text;
        padding: var(--input-padding);
        min-height: 46px;
    }
    .input-field:focus-within {
        background-color: var(--lithium-elevated-10);
        outline: 2px var(--primary) solid;
        outline-offset: -1px;
    }
    @media (hover: hover) {
        .input-field:hover {
            background-color: var(--lithium-elevated-10);
        }
    }
    .input-field input {
        appearance: none;
        min-width: 0;
        width: 100%;
        color: inherit;
        background: none;
        border: none;
        outline: none;
        font: inherit;
        font-weight: 500;
        letter-spacing: inherit;
        font-size: var(--input-font-size);
        line-height: var(--input-line-height);
        padding: 0;
    }
    .input-field input::placeholder {
        color: var(--tertiary);
        font-weight: 500;
        user-select: none;
        -webkit-user-select: none;
    }
    .search-bar input[type="search"]::-webkit-search-decoration,
    .search-bar input[type="search"]::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    .input-accessory {
        color: var(--tertiary);
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }
    .input-field:focus-within .input-accessory {
        color: var(--primary);
    }
    .input-accessory svg {
        width: var(--input-icon-size);
        height: var(--input-icon-size);
        stroke-width: 1.8px;
    }
`;

// Inlined from src/lib/components/icons/IconSearch.svelte.
const searchIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
    </svg>`;

export class LitSearchBar extends LithiumElement {
    static tag = "lit-search-bar";
    static styles = styles;
    static get observedAttributes() {
        return ["value", "placeholder"];
    }

    private inputEl!: HTMLInputElement;

    get value(): string {
        return this.inputEl?.value ?? this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        this.setAttribute("value", v);
    }

    protected render(): string {
        return `<div class="search-bar" role="search"><label class="input-field" part="field"><span class="input-accessory" aria-hidden="true">${searchIcon}</span><input type="search" part="input"/></label></div>`;
    }

    protected afterRender(): void {
        this.inputEl = this.root.querySelector("input")!;
        this.inputEl.addEventListener("input", () => {
            // Reflect to the value attribute; update() only writes back into the
            // input when the attribute value differs, so this avoids a caret reset.
            this.setAttribute("value", this.inputEl.value);
            this.emit("input", { value: this.inputEl.value });
        });
        this.inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.emit("search", { value: this.inputEl.value });
            }
        });
    }

    protected update(): void {
        const input = this.inputEl;

        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) input.placeholder = placeholder;
        else input.removeAttribute("placeholder");

        // Only write the attribute value into the input when it differs, so user
        // typing (which already updated input.value) does not reset the caret.
        const value = this.getAttribute("value") ?? "";
        if (input.value !== value) input.value = value;
    }
}
LitSearchBar.register();
