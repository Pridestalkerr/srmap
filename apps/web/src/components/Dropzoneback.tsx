"use client";
import {
  useForm,
  Controller,
  FormSubmitHandler,
  SubmitHandler,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Dropzone = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control } = useForm();
  const [rasFile, setRasFile] = useState<File | null>(null);
  const [demandFile, setDemandFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDropRas = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setRasFile(acceptedFiles[0]);
  }, []);

  const onDropDemand = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setDemandFile(acceptedFiles[0]);
  }, []);

  const {
    getRootProps: getRootPropsRas,
    getInputProps: getInputPropsRas,
    open: openRas,
  } = useDropzone({
    onDrop: onDropRas,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });
  const {
    getRootProps: getRootPropsDemand,
    getInputProps: getInputPropsDemand,
    open: openDemand,
  } = useDropzone({
    onDrop: onDropDemand,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const onSubmit = useCallback(async () => {
    try {
      const formData = new FormData();
      if (rasFile) formData.append("ras", rasFile);
      if (demandFile) formData.append("demand", demandFile);
      setIsLoading(true);
      // setError(null);
      const response = await axios.post(
        "http://192.168.1.128:3333/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      } else {
        setError("Unknown error. Please refresh the page and try again.");
      }
    }
  }, [rasFile, demandFile]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full h-full flex-grow justify-center gap-8 py-2"
    >
      <div className="flex flex-row justify-around">
        <Controller
          name="ras"
          control={control}
          defaultValue={null}
          render={() => (
            <div>
              <div className="flex flex-row items-center gap-4">
                <Upload
                  className={cn("text-primary text-sm", {
                    "text-[#ff0000]": rasFile === null,
                    "text-[#00ff00]": rasFile !== null,
                  })}
                ></Upload>
                <h4 className="text-2xl font-light">Ras Sheet</h4>
              </div>
              <div
                {...getRootPropsRas()}
                className="rounded-sm px-16 py-24 border border-primary/15 border-solid gap-2 bg-primary-foreground"
              >
                <input {...getInputPropsRas()} />
                <p>Drag and drop your file here or</p>
                <Button type="button" onClick={openRas} className="w-full">
                  Upload a file
                </Button>
                {/* {rasFile && rasFile.name} */}
              </div>
              <p className="text-[#00ff00]">{rasFile && `"${rasFile.name}"`}</p>
            </div>
          )}
        />
        {/* <Separator orientation="vertical" /> */}
        <Controller
          name="demand"
          control={control}
          defaultValue={null}
          render={() => (
            <div>
              <div className="flex flex-row items-center gap-4">
                <Upload
                  className={cn("text-primary text-sm", {
                    "text-[#ff0000]": demandFile === null,
                    "text-[#00ff00]": demandFile !== null,
                  })}
                ></Upload>
                <h4 className="text-2xl font-light">Demand Sheet</h4>
              </div>
              <div
                {...getRootPropsDemand()}
                className="flex flex-col justify-center items-center rounded-sm px-16 py-24 border border-primary/15 border-solid gap-2 bg-primary-foreground"
              >
                <input {...getInputPropsDemand()} />
                <span className="text-center">
                  Drag and drop your file here or
                </span>
                <Button type="button" onClick={openDemand} className="w-full">
                  Upload a file
                </Button>
                {/* {demandFile && demandFile.name} */}
              </div>
              <p className="text-[#00ff00]">
                {demandFile && `"${demandFile.name}"`}
              </p>
            </div>
          )}
        />
      </div>

      {/* <button type="submit">Submit</button> */}
      {isLoading && <Loader2 className="h-10 w-10 animate-spin" />}
      <div className="flex flex-row justify-center">
        <Button
          type="submit"
          disabled={rasFile === null || demandFile === null}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Dropzone;
