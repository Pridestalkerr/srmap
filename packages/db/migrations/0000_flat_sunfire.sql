CREATE TABLE IF NOT EXISTS "employee_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"employee_id" uuid,
	"skill_id" uuid,
	"level" integer,
	"experience" integer,
	CONSTRAINT "employee_skills_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"code" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	CONSTRAINT "employees_id_unique" UNIQUE("id"),
	CONSTRAINT "employees_code_unique" UNIQUE("code"),
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skill_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"name" text NOT NULL,
	"emsi_id" integer NOT NULL,
	"is_subcategory" boolean NOT NULL,
	CONSTRAINT "skill_categories_id_unique" UNIQUE("id"),
	CONSTRAINT "skill_categories_emsi_id_unique" UNIQUE("emsi_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"emsi_id" text NOT NULL,
	"name" text NOT NULL,
	"info_url" text,
	"description" text,
	"description_source" text,
	"is_language" boolean NOT NULL,
	"is_software" boolean NOT NULL,
	"category_id" uuid,
	"subcategory_id" uuid,
	"type" text,
	CONSTRAINT "skills_id_unique" UNIQUE("id"),
	CONSTRAINT "skills_emsi_id_unique" UNIQUE("emsi_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_skill_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "skill_categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_subcategory_id_skill_categories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "skill_categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
