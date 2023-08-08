import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import swagger from "swagger-ui-express";
import cors from "cors";
import { env } from "@srm/env";
import { createTRPCContext, openApiDocument } from "@srm/api";
import { appRouter } from "@srm/api";
import asyncHandler from "express-async-handler";
import cookieParser from "cookie-parser";

// eslint-disable-next-line @typescript-eslint/require-await
const main = async () => {
  const app = express();
  app.use(cors({ origin: env.CLIENTSIDE_HOST, credentials: true }));

  const server = createServer(app);
  app.use(cookieParser());

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: createTRPCContext,
    })
  );
  app.use(
    "/api/openapi",
    // FIXME: why does createOpenApiExpressMiddleware return a promise<void>?
    asyncHandler(
      createOpenApiExpressMiddleware({
        router: appRouter,
        createContext: createTRPCContext,
      })
    )
  );
  app.use("/swagger", swagger.serve);
  app.get(
    "/swagger",
    swagger.setup(openApiDocument(env.SERVERSIDE_HOST + "/api/openapi"))
  );

  server.listen(env.API_PORT, () => {
    console.log(`Server started on port ${env.API_PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
