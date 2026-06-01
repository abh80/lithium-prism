import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**", "docs/**", "*.config.js"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: { project: "./tsconfig.json" },
        },
    },
    {
        files: ["tests/**/*.ts"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    // Prettier last: turn off rules that conflict with formatting.
    prettier,
);
