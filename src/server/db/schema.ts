import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  sqliteTable,
  sqliteTableCreator,
  text
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `todo-today_${name}`);

// {{ Move users table above posts table }}
export const users = createTable("user", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey(),
  displayName: text("display_name", { length: 255 }),
  primaryEmail: text("primary_email", { length: 255 }).notNull(),
  primaryEmailVerified: int("primary_email_verified", { mode: "timestamp" })
    .default(sql`(unixepoch())`),
  profileImageUrl: text("profile_image_url", { length: 255 }),
  signedUpAt: int("signed_up_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const posts = createTable(
  "post",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    createdById: text("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }).$onUpdate(
      () => sql`(unixepoch())`, // Updated to return timestamp
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts), // {{ Add relation to posts }}
}));

export const accounts = createTable(
  "account",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const apiKeys = sqliteTable('api_keys', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  createdAt: text('created_at').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
});

export const logs = sqliteTable('logs', {
  id: int('id').primaryKey({ autoIncrement: true }),
  timestamp: text('timestamp').notNull(),
  level: text('level').notNull(),
  message: text('message').notNull(),
  prefix: text('prefix'),
  emoji: text('emoji'),
  metadata: text('metadata'), // Store as JSON string
  apiKeyId: text('api_key_id').notNull().references(() => apiKeys.id),
});

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
  logs: many(logs),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  apiKey: one(apiKeys, { fields: [logs.apiKeyId], references: [apiKeys.id] }),
}));
