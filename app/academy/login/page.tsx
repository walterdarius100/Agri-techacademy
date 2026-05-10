import { AuthForm } from '../auth/AuthClient';

export const dynamic = 'force-dynamic';

export default function AcademyLoginPage() {
  return <AuthForm mode="login" publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} />;
}
