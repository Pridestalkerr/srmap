import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { OpenApiMeta } from "trpc-openapi";

import { randomBytes } from "crypto";
export const generateToken = (size = 64) => {
  return randomBytes(size).toString("hex");
};

export interface Context {
  session: string;
}

export const createTRPCContext = async ({
  req,
  res,
}: // eslint-disable-next-line @typescript-eslint/require-await
CreateExpressContextOptions): Promise<Context> => {
  const cookies = req.cookies as Record<string, string>;

  let token = cookies.token;
  if (!token) {
    token = generateToken();
    console.log("No token. Generated: ", token);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
  }

  return {
    session: token,
  };
};

const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
// export const protectedProcedure = t.procedure.use(requireAuth);
