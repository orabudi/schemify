import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Root base path ("/"). Monaco runs fully offline via native `?worker`
// imports wired up in `src/monaco-setup.ts` (no CDN).
export default defineConfig({
  base: "/",
  plugins: [react()],
});
