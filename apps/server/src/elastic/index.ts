import { Client } from "@elastic/elasticsearch";
const client = new Client({ node: "http://localhost:9200" });

interface Project {
  //   ownedBy: string;
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

interface Employee {
  //   ownedBy: string;
  "Employee Code": string;
  "Employee Name": string;
  "RAS Status Group": string;
  Skill: string;
}

export const projects = {
  index: async () => {
    const indexName = "projects";
    const exists = await client.indices.exists({ index: indexName });

    if (!exists) {
      const result = await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              ownedBy: { type: "keyword" },
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
    }
  },
  insert: async (document: Project) => {
    const result = await client.index({
      index: "projects",
      document,
    });
    console.log("Indexed document:", result);
  },
  bulk: async ({
    ownedBy,
    documents,
  }: {
    ownedBy: string;
    documents: Project[];
  }) => {
    const operations = documents.flatMap((doc) => [
      { index: { _index: "projects" } },
      { ...doc, ownedBy },
    ]);

    const res = await client.bulk({ refresh: true, operations });
    const total = await client.count({ index: "projects" });
    return total.count;
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
    const res = await client.search({
      index: "projects",
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
        sort: [
          {
            _score: {
              order: "desc",
            },
          },
        ],
      },
    });
    return {
      documents: res?.hits.hits.map((hit) => {
        return {
          ...hit._source,
          score: hit._score,
        };
      }),
      total: res?.hits.total.value,
    };
  },
};

export const employees = {
  index: async () => {
    const indexName = "employees";
    const exists = await client.indices.exists({ index: indexName });

    if (!exists) {
      const result = await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              ownedBy: { type: "keyword" },
              "Employee Code": { type: "keyword" },
              "Employee Name": { type: "text" },
              "RAS Status Group": { type: "keyword" },
              Skill: { type: "text", analyzer: "englishAnalyzer" },
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
    }
  },
  insert: async (document: Employee) => {
    const result = await client.index({
      index: "employees",
      document,
    });
    console.log("Indexed document:", result);
  },
  bulk: async ({
    ownedBy,
    documents,
  }: {
    ownedBy: string;
    documents: Employee[];
  }) => {
    const operations = documents.flatMap((doc) => [
      { index: { _index: "employees" } },
      { ...doc, ownedBy },
    ]);

    const res = await client.bulk({ refresh: true, operations });
    const total = await client.count({ index: "employees" });
    console.log("inserted: ", res.items.length);
    return total.count;
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
    const res = await client.search({
      index: "employees",
      size,
      from,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  ownedBy,
                },
              },
              {
                bool: {
                  should: [
                    {
                      term: {
                        "RAS Status Group": "Bench - AFD",
                      },
                    },
                    {
                      term: {
                        "RAS Status Group": "Bench - Unproductive",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    });
    return {
      documents: res?.hits.hits.map((hit) => {
        return {
          ...hit._source,
          score: hit._score,
        };
      }),
      total: res?.hits.total.value,
    };
  },
};
