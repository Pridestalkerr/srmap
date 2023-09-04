import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const trim = (title: string, length: number = 15) => {
  if (title.length > length) {
    return `${title.slice(0, length)}...`;
  }
  return `${title}`;
};

export const encodeFile = (file: File) => {
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

export const byteValueNumberFormatter = Intl.NumberFormat("en", {
  notation: "compact",
  style: "unit",
  unit: "byte",
  unitDisplay: "narrow",
});
