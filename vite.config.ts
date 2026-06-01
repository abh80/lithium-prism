/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { copyFileSync } from "node:fs";

// Vite (lib mode) only bundles JS entries; the light-DOM token sheet must be
// copied verbatim into dist so `./lithium.css` export resolves.
function copyThemeCss() {
    return {
        name: "copy-theme-css",
        closeBundle() {
            copyFileSync(
                resolve(__dirname, "src/theme/lithium.css"),
                resolve(__dirname, "dist/lithium.css"),
            );
        },
    };
}

export default defineConfig({
    plugins: [copyThemeCss()],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es"],
            fileName: "index",
        },
        rollupOptions: {
            // each component is also an independent entry for tree-shakeable `./element/*` imports
            input: {
                index: resolve(__dirname, "src/index.ts"),
            },
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
    },
    test: {
        environment: "happy-dom",
        globals: true,
        include: ["tests/**/*.test.ts"],
    },
});
