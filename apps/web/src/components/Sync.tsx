"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/trpc";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Sync() {
  const { isLoading, error, data } = api.sync.useQuery();

  const ContentForLoading = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  };

  const ContentForError = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-red-500 font-bold pt-4">Error</div>
      </div>
    );
  };

  const Status = ({ tag, count }: { tag: string; count: number }) => {
    return (
      <div className="flex flex-row justify-start items-center gap-2">
        <div
          className={cn("w-2 h-2 rounded-full", {
            "bg-[#00ff00]": count > 0,
            "bg-[#ff0000]": count <= 0,
          })}
        ></div>
        {tag}
        <div
          className={cn("flex-grow text-end", {
            "text-[#00ff00]": count > 0,
            "text-[#ff0000]": count <= 0,
          })}
        >
          {count}
        </div>
      </div>
    );
  };

  return (
    <Card className="fixed bottom-0 right-0 m-4">
      <CardHeader className="flex flex-col justify-between items-center p-0 px-4 pt-4">
        <CardDescription>Data sync</CardDescription>
        <Separator orientation="horizontal" />
      </CardHeader>
      <CardContent className="w-full h-full flex p-4">
        {isLoading && <ContentForLoading></ContentForLoading>}
        {error && <ContentForError></ContentForError>}
        {data && (
          <div className="flex flex-col w-full h-full">
            <div className="text-primary">
              <Status tag={"Employees: "} count={data.ras} />
              <Status tag={"Projects: "} count={1234453} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
