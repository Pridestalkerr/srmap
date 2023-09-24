import { drizzle } from "drizzle-orm/postgres-js";
// import type { Sql } from "postgres";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@srm/env";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, {
  schema: { ...schema },
  logger: true,
});

export const { skills, skillCategories, employees, employeeSkills } = schema;

export const selectSkillCategoriesSchema = createSelectSchema(skillCategories);
export type SelectSkillCategories = z.infer<typeof selectSkillCategoriesSchema>;

// type FirstArg<T extends (...args: any) => any> = T extends (
//   arg1: infer U,
//   ...args: any
// ) => any
//   ? U
//   : never;

// export const initDb = async <T extends FirstArg<typeof drizzle>>(client: T) => {
//   const db = drizzle(client, {
//     schema: { ...schema },
//     logger: true,
//   });

//   return db;
// };
