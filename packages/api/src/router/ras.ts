// import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";

const helloSchema = z.object({
  name: z.string(),
});

export const userRouter = router({
  sayHello: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/user/sayHello",
        summary: "Say hello",
        description: "Say hello to the user",
        tags: ["user"],
      },
    })
    .input(helloSchema)
    .output(
      z.object({
        message: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        message: `Hello ${input.name}`,
      };
    }),
});
