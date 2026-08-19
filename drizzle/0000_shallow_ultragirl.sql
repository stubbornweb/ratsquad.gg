CREATE TABLE `event_rsvps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`member_id` text,
	`apollo_raw_name` text NOT NULL,
	`status` text NOT NULL,
	`imported_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `event_rsvps_event_idx` ON `event_rsvps` (`event_id`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`apollo_message_link` text NOT NULL,
	`apollo_message_id` text NOT NULL,
	`date` integer NOT NULL,
	`published_at` integer,
	`discord_message_id` text
);
--> statement-breakpoint
CREATE TABLE `member_aliases` (
	`alias` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `member_roles` (
	`member_id` text NOT NULL,
	`role` text NOT NULL,
	`preference` integer,
	PRIMARY KEY(`member_id`, `role`),
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_roles_preference_idx` ON `member_roles` (`member_id`,`preference`);--> statement-breakpoint
CREATE INDEX `member_roles_role_idx` ON `member_roles` (`role`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`callsign` text NOT NULL,
	`rank` text NOT NULL,
	`roles_synced_at` integer,
	`steam_id` text,
	`direction_primary` text,
	`direction_secondary` text,
	`birth_day` integer,
	`birth_month` integer,
	`birth_year` integer,
	`is_left` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `members_birthday_idx` ON `members` (`birth_month`,`birth_day`);--> statement-breakpoint
CREATE INDEX `members_is_left_idx` ON `members` (`is_left`);--> statement-breakpoint
CREATE TABLE `rounds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`ordinal` integer NOT NULL,
	`faction` text NOT NULL,
	`layer` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `rounds_event_idx` ON `rounds` (`event_id`);--> statement-breakpoint
CREATE TABLE `slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`squad_id` integer NOT NULL,
	`member_id` text NOT NULL,
	`role` text,
	`removed_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`squad_id`) REFERENCES `squads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `slots_squad_idx` ON `slots` (`squad_id`);--> statement-breakpoint
CREATE INDEX `slots_member_idx` ON `slots` (`member_id`);--> statement-breakpoint
CREATE TABLE `squads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`round_id` integer NOT NULL,
	`name` text NOT NULL,
	`type_tag` text,
	FOREIGN KEY (`round_id`) REFERENCES `rounds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `squads_round_idx` ON `squads` (`round_id`);