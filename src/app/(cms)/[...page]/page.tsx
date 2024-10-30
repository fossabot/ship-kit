// Example file structure, app/[...page]/page.tsx
// You could alternatively use src/app/[...page]/page.tsx
import { RenderBuilderContent } from "@/app/(cms)/_components/builder-io";
import { builderInit } from "@/lib/builder-io";

import "@/styles/builder-io.css";

const builder = builderInit();

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

export default async function Page(props: PageProps) {
  if (!builder) {
    return <div>Builder is not initialized</div>;
  }

  const model = "page";
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + ((await props?.params)?.page?.join("/") || ""),
      },
      // Set prerender to false to return JSON instead of HTML
      prerender: false,
    })
    // Convert the result to a promise
    .toPromise();

  return (
    <>
      <div className="prose mx-auto w-full py-header">
        {/* Render the Builder page */}
        <RenderBuilderContent content={content} model={model} />
      </div>
    </>
  );
}
