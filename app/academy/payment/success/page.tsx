import type { CSSProperties } from 'react';
import { AcademyShell, Eyebrow, PrimaryButton, SecondaryButton, academyTheme } from '../../AcademyChrome';

export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  return (
    <AcademyShell current="payment">
      <main style={styles.page}>
        <section style={styles.card}>
          <Eyebrow>Paiement confirmé</Eyebrow>
          <h1 style={styles.title}>Votre achat est validé.</h1>
          <p style={styles.text}>L’inscription à la formation est préparée dès confirmation du fournisseur de paiement. Vous pouvez maintenant retourner à votre espace étudiant et poursuivre votre parcours Academy.</p>
          <div style={styles.actions}>
            <PrimaryButton href="/academy/dashboard">Aller à mon espace étudiant</PrimaryButton>
            <SecondaryButton href="/academy/courses">Voir les formations</SecondaryButton>
          </div>
        </section>
      </main>
    </AcademyShell>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 900, margin: '0 auto', padding: '82px 20px 10px' },
  card: { background: 'rgba(255,255,255,.9)', border: `1px solid ${academyTheme.border}`, borderRadius: 28, padding: 'clamp(26px, 6vw, 52px)', boxShadow: academyTheme.shadow },
  title: { margin: '0 0 16px', fontSize: 'clamp(2.3rem, 6vw, 4.5rem)', lineHeight: .96, letterSpacing: '-.055em', color: academyTheme.ink },
  text: { color: academyTheme.muted, lineHeight: 1.7, fontSize: '1.08rem', maxWidth: 680 },
  actions: { display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 28 },
};
