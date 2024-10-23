import { type SearchParams } from "@/types/utils";

// Takes a SearchParams object and returns a string of key-value pairs to be used in a URL
export const encodeSearchParams = (searchParams?: SearchParams) => {
  if (!searchParams) {
    return "";
  }

  return new URLSearchParams(
    Object.entries(searchParams).flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => [key, v])
        : [[key, String(value.toString)]],
    ),
  ).toString();
};
