import { Sparkles } from "lucide-react";
import { redirect } from "react-router";
import type { Route } from "./+types/index";
import { SideNav } from "../../../components/sideNav";
import { listWorkspaces } from "../../../lib/api.server";
import { requireAuth } from "../../../lib/session.server";
import "../projects/style.css";
import "./style.css";

const projects = [
  { name: "Website Redesign" },
  { name: "Mobile App" },
  { name: "Marketing Launch" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireAuth(request);
  const workspaces = await listWorkspaces(request);
  const workspace = workspaces.find((item) => item.id === params.workspaceId);
  if (!workspace) throw redirect("/workspaces");
  return { workspace };
}

export default function AskScout({ loaderData }: Route.ComponentProps) {
  const { workspace } = loaderData;
  return (
    <main className="scout-page">
      <SideNav workspace={workspace} projects={projects} activeSection="scout" />
      <section className="scout-main">
        <div className="scout-heading"><div><h1><span className="scout-icon"><Sparkles size={22} /></span><span>Scout</span></h1><p>Ask anything about your workspaces and projects</p></div></div>
        <div className="scout-filters"><span>Ask about</span><button type="button">All workspaces</button><button type="button">{workspace.name}</button><button className="selected" type="button">Website Redesign</button></div>
        <div className="scout-conversation">
          <div className="scout-question">What is holding up the Website Redesign launch?</div>
          <div className="scout-answer"><span className="scout-avatar">S</span><div><p>Two tasks are holding up the launch. 3 of 13 tasks are done, and the rest are on track.</p><ol><li><b>Pricing page draft</b> is in review with Amira Moyo, due Jun 2.</li><li><b>Contact form</b> is in QA with Jon Kim, due Jun 1.</li></ol><div className="scout-sources"><span>Sources</span><a href="#pricing-page-draft">Pricing page draft</a><a href="#contact-form">Contact form</a></div></div></div>
        </div>
        <div className="scout-composer"><div className="scout-prompts"><button type="button">Who has the most open tasks?</button><button type="button">Summarize this week's progress</button><button type="button">Which tasks are due soon?</button></div><div className="scout-input-row"><input aria-label="Ask a question" placeholder="Ask Scout about any workspace or project…" /><button className="scout-send" type="button">Send</button></div></div>
      </section>
    </main>
  );
}
