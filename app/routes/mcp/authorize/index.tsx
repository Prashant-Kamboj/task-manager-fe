import { useEffect, useState } from "react";
import { getSession } from "../../../lib/session";
import { getValidSession } from "../../../lib/api";
import "./style.css";

const apiUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000";

export default function McpAuthorize() {
  const [status, setStatus] = useState<"ready" | "working" | "error">("ready");
  const [error, setError] = useState("");
  const params = new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search
  );

  async function approve() {
    if (!getSession()) {
      const returnTo = `${window.location.pathname}${window.location.search}${window.location.search ? "&" : "?"}autoApprove=1`;
      window.location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    setStatus("working");
    try {
      // The MCP flow is often opened from a stale mobile browser tab. Make
      // sure the access token is fresh before handing it to the backend.
      const session = await getValidSession();
      const response = await fetch(`${apiUrl}/mcp/oauth/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: params.get("client_id"),
          redirectUri: params.get("redirect_uri"),
          codeChallenge: params.get("code_challenge"),
          state: params.get("state"),
          scope: params.get("scope"),
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      });
      const body = (await response.json()) as {
        redirectUri?: string;
        error?: { message?: string };
      };
      if (!response.ok || !body.redirectUri) {
        throw new Error(body.error?.message ?? "Could not authorize MCP");
      }
      window.location.assign(body.redirectUri);
    } catch (cause) {
      setStatus("error");
      setError(
        cause instanceof Error ? cause.message : "Could not authorize MCP"
      );
    }
  }

  useEffect(() => {
    if (params.get("autoApprove") === "1" && getSession()) {
      void approve();
    }
  }, []);

  return (
    <main className="page-shell narrow">
      <p className="eyebrow">MCP connection</p>
      <h1>Connect Task Manager</h1>
      <p className="lede">
        An AI client is requesting access to your Task Manager workspaces.
      </p>
      {status === "error" ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="button primary"
        onClick={approve}
        disabled={status === "working"}
      >
        {status === "working" ? "Connecting…" : "Allow access"}
      </button>
    </main>
  );
}
