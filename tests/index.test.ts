import { describe, it, expect } from "vitest";
import "../src/index";

const TAGS = [
    "lit-button",
    "lit-toggle",
    "lit-checkbox",
    "lit-input",
    "lit-text",
    "lit-spinner",
    "lit-skeleton",
    "lit-gradient-shimmer",
    "lit-search-bar",
    "lit-card-link",
    "lit-outer-link",
    "lit-tooltip",
    "lit-dropdown",
    "lit-copy-icon",
    "lit-icon",
    "lit-helium-logo",
    "lit-helium-text",
];

describe("index barrel", () => {
    it("registers every element", () => {
        for (const t of TAGS) expect(customElements.get(t)).toBeTypeOf("function");
    });
});
