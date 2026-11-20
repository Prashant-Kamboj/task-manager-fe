import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'Task Manager' },
    { name: 'description', content: 'A workspace and task manager.' },
  ];
}

export default function Home() {
  return <main className="page-shell hero"><p className="eyebrow">Task Manager</p><h1>Make the next piece of work obvious.</h1><p className="lede">A focused workspace for projects, tasks, and the people moving them forward.</p><div className="actions"><Link className="button primary" to="/login">Sign in</Link><Link className="button secondary" to="/workspaces">Open workspaces</Link></div></main>;
}
