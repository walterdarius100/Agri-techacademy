import type { CSSProperties } from 'react';
import { AcademyShell, Eyebrow, PrimaryButton, SecondaryButton, academyTheme } from '../../AcademyChrome';

export default function PaymentCancelPage() {
  return (
    <AcademyShell current="payment">
      <main style={styles.page}>
        <section style={styles.card}>
          <Eyebrow>Paiement annulé</Eyebrow>
          <h1 style={styles.title}>Aucun paiement n’a été validé.</h1>
          <p style={styles.text}>Votre inscription payante n’est pas créée tant que le fournisseur ne confirme pas le paiement. Vous pouvez reprendre tranquillement depuis le catalogue Academy.</p>
          <div style={styles.actions}>
            <PrimaryButton href="/academy/courses">Retour aux formations</PrimaryButton>
            <SecondaryButton href="/academy">Retour Academy</SecondaryButton>
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
