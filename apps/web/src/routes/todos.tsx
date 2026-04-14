import { createFileRoute } from "@tanstack/react-router";
import { env } from "@todo-hono-postmark/env/web";
import { hc } from "hono/client";
import { useQuery } from "@tanstack/react-query";
import type { AppType } from "@server/index";

const client = hc<AppType>(env.VITE_SERVER_URL); //url for the server but loaded for env/web

export const Route = createFileRoute("/todos")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await client.api.todos.$get();
      return res.json();
    },
  });

  // Handle error response
  if (data && "message" in data) {
    return <div className="text-red-500">Error: {data.message}</div>;
  }

  return (
    <ul className="mb-4 space-y-2">
      {data?.map((todo) => (
        <li key={todo.id}>
          <p>{todo.title}</p>
        </li>
      ))}
    </ul>
  );
}
