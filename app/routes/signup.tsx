import { Form, Link, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/signup';
import { signUp } from '../lib/api';
import { saveSession } from '../lib/session';

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  if (!email || !password) return { error: 'Email and password are required.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirmPassword) return { error: 'Passwords do not match.' };
  try {
    const result = await signUp(email, password, fullName);
    if (result.session) { saveSession(result.session); return redirect('/workspaces'); }
    return { success: 'Account created. Check your email to confirm your account, then sign in.' };
  } catch (error) { return { error: error instanceof Error ? error.message : 'Unable to create your account.' }; }
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return <main className="page-shell narrow"><Link className="back-link" to="/">← Home</Link><p className="eyebrow">Get started</p><h1>Create your account</h1><p className="lede">Set up your account and start organizing work with your team.</p><Form method="post" className="card form-stack"><label>Name<input type="text" name="fullName" autoComplete="name" /></label><label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Password<input type="password" name="password" autoComplete="new-password" minLength={8} required /></label><label>Confirm password<input type="password" name="confirmPassword" autoComplete="new-password" minLength={8} required /></label>{actionData?.error ? <p className="error-text" role="alert">{actionData.error}</p> : null}{actionData?.success ? <p className="success-text" role="status">{actionData.success}</p> : null}<button className="button primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button></Form><p className="form-footer">Already have an account? <Link to="/login">Sign in</Link></p></main>;
}
