import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

const styles = css`
    :host {
        display: inline-flex;
    }
`;

export class LitHeliumLogo extends LithiumElement {
    static tag = "lit-helium-logo";
    static styles = styles;
    static get observedAttributes() {
        return ["height"];
    }

    // Inlined from src/lib/components/logos/HeliumLogoRaw.svelte.
    protected render(): string {
        return `<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" part="icon"><path d="M152.62 237.85L128 256L103.38 237.85L114.568 151.248L45.05 204.22L17 192L20.425 161.635L101.128 128L20.425 94.365L17 64L45.05 51.78L114.568 104.752L103.38 18.15L128 0L152.62 18.15L141.432 104.752L210.95 51.78L239 64L235.575 94.365L154.872 128L235.575 161.635L239 192L210.95 204.22L141.432 151.248L152.62 237.85Z" fill="currentColor" /></svg>`;
    }

    protected update(): void {
        const svg = this.root.querySelector("svg")!;
        const height = this.getAttribute("height") ?? "24px";
        svg.style.height = height;
        svg.style.width = "auto";
    }
}
LitHeliumLogo.register();
