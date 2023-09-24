"use client";
import Dropzone from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc";
// import Separator from "@/components/ui/separator"
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash, File } from "lucide-react";

const trim = (title: string, length: number = 15) => {
  if (title.length > length) {
    return `${title.slice(0, length)}...`;
  }
  return `${title}`;
};

export default function SyncZone({
  title,
  subTitle,
  submit,
  submitDisabled,
  file,
  setFile,
  recordCount,
  clear,
  variant,
}: {
  title: string;
  subTitle: string;
  submit: () => void;
  submitDisabled: boolean;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  recordCount: number;
  clear: () => void;
  variant: "ras" | "demand";
}) {
  const path = variant === "ras" ? api.ras : api.demand;
  const upload = path.upload.useMutation();
  const count = variant === "ras" ? api.ras.count.useQuery() : api.demand.count.useQuery();

  return (
    <div
      className={cn("flex flex-col gap-2", {
        "blur-lg": submitDisabled,
      })}
    >
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm">{subTitle}</p>
          </div>
          <p className="text-medium">Live Records: {recordCount}</p>
          {/* <p className="text-medium">Uploaded on 8/11/2023</p> */}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <Dropzone
              file={file}
              setFile={setFile}
              title="Demand Sheet"
            ></Dropzone>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-end">
        <Button
          type="button"
          variant="destructive"
          onClick={clear}
          disabled={recordCount === 0}
        >
          Clear
        </Button>
        <div className="flex flex-row gap-2 w-[350px]">
          <div className="flex flex row border border-solid flex-grow items-center gap-2">
            <div className="bg-muted h-full flex flex-row items-center px-2">
              <File className="" />
            </div>
            <div className="flex flex-col flex-grow">
              <p className="text-sm">
                {file === null ? "No file selected" : trim(file.name)}
              </p>
              <p className="text-xs text-primary/80">
                {file === null ? "No file selected" : file.size / 1000 + " KB"}
              </p>
            </div>
            <Button
              className="px-2"
              variant="ghost"
              disabled={file === null}
              onClick={() => {
                setFile(null);
              }}
            >
              <Trash />
            </Button>
          </div>
          <div className="flex flex-col">
            <Button
              type="button"
              className="flex-grow"
              onClick={submit}
              disabled={submitDisabled}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
