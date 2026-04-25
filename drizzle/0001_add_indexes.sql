CREATE INDEX "idx_references_active_sort" ON "client_references" USING btree ("active","sort_order") WHERE "client_references"."active" = true;--> statement-breakpoint
CREATE INDEX "idx_messages_unread" ON "messages" USING btree ("created_at" DESC) WHERE "messages"."read_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_news_published_hu" ON "news" USING btree ("published_hu") WHERE "news"."published_hu" = true;--> statement-breakpoint
CREATE INDEX "idx_news_published_en" ON "news" USING btree ("published_en") WHERE "news"."published_en" = true;--> statement-breakpoint
CREATE INDEX "idx_news_published_de" ON "news" USING btree ("published_de") WHERE "news"."published_de" = true;--> statement-breakpoint
CREATE INDEX "idx_news_published_zh" ON "news" USING btree ("published_zh") WHERE "news"."published_zh" = true;--> statement-breakpoint
CREATE INDEX "idx_news_date_desc" ON "news" USING btree ("date" DESC);--> statement-breakpoint
CREATE INDEX "idx_positions_active_sort" ON "positions" USING btree ("active","sort_order") WHERE "positions"."active" = true;