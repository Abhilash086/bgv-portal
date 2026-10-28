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

  /**
   * When true, pages render local `data/` fallback data instead of the error
   * page when a query fails (e.g. the backend isn't running yet). The error
   * pages stay in the code and resurface automatically once this is turned
   * off. Set `VITE_USE_MOCK_FALLBACK=false` to see real error states.
   */
  useMockFallback:
    (import.meta.env.VITE_USE_MOCK_FALLBACK?.trim() ?? "true") !== "false",
} as const;
