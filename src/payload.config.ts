// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Media } from "./collections/Media";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // beforeSchemaInit: [
    //   ({ schema, adapter }) => {
    //     return {
    //       ...schema,
    //       tables: {
    //         ...schema.tables,
    //         users, // Add your existing tables here
    //         posts,
    //         teams,
    //         projects,
    //         apiKeys,
    //       },
    //     };
    //   },
    // ],
    pool: {
      connectionString: process.env.DATABASE_URI ?? "",
    },
    schemaName: "payload",
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
});
