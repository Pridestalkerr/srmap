// import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { parseRas } from "../utils/parser";
import type { Employee } from "@srm/elastic";
import { elastic } from "@srm/elastic";
import { db, skills, selectSkillCategoriesSchema } from "@srm/db";
import type { SelectSkillCategories } from "@srm/db";

export const skillsRouter = router({
  categories: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/categories",
        summary: "Get categories",
        description: "Get categories",
        tags: ["skills"],
      },
    })
    .input(z.void())
    .output(
      z.object({
        records: z.array(selectSkillCategoriesSchema),
      })
    )
    .query(async ({ input, ctx: { session } }) => {
      const records = await db.query.skillCategories.findMany();
      return {
        records,
      };
    }),
  skills: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/skills",
        summary: "Get skills",
        description: "Get skills",
        tags: ["skills"],
      },
    })
    .input(
      z.object({
        query: z.string(),
        size: z.number(),
        from: z.number(),
      })
    )
    .output(
      z.object({
        records: z.array(
          z.object({
            id: z.string().optional(),
            emsiId: z.string().optional(),
            name: z.string().optional(),
            infoUrl: z.string().optional().nullable(),
            description: z.string().optional().nullable(),
            descriptionSource: z.string().optional().nullable(),
            isLanguage: z.boolean().optional(),
            isSoftware: z.boolean().optional(),
            category: z
              .object({
                id: z.string(),
                name: z.string(),
              })
              .optional()
              .nullable(),
            subcategory: z
              .object({
                id: z.string(),
                name: z.string(),
              })
              .optional()
              .nullable(),
            type: z.enum(["ST0", "ST1", "ST2", "ST3"]).optional().nullable(),
            score: z.number().or(z.any()),
            highlights: z.record(z.array(z.string())).optional(),
          })
        ),
      })
    )
    .query(async ({ input, ctx }) => {
      const { documents, total } = await elastic.skills.scroll({
        query: input.query,
        size: input.size,
        from: input.from,
      });
      return {
        records: documents,
        total: total,
      };
    }),
});
