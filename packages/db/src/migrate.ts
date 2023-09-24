import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "@srm/env";

const runMigration = async () => {
  const migrationConnection = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationConnection, {
    logger: true,
  });
  await migrate(db, { migrationsFolder: "migrations" });
};

runMigration()
  .then(() => {
    console.log("Migrated");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
