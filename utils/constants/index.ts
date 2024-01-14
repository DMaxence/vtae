export const APP_DOMAIN = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? `https://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : `http://app.localhost:${process.env.PORT || 3000}`;
