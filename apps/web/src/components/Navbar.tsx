"use client";
import ThemeToggle from "@/components/ui/theme-setter";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Route = ({
  href,
  tag,
  current,
}: {
  href: Url;
  tag: string;
  current: string;
}) => {
  return (
    <Link href={href}>
      <span
        className={cn("text-base font-semibold", {
          "text-foreground": current === href,
          "text-foreground/60": current !== href,
        })}
      >
        {tag}
      </span>
    </Link>
  );
};

export default function Navbar() {
  const currentRoute = usePathname();

  return (
    <div className="bg-background flex flex-row w-full py-4 px-24 justify-around items-center border-b border-solid">
      <div className="flex flex-row gap-10 items-center">
        <div className="flex flex-row items-center gap-2">
          <Users></Users>
          <h1 className="text-2xl font-semibold">SRMap</h1>
        </div>
        <Route href="/upload" tag="Upload" current={currentRoute} />
        <Route href="/ras" tag="RAS" current={currentRoute} />
        <Route href="/skills" tag="SKILLS" current={currentRoute} />
        {/* <Route href="/demand" tag="Demand" current={currentRoute} /> */}
      </div>
      <div className="flex flex-row w-full justify-end gap-4">
        <ThemeToggle></ThemeToggle>
      </div>
    </div>
  );
}
