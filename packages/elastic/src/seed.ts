import { db, skills as skillsTable, skillCategories } from "@srm/db";
import { skills } from "./models/skill";
import { elastic } from ".";

const seed = async () => {
  console.log("cleared: ", await elastic.skills.clear());
  await elastic.skills.index();
  const res = await db.query.skills.findMany({
    with: {
      category: true,
      subcategory: true,
    },
  });

  const BATCH_SIZE = 1000;
  const totalBatches = Math.ceil(res.length / BATCH_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const batch = res.slice(start, end);

    const batchedDocuments = batch.map((skill) => {
      return {
        id: skill.id,
        name: skill.name,
        emsiId: skill.emsiId,
        infoUrl: skill.infoUrl ?? null,
        description: skill.description ?? null,
        descriptionSource: skill.descriptionSource ?? null,
        isLanguage: skill.isLanguage,
        isSoftware: skill.isSoftware,
        category: skill.category
          ? {
              id: skill.category.id,
              name: skill.category.name,
            }
          : null,
        subcategory: skill.subcategory
          ? {
              id: skill.subcategory.id,
              name: skill.subcategory.name,
            }
          : null,
        type: skill.type,
      };
    });

    const elasticRes = await elastic.skills.bulk({
      documents: batchedDocuments,
    });
    // console.log(`Indexed ${elasticRes} skills`);
  }
};

seed()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
