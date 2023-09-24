import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  // uniqueIndex,
  // boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// timestamp with timezone helper
const timestampTZ = (name: string) => {
  return timestamp(name, {
    withTimezone: true,
    // ...opts,
  });
};

export const defaultField = () => {
  return {
    id: uuid("id").primaryKey().defaultRandom().unique(),
    createdAt: timestampTZ("created_at").defaultNow(),
    updatedAt: timestampTZ("updated_at"), // null at first, must be updated manually sadly
  };
};

const ST = {
  ST0: {
    name: "Removed",
    description:
      "Removed skills are skills that were once part of the skill taxonomy, but have been removed or replaced.",
  },
  ST1: {
    name: "Specialized Skill",
    description:
      'Skills that are primarily required within a subset of occupations or equip one to perform a specific task (e.g. "NumPy" or "Hotel Management"). Also known as technical skills or specialized skills.',
  },
  ST2: {
    name: "Common Skill",
    description:
      'Skills that are prevalent across many different occupations and industries, including both personal attributes and learned skills. (e.g. "Communication" or "Microsoft Excel"). Also known as soft skills, human skills, and competencies.',
  },
  ST3: {
    name: "Certification",
    description:
      "Certification skills are recognizable qualification standards assigned by industry or education bodies.",
  },
};

export const skills = pgTable("skills", {
  ...defaultField(),
  emsiId: text("emsi_id").unique().notNull(),
  name: text("name").notNull(),
  infoUrl: text("info_url"),
  description: text("description"),
  descriptionSource: text("description_source"),
  isLanguage: boolean("is_language").notNull(),
  isSoftware: boolean("is_software").notNull(),
  categoryId: uuid("category_id").references(() => skillCategories.id, {
    onDelete: "set null",
  }),
  subcategoryId: uuid("subcategory_id").references(() => skillCategories.id, {
    onDelete: "set null",
  }),
  type: text("type").$type<"ST0" | "ST1" | "ST2" | "ST3">(),
});

export const skillCategories = pgTable("skill_categories", {
  ...defaultField(),
  name: text("name").notNull(),
  emsiId: integer("emsi_id").unique().notNull(), // categories go up to id=17, subcategories are 3 digits
  isSubcategory: boolean("is_subcategory").notNull(),
});

export const employees = pgTable("employees", {
  ...defaultField(),
  code: text("code").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique(),
  phone: text("phone"),
});

export const employeeSkills = pgTable("employee_skills", {
  ...defaultField(),
  employeeId: uuid("employee_id").references(() => employees.id, {
    onDelete: "cascade",
  }),
  skillId: uuid("skill_id").references(() => skills.id, {
    onDelete: "cascade",
  }),
  level: integer("level"),
  experience: integer("experience"),
});

// relations
export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
  subcategory: one(skillCategories, {
    fields: [skills.subcategoryId],
    references: [skillCategories.id],
  }),
}));

export const employeesRelations = relations(employees, ({ many }) => ({
  skills: many(employeeSkills),
}));

export const employeeSkillsRelations = relations(employeeSkills, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeSkills.id],
    references: [employees.id],
  }),
  skill: one(skills, {
    fields: [employeeSkills.id],
    references: [skills.id],
  }),
}));
