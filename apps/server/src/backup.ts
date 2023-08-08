import type { NextFunction, Request, RequestHandler, Response } from "express";
import express from "express";
import { createServer } from "http";
import { env } from "@srm/env";
import cors from "cors";
// import { memoryStorage } from "multer";
import multer from "multer";
import cookieParser from "cookie-parser";
import asyncHandler from "express-async-handler";
import {} from "express-async-handler";
import XLSX from "xlsx";

type AsyncRequestHandler = Parameters<typeof asyncHandler>[0];

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB is this enough? maybe...
  },
});

import { randomBytes } from "crypto";
import { employees, projects } from "./elastic";
import { parseDemand, parseRas } from "./utils/parser";
export const generateToken = (size = 64) => {
  return randomBytes(size).toString("hex");
};

const auth: AsyncRequestHandler = async (req, res, next) => {
  let token = req.cookies.token as string;
  if (!token) {
    console.log("no token, generating...");
    token = generateToken();
    console.log("generated token", token);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      // secure: env.NODE_ENV === "production",
      // sameSite: "strict",
    });
  }
  req.token = token;
  console.log("token before next", req.token);
  next();
};

const main = async () => {
  // ensure elastic indexes exist
  // TODO: handle fail
  await projects.index();
  await employees.index();

  const app = express();
  app.use(cors({ origin: "http://192.168.1.128:3000", credentials: true }));
  app.use(cookieParser());
  app.use((req, res, next) => {
    console.log(req.url);
    next();
  });

  app.get(
    "/ras",
    asyncHandler(auth),
    asyncHandler(async (req, res) => {
      const { query } = req;
      const { size, from } = query;

      const results = await employees.scroll({
        ownedBy: req.token,
        size: size ? parseInt(size as string) : 10,
        from: from ? parseInt(from as string) : 0,
      });

      res.send(results);
    })
  );

  app.get(
    "/demand",
    asyncHandler(auth),
    asyncHandler(async (req, res) => {
      const { query } = req;
      const { skills, size, from } = query;

      if (!skills) {
        res.send([]);
        return;
      }

      console.log(query);

      const results = await projects.scroll({
        ownedBy: req.token as string,
        query: skills as string,
        size: size ? parseInt(size as string) : 10,
        from: from ? parseInt(from as string) : 0,
      });

      res.send(results);
    })
  );

  app.get(
    "/sync",
    asyncHandler(auth),
    asyncHandler(async (req, res) => {
      console.log(req.token);
      res.send("Hello World");
    })
  );

  app.post(
    "/upload",
    asyncHandler(auth),
    upload.fields([
      { name: "ras", maxCount: 1 },
      { name: "demand", maxCount: 1 },
    ]),
    asyncHandler(async (req, res, next) => {
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (!files) {
        next(new Error("No file uploaded"));
        return;
      }

      const rasFile = files.ras ? files.ras[0] : undefined;
      const demandFile = files.demand ? files.demand[0] : undefined;

      if (!rasFile || !demandFile) {
        next(new Error("Missing or corrupt file."));
        return;
      }

      const rasData = parseRas(rasFile.buffer);
      const demandData = parseDemand(demandFile.buffer);

      console.log("attempting to bulk on ", req.token);

      employees.bulk({
        ownedBy: req.token,
        documents: rasData,
      });

      projects.bulk({
        ownedBy: req.token,
        documents: demandData,
      });

      res.send("ok");
    })
  );

  const server = createServer(app);
  server.listen(env.API_PORT, () => {
    console.log(`Server started on port ${env.API_PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
