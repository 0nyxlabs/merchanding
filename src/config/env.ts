export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  apiUrl: import.meta.env.VITE_API_URL as string,
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
  appUrl: import.meta.env.VITE_APP_URL as string,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
