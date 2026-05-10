export function buildAbsoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
  return new URL(path, baseUrl).toString();
}
