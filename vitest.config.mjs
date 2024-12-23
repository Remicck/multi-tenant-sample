// vitest.config.mjs
/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    include: ["./src/**/*.test.{ts,tsx}"],
    globalSetup: "./vitest.setup.ts",
  },
  resolve: {
    alias: {
      "@": `${__dirname}/src`,
    },
  },
});
