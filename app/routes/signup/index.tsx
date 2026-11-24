import { Form, Link, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/index';
import { signUp } from '../../lib/api.server';
import { createAuthCookie } from '../../lib/session.server';

export async function loader({ request }: Route.LoaderArgs) {
  const { getAuthSession } = await import('../../lib/session.server');
  if (await getAuthSession(request)) throw redirect('/workspaces');
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  if (!email || !password) return { error: 'Email and password are required.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirmPassword) return { error: 'Passwords do not match.' };
  try {
    const result = await signUp(request, email, password, fullName);
    if (result.session) { return redirect('/workspaces', { headers: { "Set-Cookie": await createAuthCookie(result.session) } }); }
    return { success: 'Account created. Check your email to confirm your account, then sign in.' };
  } catch (error) { return { error: error instanceof Error ? error.message : 'Unable to create your account.' }; }
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return <main className="signup-page">
    <Link className="signup-brand" to="/" aria-label="Taskly home"><span className="logo-mark"><i /><i /><i /></span>Taskly</Link>
    <button className="signup-theme-toggle" type="button" aria-label="Switch to night mode">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
    </button>
    <section className="signup-card">
      <div className="signup-intro"><h1>Create your account</h1><p>Start organising your work in a minute.</p></div>
      <Form method="post" className="signup-form">
        <label>Full name<input type="text" name="fullName" autoComplete="name" placeholder="Your name" /></label>
        <label>Work email<input type="email" name="email" autoComplete="email" placeholder="you@company.com" required /></label>
        <label>Password<input type="password" name="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required /></label>
        <label>Confirm password<input type="password" name="confirmPassword" autoComplete="new-password" placeholder="Confirm your password" minLength={8} required /></label>
        <label className="terms"><input type="checkbox" name="terms" defaultChecked required /><span>I agree to the Terms and Privacy Policy</span></label>
        {actionData?.error ? <p className="error-text" role="alert">{actionData.error}</p> : null}
        {actionData?.success ? <p className="success-text" role="status">{actionData.success}</p> : null}
        <button className="signup-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
      </Form>
      <div className="signup-divider"><span />or<span /></div>
      <button className="google-button" type="button"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>Continue with Google</button>
    </section>
    <p className="signup-login">Already have an account? <Link to="/login">Log in</Link></p>
  </main>;
}
import "./style.css";
