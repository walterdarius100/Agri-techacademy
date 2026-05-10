import type { ReactNode } from 'react';

export const metadata = {
  title: 'Agri-Tech Academy',
  description: 'Formations agricoles pratiques et numériques.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
