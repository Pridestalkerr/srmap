"use client";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const Dropzone = ({
  file,
  setFile,
  title
}: {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  title: string
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

  return (
    <div>
      <div className="flex flex-row items-center gap-4">
        <Upload
          className={cn("text-primary text-sm", {
            "text-[#ff0000]": file === null,
            "text-[#00ff00]": file !== null,
          })}
        ></Upload>
        <h4 className="text-2xl font-light">{title}</h4>
      </div>
      <div
        {...getRootPropsRas()}
        className="flex flex-col rounded-sm px-16 py-24 border border-primary/15 border-solid gap-2 bg-primary-foreground"
      >
        <input {...getInputPropsRas()} />
        <span className="text-center">Drag and drop your file here or</span>
        <Button type="button" onClick={openRas} className="w-full">
          Upload a file
        </Button>
      </div>
      <p className="text-[#00ff00]">{file && `"${file.name}"`}</p>
    </div>
  );
};

export default Dropzone;
