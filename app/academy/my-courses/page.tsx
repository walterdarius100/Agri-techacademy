import { courses } from '../../../data/courses.js';
import { ProtectedAcademyPage } from '../auth/AuthClient';

export const dynamic = 'force-dynamic';

export default function AcademyMyCoursesPage() {
  return (
    <ProtectedAcademyPage publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} title="Mes formations">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
        {courses.slice(0, 2).map((course) => (
          <article key={course.slug} style={{ background: '#f3f8ef', borderRadius: 18, padding: 18 }}>
            <strong>{course.title}</strong>
            <p>{course.description}</p>
            <a href={`/academy/checkout/${course.slug}`} style={{ color: '#2f6b2f', fontWeight: 900 }}>Voir le checkout</a>
          </article>
        ))}
      </div>
    </ProtectedAcademyPage>
  );
}
