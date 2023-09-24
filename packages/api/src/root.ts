import { rasRouter } from "./router/ras";
import { demandRouter } from "./router/demand";
import { syncRouter } from "./router/sync";
import { router } from "./trpc";
import { skillsRouter } from "./router/skills";

export const appRouter = router({
  ras: rasRouter,
  demand: demandRouter,
  sync: syncRouter,
  skills: skillsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
