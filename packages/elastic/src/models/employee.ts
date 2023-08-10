import type { Client } from "@elastic/elasticsearch";

export interface Employee {
  "Employee Code": string; // TODO: this might be a number, check
  "Employee Name": string;
  "RAS Status Group": string;
  Skill: string;
}

const properties = {
  "Employee Code": { type: "keyword" },
  "Employee Name": { type: "text" },
  "RAS Status Group": { type: "keyword" },
  Skill: { type: "text", analyzer: "englishAnalyzer" },
} as const;

export const indexName = "employees";

export const employees = (client: Client) => {
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
      documents: Employee[];
    }) => {
      const operations = documents.flatMap((doc) => [
        { index: { _index: indexName } },
        { ...doc, ownedBy },
      ]);

      const res = await client.bulk({ refresh: true, operations });
      // TODO: check for errors
      console.log(`Indexed ${res.items.length} documents for ${ownedBy}`);
      return res.items.length;
    },
    scroll: async ({
      ownedBy,
      size,
      from,
    }: {
      ownedBy: string;
      size: number;
      from: number;
    }) => {
      const res = await client.search<Employee>({
        index: indexName,
        size,
        from,
        body: {
          query: {
            bool: {
              must: [
                { term: { ownedBy } },
                {
                  bool: {
                    should: [
                      { term: { "RAS Status Group": "Bench - AFD" } },
                      { term: { "RAS Status Group": "Bench - Unproductive" } },
                    ],
                  },
                },
              ],
            },
          },
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
