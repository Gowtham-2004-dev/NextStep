import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  degree: text("degree").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  resumeFilename: text("resume_filename").notNull(),
  notes: text("notes"),
});

export const insertResumeSchema = createInsertSchema(resumes).pick({
  name: true,
  degree: true,
  email: true,
  phone: true,
  resumeFilename: true,
  notes: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertNewsItemSchema = createInsertSchema(newsItems).pick({
  title: true,
  content: true,
  date: true,
  imageUrl: true,
});

export type InsertNewsItem = z.infer<typeof insertNewsItemSchema>;
export type NewsItem = typeof newsItems.$inferSelect;
