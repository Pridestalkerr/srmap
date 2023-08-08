import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@srm/api";

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@srm/api";
