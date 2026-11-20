// temp fix without this, the chrome devtools will not work in production
export async function loader() {
  return new Response("{}", {
    headers: { "Content-Type": "application/json" },
  });
}
