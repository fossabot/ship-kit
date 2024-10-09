CREATE TABLE `todo-today_account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `todo-today_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todo-today_api_key` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`project_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `todo-today_project`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todo-today_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	`level` text NOT NULL,
	`message` text NOT NULL,
	`prefix` text,
	`emoji` text,
	`metadata` text,
	`api_key_id` text NOT NULL,
	FOREIGN KEY (`api_key_id`) REFERENCES `todo-today_api_key`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todo-today_project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`team_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `todo-today_team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todo-today_team_member` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`team_id` text NOT NULL,
	`role` text(50) NOT NULL,
	`joined_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `todo-today_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `todo-today_team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todo-today_team` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `todo-today_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`display_name` text(255),
	`primary_email` text(255) NOT NULL,
	`primary_email_verified` integer DEFAULT (unixepoch()),
	`profile_image_url` text(255),
	`signed_up_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `todo-today_account` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `todo-today_api_key_key_unique` ON `todo-today_api_key` (`key`);