import { Folder, Moon, Sparkles, Users } from "lucide-react";
import { Link } from "react-router";

export type ProjectSidenavItem = {
  name: string;
};

export type SideNavProps = {
  workspace: {
    id: string;
    name: string;
  };
  projects: ProjectSidenavItem[];
  activeSection?: "projects" | "members" | "scout";
  activeProject?: string;
};

export function SideNav({
  workspace,
  projects,
  activeSection = "projects",
  activeProject,
}: SideNavProps) {
  return (
    <aside className="projects-sidebar">
      <Link className="projects-brand" to="/">
        <span className="projects-logo">
          <i />
          <i />
          <i />
        </span>
        Taskly
      </Link>
      <Link className="projects-back" to="/workspaces">
        ‹ All workspaces
      </Link>
      <div className="projects-workspace-name">{workspace.name}</div>
      <Link
        className={`projects-nav${activeSection === "projects" ? " active" : ""}`}
        to={`/workspaces/${workspace.id}/projects`}
      >
        <Folder size={18} />
        Projects
      </Link>
      <Link
        className={`projects-nav${activeSection === "members" ? " active" : ""}`}
        to={`/workspaces/${workspace.id}/members`}
      >
        <Users size={18} />
        Members
      </Link>
      <Link
        className={`projects-nav${activeSection === "scout" ? " active" : ""}`}
        to={`/workspaces/${workspace.id}/ask-scout`}
      >
        <Sparkles size={18} />
        Scout<span>New</span>
      </Link>
      <div className="projects-label">Projects</div>
      {projects.map((project) => {
        const projectId = project.name.toLowerCase().replaceAll(" ", "-");
        return (
          <Link
            className={`projects-subnav${activeProject === projectId ? " active" : ""}`}
            to={`/workspaces/${workspace.id}/projects/${projectId}`}
            key={project.name}
          >
            <i />
            {project.name}
          </Link>
        );
      })}
      <div className="projects-user">
        <span className="projects-avatar">PR</span>
        <div>
          <strong>Prashant</strong>
          <small>Admin</small>
        </div>
        <button type="button" aria-label="Switch to night mode">
          <Moon size={20} />
        </button>
      </div>
    </aside>
  );
}
