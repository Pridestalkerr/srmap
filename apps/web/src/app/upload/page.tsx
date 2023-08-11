"use client";
import Dropzone from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc";
// import Separator from "@/components/ui/separator"
import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SyncZone from "@/components/SyncZone";

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
    <div className="flex-grow flex flex-col justify-around items-center p-4">
      <Card>
        <CardHeader className="flex flex-col gap-4">
          <SyncZone
            title="RAS"
            subTitle="Update or Clear your RAS records."
            submit={() => {
              rasUpload.mutate({
                ras: rasBase64 as string, // TODO: fix this
              });
            }}
            submitDisabled={rasFile === null}
            file={rasFile}
            setFile={setRasFile}
          ></SyncZone>

          <Separator orientation="horizontal"></Separator>

          <SyncZone
            title="Demand"
            subTitle="Update or Clear your Demand records."
            submit={() => {
              demandUpload.mutate({
                demand: demandBase64 as string, // TODO: fix this
              });
            }}
            submitDisabled={demandFile === null}
            file={demandFile}
            setFile={setDemandFile}
          ></SyncZone>
        </CardHeader>
      </Card>

      {/* <div className="flex flex-col justify-center items-center gap-4">
        <h1>Demand</h1>
        <Dropzone
          file={demandFile}
          setFile={setDemandFile}
          title="Demand Sheet"
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
          Submit
        </Button>
        {demandUpload.isLoading && <p>Uploading...</p>}
        {demandUpload.isSuccess && (
          <p>Uploaded {demandUpload.data.inserted} Documents!</p>
        )}
      </div> */}
    </div>
  );
}
