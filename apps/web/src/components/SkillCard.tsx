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
import { Search, TerminalSquare, Languages, HelpCircle } from "lucide-react";
import TruncatedParagraph from "./ReadMoreParagraph";
import WikipediaIcon from "./Wikipedia";

const ST = (val: string) => {
  if (val === "ST1") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Specialized Skill</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {
                'Skills that are primarily required within a subset of occupations or equip one to perform a specific task (e.g. "NumPy" or "Hotel Management"). Also known as technical skills or specialized skills.'
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (val === "ST2") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Common Skill</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {
                'Skills that are prevalent across many different occupations and industries, including both personal attributes and learned skills. (e.g. "Communication" or "Microsoft Excel"). Also known as soft skills, human skills, and competencies.'
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (val === "ST3") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Certification</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {
                "Certification skills are recognizable qualification standards assigned by industry or education bodies."
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return null;
  }
};

const softwareTag = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TerminalSquare />
        </TooltipTrigger>
        <TooltipContent>
          <p>Software</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const languageTag = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Languages />
        </TooltipTrigger>
        <TooltipContent>
          <p>Language</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const otherTag = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle />
        </TooltipTrigger>
        <TooltipContent>
          <p>Other</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const displayTag = ({
  isLanguage,
  isSoftware,
}: {
  isLanguage: boolean;
  isSoftware: boolean;
}) => {
  if (isLanguage) {
    return languageTag();
  } else if (isSoftware) {
    return softwareTag();
  } else {
    return otherTag();
  }
};

const SkillCard = ({
  name,
  category,
  subcategory,
  isLanguage,
  isSoftware,
  type,
  description,
  descriptionUrl,
}: {
  name: string | undefined | null;
  category: string | undefined | null;
  subcategory: string | undefined | null;
  isLanguage: boolean | undefined | null;
  isSoftware: boolean | undefined | null;
  type: string | undefined | null;
  description: string | undefined | null;
  descriptionUrl: string | undefined | null;
}) => {
  return (
    <Card className="max-w-[350px]">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between">
            <span>{name}</span>
            <span>
              {displayTag({
                isLanguage: isLanguage!,
                isSoftware: isSoftware!,
              })}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col">
            <span>{category ?? "No Category"}</span>
            <span>{subcategory ?? "No Subcategory"}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <TruncatedParagraph text={description}></TruncatedParagraph>
        </CardDescription>
      </CardContent>
      <CardFooter className="text-sm flex flex-row justify-between">
        <span>{ST(type!)}</span>
        {descriptionUrl && (
          <WikipediaIcon href={descriptionUrl}></WikipediaIcon>
        )}
      </CardFooter>
    </Card>
  );
};

export default SkillCard;
