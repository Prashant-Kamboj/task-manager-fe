import { redirect } from 'react-router';
import type { Route } from './+types/index';
import { clearAuthCookie } from '../../lib/session.server';

export async function action({ request }: Route.ActionArgs) {
  return redirect('/login', { headers: { "Set-Cookie": await clearAuthCookie(request) } });
}

export async function loader({ request }: Route.LoaderArgs) {
  throw redirect('/login', { headers: { "Set-Cookie": await clearAuthCookie(request) } });
}

export default function Logout() { return null; }
import "./style.css";
