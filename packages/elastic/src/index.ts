import { Client } from "@elastic/elasticsearch";
const client = new Client({ node: "http://localhost:9200" });
import { projects, indexName as projectIndex } from "./models/project";
import { employees, indexName as employeeIndex } from "./models/employee";

export const elastic = {
  projects: projects(client),
  employees: employees(client),
  sync: async ({ ownedBy }: { ownedBy: string }) => {
    const rasCount = await client.count({
      index: employeeIndex,
      body: { query: { term: { ownedBy } } },
    });
    const projectCount = await client.count({
      index: projectIndex,
      body: { query: { term: { ownedBy } } },
    });
    return {
      ras: rasCount.count,
      demand: projectCount.count,
    };
  },
};
