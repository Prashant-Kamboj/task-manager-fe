import { Form, Link, useNavigation } from "react-router";
import type { Route } from "./+types/index";
import { requestPasswordReset } from "../../lib/api";
import "./style.css";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Email is required." };

  try {
    await requestPasswordReset(email);
    return { success: "If an account exists for that email, we sent a reset link." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to send reset link.",
    };
  }
}

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="forgot-password-page">
      <Link className="forgot-brand" to="/" aria-label="Taskly home">
        <span className="logo-mark"><i /><i /><i /></span>Taskly
      </Link>
      <button className="forgot-theme-toggle" type="button" aria-label="Switch to night mode">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
      </button>
      <section className="forgot-card">
        <Link className="forgot-back" to="/login">‹ <span>Back to log in</span></Link>
        <div className="forgot-intro">
          <span className="forgot-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3M14 9l2 2" /></svg></span>
          <h1>Forgot your password?</h1>
          <p>Enter your email and we will send you a link to reset it.</p>
        </div>
        <Form method="post" className="forgot-form">
          <label>Email<input type="email" name="email" autoComplete="email" placeholder="you@company.com" required /></label>
          {actionData?.error ? <p className="error-text" role="alert">{actionData.error}</p> : null}
          {actionData?.success ? <p className="success-text" role="status">{actionData.success}</p> : null}
          <button className="forgot-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send reset link"}</button>
        </Form>
      </section>
      <p className="forgot-login">Remember it? <Link to="/login">Log in</Link></p>
    </main>
  );
}
