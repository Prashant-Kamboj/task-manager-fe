import { Form, Link, redirect, useNavigation } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/index";
import { createWorkspace } from "../../../lib/api";
import "./style.css";

type Invite = { email: string; role: "admin" | "member" };

export async function clientLoader() {
  const { getSession } = await import("../../../lib/session");
  if (!getSession()) throw redirect("/login");
  return null;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Workspace name is required." };
  try {
    await createWorkspace(name);
    return redirect("/workspaces");
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to create workspace.",
    };
  }
}

export default function NewWorkspace({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Invite["role"]>("member");
  const [invites, setInvites] = useState<Invite[]>([]);
  const isSubmitting = navigation.state === "submitting";

  function addInvite() {
    const value = email.trim();
    if (!value) return;
    setInvites((current) => [...current, { email: value, role }]);
    setEmail("");
  }

  return (
    <main className="new-workspace-page">
      <header className="new-workspace-header">
        <Link className="new-workspace-brand" to="/" aria-label="Taskly home">
          <span className="logo-mark">
            <i />
            <i />
            <i />
          </span>
          Taskly
        </Link>
        <div className="new-workspace-header-actions">
          <button
            className="new-workspace-theme-toggle"
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
          <span className="new-workspace-avatar">PR</span>
        </div>
      </header>
      <Form method="post" className="new-workspace-card">
        <div className="new-workspace-intro">
          <h1>Create a workspace</h1>
          <p>A workspace holds projects and the people who work on them.</p>
        </div>
        <label>
          Workspace name
          <input name="name" placeholder="Acme Studio" autoFocus required />
        </label>
        <div className="invite-section">
          <label htmlFor="invite-email">Add members</label>
          <div className="invite-row">
            <input
              id="invite-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              type="email"
            />
            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value as Invite["role"])
              }
              aria-label="Member role"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="new-workspace-secondary"
              type="button"
              onClick={addInvite}
            >
              Add
            </button>
          </div>
        </div>
        {invites.length > 0 ? (
          <div className="invite-list">
            {invites.map((invite, index) => (
              <div className="invite-item" key={`${invite.email}-${index}`}>
                <span
                  className={`new-workspace-avatar invite-avatar invite-avatar-${index % 3}`}
                >
                  {invite.email.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <strong>{invite.email}</strong>
                  <p>{invite.email}</p>
                </div>
                <span className="invite-role">
                  {invite.role === "admin" ? "Admin" : "Member"}
                </span>
                <button
                  className="new-workspace-secondary"
                  type="button"
                  onClick={() =>
                    setInvites((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
        {actionData?.error ? (
          <p className="error-text" role="alert">
            {actionData.error}
          </p>
        ) : null}
        <div className="new-workspace-actions">
          <Link className="new-workspace-secondary" to="/workspaces">
            Cancel
          </Link>
          <button
            className="new-workspace-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating…" : "Create workspace"}
          </button>
        </div>
      </Form>
    </main>
  );
}
