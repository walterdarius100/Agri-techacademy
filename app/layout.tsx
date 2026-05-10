import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agri-Tech Academy',
  description: 'Base Next.js minimale pour servir progressivement la plateforme Agri-Tech Academy.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
