import { css } from "./sheet";

// Shadow roots don't inherit the document's global reset, so each component adopts this.
export const reset = css`
    :host {
        box-sizing: border-box;
    }
    *,
    *::before,
    *::after {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
    }
`;
