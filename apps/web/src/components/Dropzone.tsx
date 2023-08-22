"use client";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { Send, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const Dropzone = ({
  file,
  setFile,
  title,
}: {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  title: string;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setFile(acceptedFiles[0]);
    },
    [setFile]
  );

  const {
    getRootProps: getRootPropsRas,
    getInputProps: getInputPropsRas,
    open: openRas,
  } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const trimTitle = (title: string) => {
    if (title.length > 15) {
      return `"${title.slice(0, 15)}..."`;
    }
    return `"${title}"`;
  };

  return (
    <div
      {...getRootPropsRas()}
      className="rounded-sm border border-dashed w-[350px] h-[250px] flex flex-col items-stretch"
    >
      <div className="flex flex-col h-full justify-center gap-2">
        <input {...getInputPropsRas()} />
        <span className="flex flex-row justify-center">
          <Upload />
        </span>
        <span className="text-center text-lg">
          Drag and drop your file here
        </span>
        <span className="text-center text-primary/90">or</span>
        <div className="flex flex-row justify-center">
          <Button type="button" onClick={openRas}>
            Browse files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
