"use client";
import Dropzone from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { byteValueNumberFormatter, cn, encodeFile, trim } from "@/lib/utils";
import { Trash, File } from "lucide-react";

export default function RasSync() {
  const title = "RAS";
  const subTitle = "Update or clear your RAS records";
  const path = api.ras;
  const upload = path.upload.useMutation();
  const count = path.count.useQuery();
  const clear = path.clear.useQuery(void 0, {
    enabled: false,
  });

  const [file, setFile] = useState<File | null>(null);

  const submitFile = () => {
    if (file !== null) {
      encodeFile(file)
        .then((encoded) => {
          upload.mutate({
            ras: encoded,
          });
        })
        .catch((error) => {
          console.error("Error encoding the file:", error);
          // You might want to handle this error more gracefully, maybe using another state variable.
        });
    } else {
      console.error("No file selected. This should not happen.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 relative")}>
      {true && (
        <div className="w-full h-full absolute">
          <span className="text-lg">Please wait...</span>
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            ds
          </svg>
        </div>
      )}
      <div
        className={cn("grid grid-cols-2", {
          "blur-lg": true,
        })}
      >
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm">{subTitle}</p>
          </div>
          <p className="text-medium">Live Records: {count.data?.count ?? 0}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <Dropzone
              file={file}
              setFile={setFile}
              title="Ras Sheet"
            ></Dropzone>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-end">
        <Button
          type="button"
          variant="destructive"
          onClick={() => clear.refetch()}
          disabled={count.data?.count === 0}
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
                {file === null
                  ? "No file selected"
                  : byteValueNumberFormatter.format(file.size)}
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
              onClick={() => submitFile()}
              disabled={file === null}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
