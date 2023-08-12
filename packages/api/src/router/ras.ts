// import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { parseRas } from "../utils/parser";
import type { Employee } from "@srm/elastic";
import { elastic } from "@srm/elastic";

export const rasRouter = router({
  upload: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/ras/upload",
        summary: "Upload RAS",
        description: "Upload RAS",
        tags: ["ras"],
      },
    })
    .input(
      z.object({
        ras: z.string(),
      })
    )
    .output(
      z.object({
        inserted: z.number(),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      const buf = Buffer.from(input.ras, "base64");
      const data = parseRas(buf) as unknown as Employee[];
      console.log("actually hitting", data[0]);
      const inserted = await elastic.employees.bulk({
        ownedBy: session,
        documents: data,
      });
      return {
        inserted,
      };
    }),
  scroll: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/ras/scroll",
        summary: "Scroll RAS",
        description: "Scroll RAS",
        tags: ["ras"],
      },
    })
    .input(
      z.object({
        size: z.number(),
        from: z.number(),
      })
    )
    .output(
      z.object({
        results: z.array(
          z.object({
            "Employee Code": z.string().optional().or(z.number()),
            "Employee Name": z.string().optional(),
            "RAS Status Group": z.string().optional(),
            Skill: z.string().optional(),
            score: z.number().nullable().or(z.undefined()),
          })
        ),
        total: z.number().or(z.any()),
      })
    )
    .query(async ({ input: { size, from }, ctx: { session } }) => {
      console.log("actually hitting", size, from, session);
      const results = await elastic.employees.scroll({
        ownedBy: session,
        size,
        from,
      });
      return {
        results: results.documents,
        total: results.total,
      };
    }),
  clear: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/ras/clear",
        summary: "Clear RAS",
        description: "Clear RAS",
        tags: ["ras"],
      },
    })
    .input(z.void())
    .output(
      z.object({
        deleted: z.number(),
      })
    )
    .query(async ({ ctx: { session } }) => {
      const deleted = await elastic.employees.clear({
        ownedBy: session,
      });
      return {
        deleted: deleted ?? 0,
      };
    }),
});
