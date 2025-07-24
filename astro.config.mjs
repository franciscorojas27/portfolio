// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  env:{
    schema:{
      EMAIL: envField.string({context:'client',access:'public'}),
      LINKEDIN_LINK: envField.string({context:'client',access:'public'}),
      GITHUB_LINK: envField.string({context:'client',access:'public'}),
    }
  },
});