export const ENV = {
  CLOUDINARY_CLOUD_NAME:
    (import.meta.env.VITE_CLOUND_NAME as string) ?? "Not found",
} as const;
