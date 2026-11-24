import { redirect } from "react-router";
import type { Route } from "./+types/board";
import { SideNav } from "../../../components/sideNav";
import { listWorkspaces } from "../../../lib/api.server";
import { requireAuth } from "../../../lib/session.server";
import "./style.css";
import "./board.css";

const projects = [
  { name: "Website Redesign", members: ["PR", "AM", "JK"] },
  { name: "Mobile App", members: ["PR", "LS"] },
  { name: "Marketing Launch", members: ["AM", "JK", "LS"] },
];

const columns = [
  {
    name: "To do",
    color: "todo",
    tasks: [
      ["Audit current navigation", "Jun 3", "AM", "rose"],
      ["Write homepage copy", "Jun 5", "JK", "amber"],
      ["Collect brand assets", "Jun 6", "PR", "indigo"],
    ],
  },
  {
    name: "In progress",
    color: "progress",
    tasks: [
      ["Design homepage layout", "Jun 4", "PR", "indigo"],
      ["Set up analytics", "Jun 4", "JK", "amber"],
    ],
  },
  {
    name: "In review",
    color: "review",
    tasks: [
      ["Pricing page draft", "Jun 2", "AM", "rose"],
      ["Footer redesign", "Jun 3", "LS", "emerald"],
    ],
  },
  {
    name: "In QA",
    color: "qa",
    tasks: [["Contact form", "Jun 1", "JK", "amber"]],
  },
  {
    name: "Done",
    color: "done",
    tasks: [
      ["Sitemap", "May 28", "AM", "rose"],
      ["Kickoff notes", "May 27", "PR", "indigo"],
      ["Competitor review", "May 29", "LS", "emerald"],
    ],
  },
] as const;

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireAuth(request);
  const workspaces = await listWorkspaces(request);
  const workspace = workspaces.find((item) => item.id === params.workspaceId);
  const project = projects.find(
    (item) => item.name.toLowerCase().replaceAll(" ", "-") === params.projectId
  );
  if (!workspace || !project)
    throw redirect(`/workspaces/${params.workspaceId}/projects`);
  return { workspace, project };
}

export default function ProjectBoard({ loaderData }: Route.ComponentProps) {
  const { workspace, project } = loaderData;
  const projectId = project.name.toLowerCase().replaceAll(" ", "-");
  return (
    <main className="board-page">
      <SideNav
        workspace={workspace}
        projects={projects}
        activeProject={projectId}
      />
      <section className="board-main">
        <div className="board-heading">
          <div>
            <h1>{project.name}</h1>
            <p>{workspace.name}</p>
          </div>
          <div className="board-actions">
            {project.members.map((member, index) => (
              <span className={`board-avatar avatar-${index}`} key={member}>
                {member}
              </span>
            ))}
            <button className="board-button" type="button">
              Add member
            </button>
            <button className="board-button board-primary" type="button">
              New task
            </button>
          </div>
        </div>
        <div className="board-columns">
          {columns.map((column) => (
            <section className="board-column" key={column.name}>
              <div className="board-column-heading">
                <span className={`board-dot ${column.color}`} />
                {column.name}
                <span className="board-count">{column.tasks.length}</span>
              </div>
              {column.tasks.map(([name, date, member, avatar]) => (
                <a className="board-task" href="#" key={name}>
                  <span className="board-task-name">{name}</span>
                  <span className="board-task-meta">
                    <span>{date}</span>
                    <span
                      className={`board-avatar avatar-${avatar === "rose" ? 1 : avatar === "amber" ? 2 : avatar === "emerald" ? 3 : 0}`}
                    >
                      {member}
                    </span>
                  </span>
                </a>
              ))}
              <button className="board-add-task" type="button">
                + Add task
              </button>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
