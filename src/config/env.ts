function getRequiredEnv(value: string | undefined, name: string): string {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return trimmedValue;
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || "BGV Platform",

  apiBaseUrl: getRequiredEnv(
    import.meta.env.VITE_API_BASE_URL,
    "VITE_API_BASE_URL",
  ),

  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
