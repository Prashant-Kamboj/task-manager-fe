import { Form, Link, redirect, useNavigate } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/index";
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
} from "../../lib/api.server";
import { requireAuth } from "../../lib/session.server";
import { DeleteWorkspaceModal } from "../../components/delete-workspace-modal";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const workspaces = await listWorkspaces(request);
  const workspacesWithMembers = await Promise.all(
    workspaces.map(async (workspace) => ({
      ...workspace,
      members: (await listWorkspaceMembers(request, workspace.id)) ?? [],
    }))
  );
  return { workspaces: workspacesWithMembers };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "create-workspace");
  try {
    if (intent === "create-workspace") {
      const name = String(formData.get("name") ?? "").trim();
      if (!name) return { error: "Workspace name is required." };
      await createWorkspace(request, name);
    } else if (intent === "add-member") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      const userId = String(formData.get("userId") ?? "").trim();
      const role = String(formData.get("role") ?? "member") as
        "admin" | "member";
      if (!workspaceId || !userId) return { error: "A user ID is required." };
      await addWorkspaceMember(request, workspaceId, userId, role);
    } else if (intent === "update-member") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      const memberId = String(formData.get("memberId") ?? "");
      const role = String(formData.get("role") ?? "member") as
        "admin" | "member";
      await updateWorkspaceMember(request, workspaceId, memberId, role);
    } else if (intent === "remove-member") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      const memberId = String(formData.get("memberId") ?? "");
      await removeWorkspaceMember(request, workspaceId, memberId);
    } else if (intent === "delete-workspace") {
      const workspaceId = String(formData.get("workspaceId") ?? "");
      if (!workspaceId) return { error: "A workspace ID is required." };
      await deleteWorkspace(request, workspaceId);
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
}: Route.ComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <Link className="workspace-brand" to="/" aria-label="Taskly home">
          <span className="logo-mark"><i /><i /><i /></span>Taskly
        </Link>
        <div className="workspace-header-actions">
          <button className="workspace-theme-toggle" type="button" aria-label="Switch to night mode">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
          </button>
          <div className="workspace-profile">
            <button className="workspace-avatar" type="button" aria-label="Open account menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>PR</button>
            {isMenuOpen ? <div className="workspace-menu"><Form method="post" action="/logout"><button type="submit">Log out</button></Form></div> : null}
          </div>
        </div>
      </header>
      <div className="workspace-content">
        <div className="workspace-heading">
          <div><h1>Your workspaces</h1><p>Pick a workspace to see its projects</p></div>
          <Link className="button primary" to="/workspaces/new">+ New workspace</Link>
        </div>
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
  const navigate = useNavigate();
  return (
    <article className="card workspace-card" role="link" tabIndex={0} onClick={() => navigate(`/workspaces/${workspace.id}/projects`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); navigate(`/workspaces/${workspace.id}/projects`); } }}>
      <div className="workspace-card-heading">
        <div>
          <h2>{workspace.name}</h2>
          <p className="muted">0 projects · {workspace.members.length} members</p>
        </div>
        {workspace.role === "owner" ? (
          <DeleteWorkspaceModal
            workspaceId={workspace.id}
            workspaceName={workspace.name}
          />
        ) : <span className="arrow">→</span>}
      </div>

      <div className="workspace-member-preview">
        {workspace.members.slice(0, 4).map((member, index) => <span className={`workspace-avatar member-avatar member-avatar-${index}`} key={member.user_id}>{(member.profile?.full_name || member.profile?.email || "PR").slice(0, 2).toUpperCase()}</span>)}
      </div>
    </article>
  );
}
import "./style.css";
