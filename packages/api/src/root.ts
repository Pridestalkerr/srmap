import { userRouter } from "./router/ras";
import { syncRouter } from "./router/sync";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  sync: syncRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
