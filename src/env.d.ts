/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly EMAIL: string;
  readonly GITHUB_LINK: string;
  readonly LINKEDIN_LINK: string;
  readonly MAX_REQUESTS_PER_WINDOW:number;
  readonly LIMIT_WINDOW_MS:number;
  readonly DRIVE_CV:string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}