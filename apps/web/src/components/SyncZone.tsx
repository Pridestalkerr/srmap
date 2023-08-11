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

export default function SyncZone({
  title,
  subTitle,
  submit,
  submitDisabled,
  file,
  setFile,
}: {
  title: string;
  subTitle: string;
  submit: () => void;
  submitDisabled: boolean;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const Status = ({ tag, count }: { tag: string; count: number }) => {
    return (
      <div className="flex flex-row justify-start items-center gap-2">
        <div
          className={cn("w-2 h-2 rounded-full", {
            "bg-[#00ff00]": count > 0,
            "bg-[#ff0000]": count <= 0,
          })}
        ></div>
        {tag}
        <div
          className={cn("flex-grow text-end", {
            "text-[#00ff00]": count > 0,
            "text-[#ff0000]": count <= 0,
          })}
        >
          {count}
        </div>
      </div>
    );
  };

  const [minWidth, setMinWidth] = useState(0);
  const secondDivRef = useRef(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm">{subTitle}</p>
          </div>
          <p className="text-medium">Live Records: 1285</p>
          <p className="text-medium">Uploaded on 8/11/2023</p>
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
          onClick={submit}
          disabled={submitDisabled}
        >
          Clear
        </Button>
        <div className="flex flex-col">
          <p className="text-sm">No file selected</p>
          <Button type="button" onClick={submit} disabled={submitDisabled}>
            Submit
          </Button>
        </div>
      </div>
    </div>
    // <Card>
    //   <CardHeader className="flex flex-row justify-between align-start space-y-0">
    //     <div>
    //       <CardTitle>{title}</CardTitle>
    //       <CardDescription>{subTitle}</CardDescription>
    //     </div>
    //     <Button
    //       type="button"
    //       variant="destructive"
    //       onClick={submit}
    //       disabled={submitDisabled}
    //     >
    //       Clear
    //     </Button>
    //   </CardHeader>
    //   <CardContent className="flex flex-col gap-4">
    //     <div className="flex flex-row justify-between align-center">
    //       <div className="flex flex-col gap-2">
    //         <p>Live Records: 333</p>
    //       </div>
    //     </div>
    //     {/* <Separator orientation="horizontal" /> */}
    //     <Dropzone file={file} setFile={setFile} title="Demand Sheet"></Dropzone>
    //     <Button type="button" onClick={submit} disabled={submitDisabled}>
    //       Submit
    //     </Button>
    //   </CardContent>
    // </Card>
  );
}
