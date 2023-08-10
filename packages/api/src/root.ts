import { rasRouter } from "./router/ras";
import { demandRouter } from "./router/demand";
import { syncRouter } from "./router/sync";
import { router } from "./trpc";

export const appRouter = router({
  ras: rasRouter,
  demand: demandRouter,
  sync: syncRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
