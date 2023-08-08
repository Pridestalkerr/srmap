"use client";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-setter";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Dropzone from "@/components/Dropzone";
import { Users } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex flex-row w-full py-4 px-24 justify-around items-center border-b border-solid">
      <div className="flex flex-row gap-10 items-center">
        <div className="flex flex-row items-center gap-2">
          <Users></Users>
          <h1 className="text-2xl font-semibold">SRMap</h1>
        </div>
        <Link href="/ras">
          <h1 className="text-base font-semibold text-primary/80">RAS</h1>
        </Link>
        <h1 className="text-base font-semibold text-primary/80">DEMAND</h1>
      </div>

      <div className="flex flex-row w-full justify-end gap-4">
        <Dialog>
          <DialogTrigger>
            <Button variant="default">Upload</Button>
          </DialogTrigger>
          <DialogContent className="sm:min-w-[800px]">
            <DialogHeader>
              <DialogTitle>Upload Data</DialogTitle>
              <DialogDescription>
                No data for current session found. Please upload your Demand and
                Ras Sheets to continue.
              </DialogDescription>
            </DialogHeader>
            <Dropzone></Dropzone>
          </DialogContent>
        </Dialog>
        <ThemeToggle></ThemeToggle>
      </div>
    </div>
  );
}
