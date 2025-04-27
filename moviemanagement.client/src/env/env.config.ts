export const ENV = {
  CLOUDINARY_CLOUD_NAME: (import.meta.env.VITE_CLOUND_NAME as string),
  API_URL: (import.meta.env.VITE_API_URL as string),
  RECAPTCHA_V2_SITE_KEY: (import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY as string),
} as const;
