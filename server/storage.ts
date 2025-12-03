import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "@db";
import { users, articles } from "@shared/schema";
import type { InsertArticle, Article } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

// Article operations
export async function insertArticle(article: InsertArticle): Promise<Article> {
  const [newArticle] = await db.insert(articles).values(article).returning();
  return newArticle;
}

export async function getAllArticles(): Promise<Article[]> {
  return await db.select().from(articles).orderBy(desc(articles.createdAt));
}

export async function getPublishedArticles(): Promise<Article[]> {
  return await db.select().from(articles).where(eq(articles.published, true)).orderBy(desc(articles.createdAt));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  return await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });
}

export async function updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
  const [updated] = await db.update(articles)
    .set({ ...article, updatedAt: new Date() })
    .where(eq(articles.id, id))
    .returning();
  return updated;
}

export async function deleteArticle(id: string): Promise<void> {
  await db.delete(articles).where(eq(articles.id, id));
}

// User operations
export async function getUserById(id: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.username, username),
  });
}

export async function insertUser(user: InsertUser): Promise<User> {
  const [newUser] = await db.insert(users).values(user).returning();
  return newUser;
}

export const storage = {
  getUser: getUserById,
  getUserByUsername,
  insertUser,
  createUser: insertUser,
  insertArticle,
  getAllArticles,
  getPublishedArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};