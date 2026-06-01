import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Ported from Spinner.svelte <style>: `:global(svg)` -> `svg`, --helium-* -> --lithium-*
// (none present), keep @keyframes spinner + reduced-motion media query.
const styles = css`
    .spinner {
        display: flex;
    }

    .spinner svg {
        width: var(--size);
        height: var(--size);
        color: inherit;
        animation: spinner 1s infinite linear;
        will-change: transform;
    }

    @media (prefers-reduced-motion: reduce) {
        .spinner svg {
            animation: none;
        }
    }

    @keyframes spinner {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

export class LitSpinner extends LithiumElement {
    static tag = "lit-spinner";
    static styles = styles;
    static get observedAttributes() {
        return ["size"];
    }

    protected render(): string {
        // Inlined IconLoader.svelte markup.
        return `<div class="spinner" part="spinner"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9" /></svg></div>`;
    }

    protected update(): void {
        const spinner = this.root.querySelector(".spinner") as HTMLElement;
        spinner.style.setProperty("--size", (this.getAttribute("size") ?? "24") + "px");
    }
}
LitSpinner.register();
