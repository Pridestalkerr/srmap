import { PlusIcon } from "lucide-react";

const CategoryOption = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-row gap-2 items-center justify-beginning w-auto">
      <PlusIcon className="w-4 h-4 shrink-0 grow-0" />
      <span className="text-sm flex-grow">{name}</span>
    </div>
  );
};

export default CategoryOption;
