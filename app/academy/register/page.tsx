import { AuthForm } from '../auth/AuthClient';

export const dynamic = 'force-dynamic';

export default function AcademyRegisterPage() {
  return <AuthForm mode="register" publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} />;
}
