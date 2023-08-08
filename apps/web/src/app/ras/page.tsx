"use client";
import Ras from "@/components/Ras";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState<{}>({});
  return (
    <div className="flex-grow flex flex-col justify-center items-center text-2xl">
      <Ras selected={selected} setSelected={setSelected}></Ras>
    </div>
  );
}
