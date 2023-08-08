import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import { appRouter } from "./root";

export { appRouter, type AppRouter } from "./root";
export { createTRPCContext } from "./trpc";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

import { generateOpenApiDocument } from "trpc-openapi";

export const openApiDocument = (baseUrl: string) => {
  return generateOpenApiDocument(appRouter, {
    title: "Example CRUD API",
    description: "OpenAPI compliant REST API built using tRPC with Express",
    version: "1.0.0",
    baseUrl,
    docsUrl: "https://github.com/jlalmes/trpc-openapi",
    tags: ["auth", "users", "posts"],
  });
};
