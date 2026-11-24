import { Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/index";
import { signIn } from "../../lib/api.server";
import { createAuthCookie } from "../../lib/session.server";
import { getAuthSession } from "../../lib/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  if (await getAuthSession(request)) throw redirect("/workspaces");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };
  try {
    const session = await signIn(request, email, password);
    const returnTo = new URL(request.url).searchParams.get("returnTo");
    return redirect(returnTo?.startsWith("/") ? returnTo : "/workspaces", {
      headers: { "Set-Cookie": await createAuthCookie(session) },
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to sign in.",
    };
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  return (
    <main className="login-page">
      <Link className="login-brand" to="/" aria-label="Taskly home">
        <span className="logo-mark">
          <i />
          <i />
          <i />
        </span>
        Taskly
      </Link>
      <button
        className="login-theme-toggle"
        type="button"
        aria-label="Switch to night mode"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      </button>
      <section className="login-card">
        <div className="login-intro">
          <h1>Welcome back</h1>
          <p>Log in to your workspace.</p>
        </div>
        <Form method="post" className="login-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </label>
          <label>
            <span className="login-label-row">
              Password <Link to="/forgot-password">Forgot password?</Link>
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </label>
          <label className="login-remember">
            <input type="checkbox" name="rememberMe" defaultChecked />
            <span>Keep me logged in</span>
          </label>
          {actionData?.error ? (
            <p className="error-text" role="alert">
              {actionData.error}
            </p>
          ) : null}
          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </Form>
        <div className="login-divider">
          <span />
          or
          <span />
        </div>
        <button className="login-google" type="button">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>
      </section>
      <p className="login-signup">
        New to Taskly? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}
import "./style.css";
