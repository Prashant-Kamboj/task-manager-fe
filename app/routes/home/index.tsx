import { Link } from "react-router";
import "./style.css";

const features = [
  [
    "workspaces",
    "Workspaces",
    "Keep each team or client in its own space.",
    "indigo",
  ],
  [
    "members",
    "Members",
    "Invite people to a workspace and choose their role.",
    "sky",
  ],
  [
    "projects",
    "Projects",
    "Group tasks into projects with their own members.",
    "amber",
  ],
  [
    "board",
    "Five-stage board",
    "To do, In progress, In review, In QA and Done.",
    "green",
  ],
  [
    "comments",
    "Comments",
    "Discuss work on the task, where it happens.",
    "rose",
  ],
  [
    "scout",
    "Scout",
    "Ask Scout anything about any workspace or project.",
    "violet",
  ],
] as const;
const columns = [
  ["To do", "#8a8a84", 3],
  ["In progress", "#3b5bdb", 2],
  ["In review", "#b7791f", 3],
  ["In QA", "#7048e8", 2],
  ["Done", "#2f9e44", 3],
] as const;

export function meta() {
  return [
    { title: "Taskly" },
    {
      name: "description",
      content: "A simple task management app for you teams.",
    },
  ];
}
function Logo() {
  return (
    <span className="landing-logo">
      <span className="logo-mark">
        <i />
        <i />
        <i />
      </span>
      Taskly
    </span>
  );
}
function FeatureIcon({ name }: { name: (typeof features)[number][0] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "workspaces")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  if (name === "members")
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.4c2 .7 3.5 2.6 3.5 5.6" />
      </svg>
    );
  if (name === "projects")
    return (
      <svg {...common}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    );
  if (name === "board")
    return (
      <svg {...common}>
        <rect x="3" y="4" width="4.5" height="16" rx="1.5" />
        <rect x="9.75" y="4" width="4.5" height="10" rx="1.5" />
        <rect x="16.5" y="4" width="4.5" height="13" rx="1.5" />
      </svg>
    );
  if (name === "comments")
    return (
      <svg {...common}>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 3v4M17 5h4" />
    </svg>
  );
}
function CollaboratorCursor({
  name,
  tone,
}: {
  name: string;
  tone: "amira" | "jon" | "lena";
}) {
  return (
    <div className={`cursor cursor-${tone}`}>
      <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
        <path
          d="M1 1l5 17 3-7 7-3z"
          fill="currentColor"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span>{name}</span>
    </div>
  );
}
function BoardPreview() {
  return (
    <div className="board-preview" aria-label="Task board preview">
      <CollaboratorCursor name="Amira" tone="amira" />
      <CollaboratorCursor name="Jon" tone="jon" />
      <CollaboratorCursor name="Lena" tone="lena" />
      <div className="board-columns">
        {columns.map(([name, color, count]) => (
          <div className="board-column" key={name}>
            <div className="column-title">
              <span style={{ background: color }} />
              {name}
            </div>
            {Array.from({ length: count }, (_, index) => (
              <div className="task-skeleton" key={index}>
                <b style={{ width: `${58 + ((index * 17) % 38)}%` }} />
                <small />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link to="/" aria-label="Taskly home">
          <Logo />
        </Link>
        <nav>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </nav>
        <div className="landing-actions">
          <button className="theme-toggle" aria-label="Switch to night mode">
            ☾
          </button>
          <Link className="landing-button" to="/login">
            Log in
          </Link>
          <Link className="landing-button landing-primary" to="/signup">
            Sign up
          </Link>
        </div>
      </header>
      <main>
        <section className="landing-hero">
          <span className="announcement">
            New: meet Scout, your project assistant
          </span>
          <h1>
            Task Management that <em>makes team work simple.</em>
          </h1>
          <p>
            Organise work into workspaces and projects, invite your team, and
            move every task from to do to done.
          </p>
          <div className="hero-actions">
            <Link className="landing-button landing-primary large" to="/signup">
              Sign up free
            </Link>
            <Link className="landing-button large" to="/login">
              Log in
            </Link>
          </div>
          <small>No credit card needed</small>
          <BoardPreview />
        </section>
        <section className="landing-section" id="features">
          <h2>Includes everything a team needs.</h2>
          <div className="feature-grid">
            {features.map(([icon, title, text, tone]) => (
              <article className={`feature-card ${tone}`} key={title}>
                <span className="feature-icon">
                  <FeatureIcon name={icon} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="landing-section how-section" id="how">
          <h2>Up and running in three steps</h2>
          <div className="steps-grid">
            <article className="step-card step-one">
              <div className="step-preview workspace-preview">
                <b>Workspace name</b>
                <strong>Acme Studio</strong>
                <div className="mini-people">
                  <i>PR</i>
                  <i>AM</i>
                  <i>JK</i>
                  <span>+ Invite</span>
                </div>
              </div>
              <div className="step-copy">
                <div className="step-number">
                  <b>1</b> Step 1
                </div>
                <h3>Create a workspace</h3>
                <p>Name it and invite your team.</p>
              </div>
              <span className="step-arrow" aria-hidden="true">
                ›
              </span>
            </article>
            <article className="step-card step-two">
              <div className="step-preview projects-preview">
                <div>
                  <b>Website Redesign</b>
                  <span>
                    <i />
                  </span>
                </div>
                <div>
                  <b>Mobile App</b>
                  <span>
                    <i />
                  </span>
                </div>
              </div>
              <div className="step-copy">
                <div className="step-number">
                  <b>2</b> Step 2
                </div>
                <h3>Add projects</h3>
                <p>Give each project its own members and task list.</p>
              </div>
              <span className="step-arrow" aria-hidden="true">
                ›
              </span>
            </article>
            <article className="step-card step-three">
              <div className="step-preview mini-board-preview">
                {[
                  ["To do", "todo"],
                  ["Doing", "doing"],
                  ["Done", "done"],
                ].map(([name, state]) => (
                  <div className="mini-column" key={name}>
                    <b>
                      <i className={state} />
                      {name}
                    </b>
                    <span />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
              <div className="step-copy">
                <div className="step-number">
                  <b>3</b> Step 3
                </div>
                <h3>Move tasks forward</h3>
                <p>Drag work across the board until it is done.</p>
              </div>
            </article>
          </div>
        </section>
        <section className="landing-cta">
          <h2>Start organising your work today</h2>
          <p>Free to start. Set up your first workspace in a minute.</p>
          <div className="hero-actions">
            <Link className="landing-button landing-primary large" to="/signup">
              Sign up free
            </Link>
            <Link className="landing-button large" to="/login">
              Log in
            </Link>
          </div>
        </section>
      </main>
      <footer>
        <Logo />
        <span>© 2026 Taskly</span>
      </footer>
    </div>
  );
}
