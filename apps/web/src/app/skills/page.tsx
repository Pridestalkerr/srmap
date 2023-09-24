"use client";
import { api } from "@/lib/trpc";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge"

import {
  Search,
  TerminalSquare,
  Languages,
  HelpCircle,
  SearchIcon,
} from "lucide-react";
import SkillCard from "@/components/SkillCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import Masonry from "react-masonry-css";
import CategoryOption from "@/components/CategoryOption";

export default function Home() {
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>("");

  const { data, refetch } = api.skills.categories.useQuery(void 0, {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const { data: skills, refetch: refetchSkills } = api.skills.skills.useQuery({
    from: 0,
    size: 9,
    query: skillSearchQuery,
  });

  return (
    <div className="flex flex-row justify-center p-2 gap-4">
      <div className="flex flex-col gap-2">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-row gap-1">
              <Input
                placeholder="Search for categories"
                value={categorySearchQuery}
                onChange={(event) => setCategorySearchQuery(event.target.value)}
              >
                <SearchIcon width={18}></SearchIcon>
              </Input>
            </div>
            <div className="flex flex-col p-2 gap-2 h-48 overflow-y-scroll rounded-md border border-input">
              {data?.records
                .filter((category) => !category.isSubcategory)
                .map((category) => (
                  <CategoryOption
                    key={category.id}
                    name={category.name}
                  ></CategoryOption>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="w-80">
          <CardHeader>
            <CardTitle>Subcategories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-row gap-1">
              <Input
                placeholder="Search for subcategories"
                value={categorySearchQuery}
                onChange={(event) => setCategorySearchQuery(event.target.value)}
              >
                <SearchIcon width={18}></SearchIcon>
              </Input>
            </div>
            <div className="flex flex-col p-2 gap-2 h-48 overflow-y-scroll rounded-md border border-input">
              {data?.records
                .filter((category) => category.isSubcategory)
                .map((category) => (
                  <CategoryOption
                    key={category.id}
                    name={category.name}
                  ></CategoryOption>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 items-end">
        <Input
          placeholder="Search for skills"
          value={skillSearchQuery}
          onChange={(event) => setSkillSearchQuery(event.target.value)}
        >
          <SearchIcon width={18}></SearchIcon>
        </Input>

        <Masonry
          breakpointCols={3}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {skills?.records.map((skill) => (
            <div key={skill.id}>
              <SkillCard
                name={skill.name}
                category={
                  skill.category?.name === "NULL" ? null : skill.category?.name
                }
                subcategory={
                  skill.subcategory?.name === "NULL"
                    ? null
                    : skill.subcategory?.name
                }
                isLanguage={skill.isLanguage}
                isSoftware={skill.isSoftware}
                type={skill.type}
                description={skill.description}
                descriptionUrl={skill.descriptionSource}
              ></SkillCard>
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
}
