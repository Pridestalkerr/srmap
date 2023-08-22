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
  const { isLoading, error, data } = api.sync.useQuery();

  const {
    data: rasClearData,
    refetch: rasClearRefetch,
    error: rasClearError,
    isLoading: rasClearLoading,
  } = api.ras.clear.useQuery(void 0, {
    enabled: false,
  });
  const {
    data: demandClearData,
    refetch: demandClearRefetch,
    error: demandClearError,
    isLoading: demandClearLoading,
  } = api.demand.clear.useQuery(void 0, {
    enabled: false,
  });

  type x = typeof api.demand.clear;

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
            recordCount={data?.ras ?? 0}
            clear={() => {
              rasClearRefetch();
            }}
            path={api.ras}
          ></SyncZone>

          <Separator orientation="horizontal"></Separator>

          <SyncZone
            title="Demand"
            subTitle="Update or Clear your Demand records."
            path={api.demand}
            submit={() => {
              demandUpload.mutate({
                demand: demandBase64 as string, // TODO: fix this
              });
            }}
            submitDisabled={demandFile === null}
            file={demandFile}
            setFile={setDemandFile}
            recordCount={data?.demand ?? 0}
            clear={() => {
              demandClearRefetch();
            }}
          ></SyncZone>
        </CardHeader>
      </Card>
    </div>
  );
}
