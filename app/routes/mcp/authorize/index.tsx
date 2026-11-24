import { Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/index";
import { requireAuth } from "../../../lib/session.server";
import "./style.css";

const apiUrl = process.env.VITE_API_URL ?? "http://localhost:3000";

export async function action({ request }: Route.ActionArgs) {
  const session = await requireAuth(request);
  const formData = await request.formData();
  const response = await fetch(`${apiUrl}/mcp/oauth/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: formData.get("client_id"),
      redirectUri: formData.get("redirect_uri"),
      codeChallenge: formData.get("code_challenge"),
      state: formData.get("state"),
      scope: formData.get("scope"),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    }),
  });
  const body = (await response.json()) as { redirectUri?: string; error?: { message?: string } };
  if (!response.ok || !body.redirectUri) throw new Error(body.error?.message ?? "Could not authorize MCP");
  return redirect(body.redirectUri);
}

export default function McpAuthorize() {
  const navigation = useNavigation();
  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const isSubmitting = navigation.state === "submitting";
  return (
    <main className="page-shell narrow">
      <p className="eyebrow">MCP connection</p><h1>Connect Task Manager</h1>
      <p className="lede">An AI client is requesting access to your Task Manager workspaces.</p>
      <Form method="post">
        {["client_id", "redirect_uri", "code_challenge", "state", "scope"].map((key) => <input key={key} type="hidden" name={key} value={params.get(key) ?? ""} />)}
        <button className="button primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Connecting…" : "Allow access"}</button>
      </Form>
    </main>
  );
}
