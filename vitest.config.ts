import { getViteConfig } from "astro/config";
import { defineConfig } from "vitest/config";

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
    },
  }),
);
