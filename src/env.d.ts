/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly EMAIL: string;
  readonly GITHUB_LINK: string;
  readonly LINKEDIN_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
