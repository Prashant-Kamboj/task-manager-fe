import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("login", "routes/login/index.tsx"),
  route("forgot-password", "routes/forgot-password/index.tsx"),
  route("signup", "routes/signup/index.tsx"),
  route("logout", "routes/logout/index.tsx"),
  route("mcp/authorize", "routes/mcp/authorize/index.tsx"),
  route("workspaces", "routes/workspaces/index.tsx"),
  route("workspaces/new", "routes/workspaces/new/index.tsx"),
  route("workspaces/:workspaceId/projects", "routes/workspaces/projects/index.tsx"),
  route("workspaces/:workspaceId/projects/:projectId", "routes/workspaces/projects/board.tsx"),
  route("workspaces/:workspaceId/members", "routes/workspaces/members/index.tsx"),
  route("workspaces/:workspaceId/ask-scout", "routes/workspaces/ask-scout/index.tsx"),
  route(".well-known/appspecific/com.chrome.devtools.json", "routes/.well-known/appspecific/com.chrome.devtools.json/index.ts"),
] satisfies RouteConfig;
