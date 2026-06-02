/// <reference types="vite/client" />
import { defineConfig } from "vite";

// App-mode build of the demo gallery (index.html) into ./demo-dist for Cloudflare
// Workers static-asset deploys. The main vite.config.ts is library mode and does
// not bundle the demo site, so the demo gets its own config.
export default defineConfig({
    build: {
        outDir: "demo-dist",
        emptyOutDir: true,
    },
});
