import { redirect } from "react-router";
import type { Route } from "./+types/index";
import { listWorkspaces } from "../../../lib/api";
import { getSession } from "../../../lib/session";
import { SideNav } from "../../../components/sideNav";
import "./style.css";

const projects = [
  {
    name: "Website Redesign",
    done: 12,
    total: 30,
    members: ["PR", "AM", "JK"],
  },
  { name: "Mobile App", done: 8, total: 24, members: ["PR", "LS"] },
  {
    name: "Marketing Launch",
    done: 20,
    total: 22,
    members: ["AM", "JK", "LS"],
  },
];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!getSession()) throw redirect("/login");
  const workspaces = await listWorkspaces();
  const workspace = workspaces.find((item) => item.id === params.workspaceId);
  if (!workspace) throw redirect("/workspaces");
  return { workspace };
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { workspace } = loaderData;
  return (
    <main className="projects-page">
      <SideNav workspace={workspace} projects={projects} />
      <section className="projects-main">
        <div className="projects-heading">
          <div>
            <h1>Projects</h1>
            <p>
              {projects.length} projects in {workspace.name}
            </p>
          </div>
          <button className="projects-primary" type="button">
            New project
          </button>
        </div>
        <div className="projects-grid">
          {projects.map((project) => {
            const projectId = project.name.toLowerCase().replaceAll(" ", "-");
            return (
              <a
                className="project-card"
                href={`/workspaces/${workspace.id}/projects/${projectId}`}
                key={project.name}
              >
                <h2>{project.name}</h2>
                <div>
                  <div className="project-progress">
                    <span
                      style={{
                        width: `${(project.done / project.total) * 100}%`,
                      }}
                    />
                  </div>
                  <p>
                    {project.done} of {project.total} tasks done
                  </p>
                </div>
                <div className="project-members">
                  {project.members.map((member, index) => (
                    <span
                      className={`projects-avatar project-avatar-${index}`}
                      key={member}
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
