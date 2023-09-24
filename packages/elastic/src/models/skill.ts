import type { Client } from "@elastic/elasticsearch";

export interface Skill {
  id: string;
  emsiId: string;
  name: string;
  infoUrl: string | null;
  description: string | null;
  descriptionSource: string | null;
  isLanguage: boolean;
  isSoftware: boolean;
  category: {
    id: string;
    name: string;
  } | null;
  subcategory: {
    id: string;
    name: string;
  } | null;
  type: "ST0" | "ST1" | "ST2" | "ST3" | null;
}

const properties = {
  id: { type: "keyword" },
  emsiId: { type: "keyword" },
  name: { type: "text", analyzer: "englishAnalyzer" },
  infoUrl: { type: "keyword" },
  description: { type: "keyword" },
  descriptionSource: { type: "keyword" },
  isLanguage: { type: "boolean" },
  isSoftware: { type: "boolean" },

  category: {
    properties: {
      id: { type: "keyword" },
      name: { type: "keyword" },
    },
  },
  subcategory: {
    properties: {
      id: { type: "keyword" },
      name: { type: "keyword" },
    },
  },
  type: { type: "keyword" },
} as const;

export const indexName = "skills";

export const skills = (client: Client) => {
  return {
    index: async () => {
      const exists = await client.indices.exists({ index: indexName });
      if (exists) {
        console.log("index already created, skipping...");
        return;
      }

      const result = await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              // no need since public
              // ownedBy: { type: "keyword" },
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

      console.log(result);
    },
    bulk: async ({ documents }: { documents: Skill[] }) => {
      const operations = documents.flatMap((doc) => [
        { index: { _index: indexName } },
        { ...doc },
      ]);

      const res = await client.bulk({ refresh: true, operations });
      console.log(`Indexed ${res.items.length} ${indexName}`);
      console.log(res.items[0]?.index?.error);
      return res.items.length;
    },
    scroll: async ({
      query,
      size,
      from,
    }: {
      query: string;
      size: number;
      from: number;
    }) => {
      const res = await client.search<Skill>({
        index: indexName,
        body: {
          query: {
            match: {
              name: { query: query, fuzziness: "AUTO" },
            },
          },
          sort: [{ _score: { order: "desc" } }],
        },
        size,
        from,
        highlight: {
          fields: {
            name: { type: "unified" },
          },
          pre_tags: ["[[HIGHLIGHT]]"],
          post_tags: ["[[/HIGHLIGHT]]"],
        },
      });

      let total = 0;
      if (res.hits.total instanceof Object) {
        total = res.hits.total.value;
      } else {
        total = res.hits.total ?? 0;
      }

      console.log("scroll value: ", total, res?.hits.hits[0]);

      return {
        documents: res?.hits.hits.map((hit) => ({
          ...hit._source,
          highlights: hit.highlight,
          score: hit._score,
        })),
        total,
      };
    },
    clear: async () => {
      const res = await client.deleteByQuery({
        index: indexName,
        body: {
          query: {
            match_all: {},
          },
        },
      });
      await client.indices.delete({
        index: indexName,
      });
      return res.deleted;
    },
    count: async () => {
      const res = await client.count({
        index: indexName,
      });
      return res.count;
    },
  };
};
