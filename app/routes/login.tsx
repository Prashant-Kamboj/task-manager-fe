import { Form, Link, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/login';
import { signIn } from '../lib/api';
import { saveSession } from '../lib/session';

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Email and password are required.' };
  try { const session = await signIn(email, password); saveSession(session); const returnTo = new URL(request.url).searchParams.get('returnTo'); return redirect(returnTo?.startsWith('/') ? returnTo : '/workspaces'); }
  catch (error) { return { error: error instanceof Error ? error.message : 'Unable to sign in.' }; }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return <main className="page-shell narrow"><Link className="back-link" to="/">← Home</Link><p className="eyebrow">Welcome back</p><h1>Sign in</h1><p className="lede">Use your Task Manager account to access your workspaces.</p><Form method="post" className="card form-stack"><label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Password<input type="password" name="password" autoComplete="current-password" required /></label>{actionData?.error ? <p className="error-text" role="alert">{actionData.error}</p> : null}<button className="button primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button></Form><p className="form-footer">Need an account? <Link to="/signup">Create one</Link></p></main>;
}
