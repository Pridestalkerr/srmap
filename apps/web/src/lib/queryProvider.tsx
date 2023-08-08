"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import { api } from "./trpc";
import superjson from "superjson";
import { env } from "@srm/env";

export default function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  console.log("url", env.NEXT_PUBLIC_SERVERSIDE_HOST + "/api/trpc");

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          // TODO: define the route in api package
          url: "http://192.168.1.128:3333/api/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
