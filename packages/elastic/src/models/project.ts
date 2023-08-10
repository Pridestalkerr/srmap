import type { Client } from "@elastic/elasticsearch";

export interface Project {
  "Auto req ID": string;
  "SR Number": string;
  "Reporting Manager [vReportingManager1]": string;
  "Reqisition Status": string;
  Recruiter: string;
  "Primary Skill": string;
  "Customer Name": string;
  Designation: string;
  "Experience [iExperienceId]": string;
  "Job Description": string;
  "Job Description (Posting) [JD_ForPosting]": string;
  "Band [iBandId]": string;
  Country: string;
}

const properties = {
  "Auto req ID": { type: "keyword" },
  "SR Number": { type: "keyword" },
  "Reporting Manager [vReportingManager1]": { type: "text" },
  "Reqisition Status": { type: "keyword" },
  Recruiter: { type: "text" },
  "Primary Skill": { type: "text", analyzer: "englishAnalyzer" },
  "Customer Name": { type: "text" },
  Designation: { type: "text" },
  "Experience [iExperienceId]": { type: "text" },
  "Job Description": { type: "text", analyzer: "englishAnalyzer" },
  "Job Description (Posting) [JD_ForPosting]": {
    type: "text",
    analyzer: "englishAnalyzer",
  },
  "Band [iBandId]": { type: "keyword" },
  Country: { type: "keyword" },
} as const;

export const indexName = "projects";

export const projects = (client: Client) => {
  return {
    index: async () => {
      const exists = await client.indices.exists({ index: indexName });
      if (exists) {
        return;
      }

      const result = await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              ownedBy: { type: "keyword" },
              ...properties,
            },
          },
          settings: {
            analysis: {
              analyzer: {
                englishAnalyzer: {
                  type: "standard",
                  stopwords: "_english_",
                },
              },
            },
          },
        },
      });
      result.acknowledged;
    },
    bulk: async ({
      ownedBy,
      documents,
    }: {
      ownedBy: string;
      documents: Project[];
    }) => {
      const operations = documents.flatMap((doc) => [
        { index: { _index: indexName } },
        { ...doc, ownedBy },
      ]);

      const res = await client.bulk({ refresh: true, operations });
      // TODO: check for errors
      console.log(`Indexed ${res.items.length} ${indexName} for ${ownedBy}`);
      return res.items.length;
    },
    scroll: async ({
      ownedBy,
      query,
      size,
      from,
    }: {
      ownedBy: string;
      query: string;
      size: number;
      from: number;
    }) => {
      const res = await client.search<Project>({
        index: indexName,
        size,
        from,
        body: {
          query: {
            bool: {
              must: [
                { term: { ownedBy } },
                {
                  multi_match: {
                    query,
                    fields: ["Primary Skill", "Job Description"],
                    fuzziness: "AUTO",
                  },
                },
              ],
            },
          },
          sort: [{ _score: { order: "desc" } }],
        },
      });

      let total = 0;
      if (res.hits.total instanceof Object) {
        total = res.hits.total.value;
      } else {
        total = res.hits.total || 0;
      }

      return {
        documents: res?.hits.hits.map((hit) => ({
          ...hit._source,
          score: hit._score,
        })),
        total,
      };
    },
  };
};
