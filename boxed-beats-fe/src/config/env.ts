export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Boxed Beats',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
