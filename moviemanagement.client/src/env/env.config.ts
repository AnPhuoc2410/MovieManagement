export const ENV = {
  CLOUDINARY_CLOUD_NAME: (import.meta.env.VITE_CLOUND_NAME as string) ?? "Not found",
  API_URL: (import.meta.env.VITE_API_URL as string) ?? "https://localhost:7119/api",
  RECAPTCHA_V2_SITE_KEY: (import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY as string) ?? "Not found",
} as const;
