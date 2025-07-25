// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      EMAIL: envField.string({ context: "client", access: "public" }),
      DRIVE_CV: envField.string({ context: "client", access: "public" }),
      EMAIL_API: envField.string({context: 'server',access:'secret'}),
      LINKEDIN_LINK: envField.string({ context: "client", access: "public" }),
      GITHUB_LINK: envField.string({ context: "client", access: "public" }),
      GMAIL_PASS: envField.string({ context: "server", access: "secret" }),
      LIMIT_WINDOW_MS: envField.number({ context: "server", access: "public" }),
      MAX_REQUESTS_PER_WINDOW: envField.number({
        context: "server",
        access: "public",
      }),
    },
  },
});
