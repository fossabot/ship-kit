import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  sqliteTableCreator,
  text
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = sqliteTableCreator((name) => `todo-today_${name}`);

export const users = createTable("user", {
  id: text("id", { length: 255 }).notNull().primaryKey(),
  displayName: text("display_name", { length: 255 }),
  primaryEmail: text("primary_email", { length: 255 }).notNull(),
  primaryEmailVerified: int("primary_email_verified", { mode: "boolean" }).notNull().default(false),
  profileImageUrl: text("profile_image_url", { length: 255 }),
  signedUpAt: int("signed_up_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const teams = createTable("team", {
  id: text("id").notNull().primaryKey(),
  name: text("name", { length: 255 }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const projects = createTable("project", {
  id: text("id").notNull().primaryKey(),
  name: text("name", { length: 255 }).notNull(),
  teamId: text("team_id").notNull().references(() => teams.id),
  createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const teamMembers = createTable("team_member", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  teamId: text("team_id").notNull().references(() => teams.id),
  role: text("role", { length: 50 }).notNull(), // e.g., 'owner', 'admin', 'member'
  joinedAt: int("joined_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const apiKeys = createTable('api_key', {
  id: text('id').notNull().primaryKey(),
  key: text('key').notNull().unique(),
  projectId: text('project_id'), // Allow null values
  createdAt: int('created_at', { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  expiresAt: int('expires_at', { mode: "timestamp" }),
});

export const logs = createTable('log', {
  id: int('id').primaryKey({ autoIncrement: true }),
  timestamp: int('timestamp', { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  level: text('level').notNull(),
  message: text('message').notNull(),
  prefix: text('prefix'),
  emoji: text('emoji'),
  metadata: text('metadata'), // Store as JSON string
  apiKeyId: text('api_key_id').notNull().references(() => apiKeys.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  accounts: many(accounts),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
  apiKeys: many(apiKeys),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  project: one(projects, { fields: [apiKeys.projectId], references: [projects.id] }),
  logs: many(logs),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  apiKey: one(apiKeys, { fields: [logs.apiKeyId], references: [apiKeys.id] }),
}));

// Existing tables (accounts, sessions, verificationTokens) remain unchanged
export const accounts = createTable(
  "account",
  {
    userId: text("user_id", { length: 255 }).notNull().references(() => users.id),
    type: text("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
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
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const projectMembers = createTable('project_member', {
  id: text('id').notNull().primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role', { enum: ['owner', 'admin', 'member'] }).notNull(),
});

export const projectRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
}));

export const userRelations = relations(users, ({ many }) => ({
  projectMemberships: many(projectMembers),
}));

export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
  project: one(projects, {
    fields: [apiKeys.projectId],
    references: [projects.id],
  }),
}));
