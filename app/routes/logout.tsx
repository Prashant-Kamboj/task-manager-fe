import { redirect } from 'react-router';
import type { Route } from './+types/logout';
import { clearSession } from '../lib/session';

export async function clientAction(_args: Route.ClientActionArgs) {
  clearSession();
  return redirect('/login');
}

export default function Logout() { return null; }
