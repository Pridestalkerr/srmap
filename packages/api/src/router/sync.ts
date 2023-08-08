// import { TRPCError } from "@trpc/server";
import z from "zod";
import { publicProcedure } from "../trpc";
import { elastic } from "@srm/elastic";

export const syncRouter = publicProcedure
  .meta({
    openapi: {
      method: "GET",
      path: "/sync",
      summary: "we sync LETS GOO",
      description: "sync with elastic",
      tags: ["sync"],
    },
  })
  .input(z.void())
  .output(
    z.object({
      ras: z.number(),
      demand: z.number(),
    })
  )
  .query(async ({ ctx: { session } }) => {
    const ownedBy = session;

    const res = await elastic.sync({ ownedBy });
    return res;
  });
