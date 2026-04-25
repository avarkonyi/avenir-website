CREATE TABLE "client_references" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"label_hu" text NOT NULL,
	"label_en" text NOT NULL,
	"label_de" text NOT NULL,
	"label_zh" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "client_references_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"email" text NOT NULL,
	"phone" text,
	"service" varchar(50),
	"message" text,
	"locale" varchar(5) NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title_hu" text NOT NULL,
	"title_en" text NOT NULL,
	"title_de" text NOT NULL,
	"title_zh" text NOT NULL,
	"lead_hu" text NOT NULL,
	"lead_en" text NOT NULL,
	"lead_de" text NOT NULL,
	"lead_zh" text NOT NULL,
	"body_hu" text NOT NULL,
	"body_en" text NOT NULL,
	"body_de" text NOT NULL,
	"body_zh" text NOT NULL,
	"published_hu" boolean DEFAULT false NOT NULL,
	"published_en" boolean DEFAULT false NOT NULL,
	"published_de" boolean DEFAULT false NOT NULL,
	"published_zh" boolean DEFAULT false NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"type" text NOT NULL,
	"apply_email" text DEFAULT 'info@afm.hu' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
