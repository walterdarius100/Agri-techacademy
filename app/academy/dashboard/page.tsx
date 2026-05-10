import { ProtectedAcademyPage } from '../auth/AuthClient';

export const dynamic = 'force-dynamic';

export default function AcademyDashboardPage() {
  return (
    <ProtectedAcademyPage publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} title="Dashboard Academy">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
        <article style={{ background: '#f3f8ef', borderRadius: 18, padding: 18 }}>
          <strong>Formations actives</strong>
          <p>Suivez vos parcours et reprenez votre progression.</p>
        </article>
        <article style={{ background: '#fff7e8', borderRadius: 18, padding: 18 }}>
          <strong>Paiement</strong>
          <p>Les achats validés ouvriront automatiquement l’accès étudiant.</p>
        </article>
      </div>
    </ProtectedAcademyPage>
  );
}
