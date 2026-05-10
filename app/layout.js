export const metadata = {
  title: 'Agri-Tech Academy',
  description: 'Plateforme e-learning agricole Agri-Tech Academy.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#0f3d2e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/academy/academy.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
