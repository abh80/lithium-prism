declare global {
    interface HTMLElementTagNameMap {
        "lit-button": import("./components/lit-button").LitButton;
        "lit-toggle": import("./components/lit-toggle").LitToggle;
        "lit-checkbox": import("./components/lit-checkbox").LitCheckbox;
        "lit-input": import("./components/lit-input").LitInput;
        "lit-text": import("./components/lit-text").LitText;
        "lit-spinner": import("./components/lit-spinner").LitSpinner;
        "lit-skeleton": import("./components/lit-skeleton").LitSkeleton;
        "lit-gradient-shimmer": import("./components/lit-gradient-shimmer").LitGradientShimmer;
        "lit-card-link": import("./components/lit-card-link").LitCardLink;
        "lit-outer-link": import("./components/lit-outer-link").LitOuterLink;
        "lit-search-bar": import("./components/lit-search-bar").LitSearchBar;
        "lit-tooltip": import("./components/lit-tooltip").LitTooltip;
        "lit-dropdown": import("./components/lit-dropdown").LitDropdown;
        "lit-copy-icon": import("./components/lit-copy-icon").LitCopyIcon;
        "lit-icon": import("./components/lit-icon").LitIcon;
        "lit-helium-logo": import("./components/lit-helium-logo").LitHeliumLogo;
        "lit-helium-text": import("./components/lit-helium-text").LitHeliumText;
    }
}

export {};
