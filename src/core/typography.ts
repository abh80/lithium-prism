// Global element typography from the original styles.css. These rules style bare
// h1–h6/p/a tags, which the Helium app applied document-wide. Inside a shadow root
// only inherited properties (font-family, color, line-height) cross the boundary —
// per-tag font sizes do not — so components that render heading/paragraph tags must
// adopt these rules themselves. Interpolate into a component's css`` sheet.
export const TYPOGRAPHY_CSS = `
    h1, h2, h3, h4, h5, h6 {
        font-weight: 500;
        margin-block: 0;
        margin-inline: 0;
        line-height: 120%;
    }
    h1, h2 {
        letter-spacing: -2%;
        line-height: 110%;
    }
    h1 { font-size: 43px; }
    h2 { font-size: 36px; }
    h3 { font-size: 24px; }
    h4 { font-size: 17px; }
    h5 { font-size: 14px; }
    h6 { font-size: 12px; }
    p, a, li {
        margin: 0;
        font-size: 16px;
        line-height: 122%;
        color: var(--secondary);
    }
    a {
        color: inherit;
        text-underline-offset: 4px;
    }
`;
