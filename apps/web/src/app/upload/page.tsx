"use client";
import Dropzone from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc";
// import Separator from "@/components/ui/separator"
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState<{}>({});
  const [rasFile, setRasFile] = useState<File | null>(null);
  const [demandFile, setDemandFile] = useState<File | null>(null);
  const [rasBase64, setRasBase64] = useState<string | null>(null);
  const [demandBase64, setDemandBase64] = useState<string | null>(null);
  const [rasStatus, setRasStatus] = useState<number | null>(null);
  const [demandStatus, setDemandStatus] = useState<number | null>(null);

  // encode the file to a base64 string
  const encodeFile = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const encoded = reader.result?.toString().replace(/^data:(.*,)?/, "");
        if (encoded) {
          resolve(encoded);
        } else {
          reject("Error encoding file");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (rasFile) {
      encodeFile(rasFile)
        .then((encoded) => setRasBase64(encoded))
        .catch((error) => {
          console.error("Error encoding the file:", error);
          // You might want to handle this error more gracefully, maybe using another state variable.
        });
    } else {
      setRasBase64(null);
    }
  }, [rasFile]);

  useEffect(() => {
    if (demandFile) {
      encodeFile(demandFile)
        .then((encoded) => setDemandBase64(encoded))
        .catch((error) => {
          console.error("Error encoding the file:", error);
          // You might want to handle this error more gracefully, maybe using another state variable.
        });
    } else {
      setDemandBase64(null);
    }
  }, [demandFile]);

  const rasUpload = api.ras.upload.useMutation({});
  const demandUpload = api.demand.upload.useMutation({});

  return (
    <div className="flex-grow flex flex-row justify-around items-center">
      <div className="flex flex-col justify-center items-center gap-4">
        <Dropzone
          file={rasFile}
          setFile={setRasFile}
          title="RAS Sheet"
        ></Dropzone>
        <Button
          type="button"
          onClick={() => {
            rasUpload.mutate({
              ras: rasBase64 as string, // TODO: fix this
            });
          }}
          disabled={rasFile === null}
        >
          {rasFile === null ? "Select a file" : `Upload "${rasFile.name}"`}
        </Button>
        {rasUpload.isLoading && <p>Uploading...</p>}
        {rasUpload.isSuccess && (
          <p>Uploaded {rasUpload.data.inserted} Documents!</p>
        )}
      </div>

      {/* <Separator orientation="vertical"></Separator> */}
      <div className="flex flex-col justify-center items-center gap-4">
        <Dropzone
          file={demandFile}
          setFile={setDemandFile}
          title="RAS Sheet"
        ></Dropzone>
        <Button
          type="button"
          onClick={() => {
            demandUpload.mutate({
              demand: demandBase64 as string, // TODO: fix this
            });
          }}
          disabled={demandFile === null}
        >
          {demandFile === null
            ? "Select a file"
            : `Upload "${demandFile.name}"`}
        </Button>
        {demandUpload.isLoading && <p>Uploading...</p>}
        {demandUpload.isSuccess && (
          <p>Uploaded {demandUpload.data.inserted} Documents!</p>
        )}
      </div>
    </div>
  );
}
