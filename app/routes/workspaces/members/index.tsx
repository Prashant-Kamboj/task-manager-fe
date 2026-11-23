import { redirect } from "react-router";
import type { Route } from "./+types/index";
import { SideNav } from "../../../components/sideNav";
import { listWorkspaces } from "../../../lib/api";
import { getSession } from "../../../lib/session";
import "../projects/style.css";
import "./style.css";

const projects = [
  { name: "Website Redesign" },
  { name: "Mobile App" },
  { name: "Marketing Launch" },
];

const members = [
  { initials: "PR", name: "Prashant (you)", email: "prashant@acme.com", projects: 3, role: "Admin", color: "member-indigo" },
  { initials: "AM", name: "Amira Moyo", email: "amira@acme.com", projects: 2, role: "Admin", color: "member-rose" },
  { initials: "JK", name: "Jon Kim", email: "jon@acme.com", projects: 2, role: "Member", color: "member-amber" },
  { initials: "LS", name: "Lena Sato", email: "lena@acme.com", projects: 2, role: "Member", color: "member-emerald" },
];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!getSession()) throw redirect("/login");
  const workspaces = await listWorkspaces();
  const workspace = workspaces.find((item) => item.id === params.workspaceId);
  if (!workspace) throw redirect("/workspaces");
  return { workspace };
}

export default function Members({ loaderData }: Route.ComponentProps) {
  const { workspace } = loaderData;

  return (
    <main className="members-page">
      <SideNav workspace={workspace} projects={projects} activeSection="members" />
      <section className="members-main">
        <div className="members-heading">
          <div><h1>Members</h1><p>{members.length} people in {workspace.name}</p></div>
          <button className="members-primary" type="button">Invite member</button>
        </div>
        <div className="members-card">
          <div className="members-table-header"><span>Person</span><span>Projects</span><span>Role</span></div>
          {members.map((member) => (
            <div className="member-row" key={member.email}>
              <span className={`members-avatar ${member.color}`}>{member.initials}</span>
              <div className="member-identity"><div>{member.name}</div><small>{member.email}</small></div>
              <div className="member-project-count">{member.projects} projects</div>
              <button className="member-role" type="button">{member.role} <span aria-hidden="true">▾</span></button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
