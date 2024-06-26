// import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { parseDemand } from "../utils/parser";
import type { Project } from "@srm/elastic";
import { elastic } from "@srm/elastic";

export const demandRouter = router({
  upload: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/demand/upload",
        summary: "Upload Demand",
        description: "Upload Demand",
        tags: ["demand"],
      },
    })
    .input(
      z.object({
        demand: z.string(),
      })
    )
    .output(
      z.object({
        inserted: z.number(),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      const buf = Buffer.from(input.demand, "base64");
      const data = parseDemand(buf) as unknown as Project[];
      console.log("actually hitting", data[0]);
      const inserted = await elastic.projects.bulk({
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
        path: "/demand/scroll",
        summary: "Scroll Demand",
        description: "Scroll Demand",
        tags: ["demand"],
      },
    })
    .input(
      z.object({
        size: z.number(),
        from: z.number(),
        skills: z.string(),
      })
    )
    .output(
      z.object({
        results: z.array(
          z.object({
            // "Auto req ID": z.string().optional().or(z.number()),
            "SR Number": z.string().optional(),
            "Reqisition Status": z.string().optional(),
            "Job Description": z.string().optional(),
            "Primary Skill": z.string().optional(),
            Country: z.string().optional(),
            score: z.number().nullable().or(z.undefined()),
            highlights: z.record(z.array(z.string())).optional(),
          })
        ),
        total: z.number().or(z.any()),
      })
    )
    .query(async ({ input: { size, from, skills }, ctx: { session } }) => {
      console.log("actually hitting", size, from, session);
      const results = await elastic.projects.scroll({
        ownedBy: session,
        query: skills,
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
        path: "/demand/clear",
        summary: "Clear Demand",
        description: "Clear Demand",
        tags: ["demand"],
      },
    })
    .input(z.void())
    .output(
      z.object({
        deleted: z.number(),
      })
    )
    .query(async ({ ctx: { session } }) => {
      const deleted = await elastic.projects.clear({ ownedBy: session });
      return {
        deleted: deleted ?? 0,
      };
    }),
  count: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/demand/count",
        summary: "Count Demand",
        description: "Count Demand",
        tags: ["demand"],
      },
    })
    .input(z.void())
    .output(
      z.object({
        count: z.number(),
      })
    )
    .query(async ({ ctx: { session } }) => {
      const count = await elastic.projects.count({ ownedBy: session });
      return {
        count: count,
      };
    }),
});
