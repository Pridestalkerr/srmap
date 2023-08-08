import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    API_PORT: z.coerce.number(),
    CLIENTSIDE_HOST: z.string().url(),
    SERVERSIDE_HOST: z.string().url(),
    NEXT_PUBLIC_SERVERSIDE_HOST: z.string().url(),
  },
  runtimeEnv: process.env,
});
