import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("logout", "routes/logout.tsx"),
  route("mcp/authorize", "routes/mcp-authorize.tsx"),
  route("workspaces", "routes/workspaces.tsx"),
  route(".well-known/appspecific/com.chrome.devtools.json", "routes/chrome-devtools.ts"),
] satisfies RouteConfig;
