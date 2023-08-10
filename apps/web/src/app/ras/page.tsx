"use client";
import Demand from "@/components/Demand";
import Ras from "@/components/Ras";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";

export default function Home() {
  const [selected, setSelected] = useState<{} | null>(null);
  const [open, setOpen] = useState(false);
  const [skill, setSkill] = useState<string>("");
  const [additionalSkills, setAdditionalSkills] = useState<string>();

  useEffect(() => {
    console.log("selected: ", selected);
    if (selected) {
      setSkill(selected["Skill"]);
    }
  }, [selected]);

  useEffect(() => {
    if (skill !== "") {
      setOpen(true);
    }
  }, [skill]);

  const refinedSkills = useMemo(() => {
    return skill + " " + additionalSkills;
  }, [skill, additionalSkills]);

  return (
    // <div className="relative flex-grow">
    <div className="relative flex-grow flex flex-col justify-center items-center text-2xl">
      <Drawer.Root shouldScaleBackground open={open}>
        <Drawer.Trigger></Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Portal>
          <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-primary-foreground rounded-t-[10px] flex-1 flex flex-col gap-8 w-full">
              <div className="flex flex-row justify-between items-start">
                <div className="flex flex-col gap-2 flex-grow">
                  <span className="text-2xl font-bold">
                    {selected ? selected["Employee Name"] : ""}
                  </span>
                  {/* Refine Search
                  <Input></Input> */}
                </div>
                <div className="">
                  <button type="button" onClick={() => setOpen(false)}>
                    <X />
                  </button>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col flex-grow">
                  <span className="text-sm">
                    Employee Code:{" "}
                    <span className="text-lg">
                      {selected ? selected["Employee Code"] : ""}
                    </span>
                  </span>
                  <span className="text-sm">
                    Primary Skill: <span className="text-xl">{skill}</span>
                  </span>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="text-sm">Refine Search</span>
                  <Input
                    value={additionalSkills}
                    onChange={(event) =>
                      setAdditionalSkills(event.target.value)
                    }
                    placeholder="...with Java and Azure"
                  ></Input>
                </div>
              </div>
              <div className="w-full flex flex-col gap-8">
                <Demand skills={refinedSkills}></Demand>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <Ras selected={selected} setSelected={setSelected}></Ras>
    </div>
    // </div>
  );
}
