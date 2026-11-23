import { redirect } from 'react-router';
import type { Route } from './+types/index';
import { clearSession } from '../../lib/session';

export async function clientAction(_args: Route.ClientActionArgs) {
  clearSession();
  return redirect('/login');
}

export async function clientLoader(_args: Route.ClientLoaderArgs) {
  clearSession();
  throw redirect('/login');
}

export default function Logout() { return null; }
import "./style.css";
