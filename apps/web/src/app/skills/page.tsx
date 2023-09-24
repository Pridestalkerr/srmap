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

const partition = (arr: any[], size: number, offset: number) => {
  let result = [];
  for (let i = offset; i < arr.length; i += size) {
    result.push(arr[i]);
  }
  return result;
};

export default function Home() {
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");

  const { data, refetch } = api.skills.categories.useQuery(void 0, {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const { data: skills, refetch: refetchSkills } = api.skills.skills.useQuery({
    from: 0,
    size: 10,
    query: "english language",
  });

  return (
    <div className="flex flex-row justify-center p-2 gap-2">
      <Card className="min-w-[300px]">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription className="flex flex-row gap-1">
            <Search width={18}></Search>
            <input placeholder="search for skills"></input>
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-scroll h-[600px]">
          <div className="flex flex-col gap-1">
            {data?.records.map((category) => (
              <Card className="w-[250px]" key={category.id}>
                <CardDescription>{category.name}</CardDescription>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Search for skills"
          value={skillSearchQuery}
          onChange={(event) => setSkillSearchQuery(event.target.value)}
          className="w-[350px]"
        >
          <SearchIcon width={18}></SearchIcon>
        </Input>
        <div className="masonry">
          {skills?.records.map((skill) => (
            <SkillCard
              key={skill.id}
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
          ))}
          {/* {skills &&
              partition(skills.records, 4, 0).map((skill) => (
                <SkillCard
                  key={skill.id}
                  name={skill.name}
                  category={
                    skill.category?.name === "NULL"
                      ? null
                      : skill.category?.name
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
              ))}
            {skills &&
              partition(skills.records, 4, 1).map((skill) => (
                <SkillCard
                  key={skill.id}
                  name={skill.name}
                  category={
                    skill.category?.name === "NULL"
                      ? null
                      : skill.category?.name
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
              ))}
          <div className="grid gap-4 overflow-hidden">
            {skills &&
              partition(skills.records, 4, 2).map((skill) => (
                <SkillCard
                  key={skill.id}
                  name={skill.name}
                  category={
                    skill.category?.name === "NULL"
                      ? null
                      : skill.category?.name
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
              ))}
            {skills &&
              partition(skills.records, 4, 3).map((skill) => (
                <SkillCard
                  key={skill.id}
                  name={skill.name}
                  category={
                    skill.category?.name === "NULL"
                      ? null
                      : skill.category?.name
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
              ))} */}
        </div>
      </div>
    </div>
  );
}
