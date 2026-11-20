import { Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/workspaces";
import {
  addWorkspaceMember,
  createWorkspace,
  deleteWorkspace,
  listWorkspaceMembers,
  listWorkspaces,
  removeWorkspaceMember,
  updateWorkspaceMember,
  type Workspace,
  type WorkspaceMember,
} from "../lib/api";
import { getSession } from "../lib/session";
import { DeleteWorkspaceModal } from "../components/delete-workspace-modal";

export async function clientLoader() {
  if (!getSession()) throw redirect("/login");
  const workspaces = await listWorkspaces();
  const workspacesWithMembers = await Promise.all(
    workspaces.map(async (workspace) => ({
      ...workspace,
      members: (await listWorkspaceMembers(workspace.id)) ?? [],
    }))
  );
  return { workspaces: workspacesWithMembers };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "create-workspace");
  try {
    if (intent === "create-workspace") {
      const name = String(formData.get("name") ?? "").trim();
      if (!name) return { error: "Workspace name is required." };
      await createWorkspace(name);
    } else if (intent === "add-member") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      const userId = String(formData.get("userId") ?? "").trim();
      const role = String(formData.get("role") ?? "member") as
        "admin" | "member";
      if (!workspaceId || !userId) return { error: "A user ID is required." };
      await addWorkspaceMember(workspaceId, userId, role);
    } else if (intent === "update-member") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      const memberId = String(formData.get("memberId") ?? "");
      const role = String(formData.get("role") ?? "member") as
        "admin" | "member";
      await updateWorkspaceMember(workspaceId, memberId, role);
    } else if (intent === "remove-member") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      const memberId = String(formData.get("memberId") ?? "");
      await removeWorkspaceMember(workspaceId, memberId);
    } else if (intent === "delete-workspace") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      if (!workspaceId) return { error: "A workspace ID is required." };
      await deleteWorkspace(workspaceId);
    }
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to create workspace.",
    };
  }
}

export function HydrateFallback() {
  return (
    <main className="page-shell">
      <p>Loading workspaces…</p>
    </main>
  );
}

export default function Workspaces({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <main className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task Manager</p>
          <h1>Workspaces</h1>
        </div>
        <div className="topbar-actions">
          <Link className="back-link" to="/">
            Home
          </Link>
          <Form method="post" action="/logout">
            <button className="button secondary" type="submit">
              Log out
            </button>
          </Form>
        </div>
      </div>
      <div className="workspace-grid">
        <section className="card">
          <p className="eyebrow">New workspace</p>
          <Form method="post" className="form-row">
            <input
              name="name"
              placeholder="e.g. Product team"
              aria-label="Workspace name"
              required
            />
            <button
              className="button primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create"}
            </button>
          </Form>
          {actionData?.error ? (
            <p className="error-text" role="alert">
              {actionData.error}
            </p>
          ) : null}
        </section>
        <section className="workspace-list">
          {loaderData.workspaces.length === 0 ? (
            <div className="card empty-state">
              No workspaces yet. Create your first one above.
            </div>
          ) : null}
          {loaderData.workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </section>
      </div>
    </main>
  );
}

type WorkspaceWithMembers = Workspace & { members: WorkspaceMember[] };

function WorkspaceCard({ workspace }: { workspace: WorkspaceWithMembers }) {
  const canManageMembers =
    workspace.role === "owner" || workspace.role === "admin";
  return (
    <article className="card workspace-card workspace-card-expanded">
      <div className="workspace-card-heading">
        <div>
          <h2>{workspace.name}</h2>
          <p className="muted">{workspace.role}</p>
        </div>
        {workspace.role === "owner" ? (
          <DeleteWorkspaceModal
            workspaceId={workspace.id}
            workspaceName={workspace.name}
          />
        ) : <span className="arrow">→</span>}
      </div>

      <div className="member-section">
        <div className="member-section-heading">
          <h3>Members</h3>
          <span className="muted">{workspace.members.length}</span>
        </div>
        <div className="member-list">
          {workspace.members.map((member) => (
            <div className="member-row" key={member.user_id}>
              <div>
                <strong>
                  {member.profile?.full_name ||
                    member.profile?.email ||
                    member.user_id}
                </strong>
                {member.profile?.full_name ? (
                  <p className="muted">{member.profile.email}</p>
                ) : null}
              </div>
              <div className="member-actions">
                <span className="muted">{member.role}</span>
                {canManageMembers && member.role !== "owner" ? (
                  <Form method="post" className="inline-form">
                    <input type="hidden" name="intent" value="update-member" />
                    <input
                      type="hidden"
                      name="workspaceId"
                      value={workspace.id}
                    />
                    <input
                      type="hidden"
                      name="memberId"
                      value={member.user_id}
                    />
                    <select
                      name="role"
                      defaultValue={member.role}
                      aria-label={`Role for ${member.profile?.email || member.user_id}`}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button className="button small" type="submit">
                      Update
                    </button>
                  </Form>
                ) : null}
                {canManageMembers && member.role !== "owner" ? (
                  <Form method="post" className="inline-form">
                    <input type="hidden" name="intent" value="remove-member" />
                    <input
                      type="hidden"
                      name="workspaceId"
                      value={workspace.id}
                    />
                    <input
                      type="hidden"
                      name="memberId"
                      value={member.user_id}
                    />
                    <button className="button danger small" type="submit">
                      Remove
                    </button>
                  </Form>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {canManageMembers ? (
          <Form method="post" className="member-add-form">
            <input type="hidden" name="intent" value="add-member" />
            <input type="hidden" name="workspaceId" value={workspace.id} />
            <input
              name="userId"
              placeholder="User profile ID"
              aria-label={`User ID for ${workspace.name}`}
              required
            />
            <select
              name="role"
              defaultValue="member"
              aria-label={`New member role for ${workspace.name}`}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button className="button primary" type="submit">
              Add member
            </button>
          </Form>
        ) : null}
      </div>
    </article>
  );
}
