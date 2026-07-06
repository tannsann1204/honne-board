import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export type Post = {
  id: number;
  body: string;
  nickname: string;
  category: string;
  image: string | null;
  empathy_count: number;
  comment_count: number;
  created_at: string;
};

export type Comment = {
  id: number;
  post_id: number;
  body: string;
  nickname: string;
  created_at: string;
};

const REPORT_HIDE_THRESHOLD = 5;

function createDb(): Database.Database {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(path.join(dataDir, "honne.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      body TEXT NOT NULL,
      nickname TEXT NOT NULL DEFAULT '匿名さん',
      category TEXT NOT NULL DEFAULT 'other',
      empathy_count INTEGER NOT NULL DEFAULT 0,
      comment_count INTEGER NOT NULL DEFAULT 0,
      hidden INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL REFERENCES posts(id),
      body TEXT NOT NULL,
      nickname TEXT NOT NULL DEFAULT '匿名さん',
      hidden INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_type TEXT NOT NULL,
      target_id INTEGER NOT NULL,
      reason TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category, created_at);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
  `);
  // 既存DBへの簡易マイグレーション: 画像カラムを後付けする
  const cols = db.prepare("PRAGMA table_info(posts)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "image")) {
    db.exec("ALTER TABLE posts ADD COLUMN image TEXT");
  }
  return db;
}

// Next.js の HMR で接続が増殖しないように globalThis にキャッシュする
const g = globalThis as unknown as { __honneDb?: Database.Database };

export function getDb(): Database.Database {
  if (!g.__honneDb) g.__honneDb = createDb();
  return g.__honneDb;
}

export type Sort = "new" | "popular";

export function listPosts(opts: {
  category?: string;
  sort?: Sort;
  page?: number;
  perPage?: number;
}): { posts: Post[]; total: number } {
  const db = getDb();
  const perPage = opts.perPage ?? 20;
  const page = Math.max(1, opts.page ?? 1);
  const where = opts.category ? "WHERE hidden = 0 AND category = ?" : "WHERE hidden = 0";
  const params = opts.category ? [opts.category] : [];
  const order =
    opts.sort === "popular"
      ? "ORDER BY empathy_count DESC, created_at DESC"
      : "ORDER BY created_at DESC, id DESC";

  const total = (
    db.prepare(`SELECT COUNT(*) AS c FROM posts ${where}`).get(...params) as { c: number }
  ).c;
  const posts = db
    .prepare(`SELECT * FROM posts ${where} ${order} LIMIT ? OFFSET ?`)
    .all(...params, perPage, (page - 1) * perPage) as Post[];
  return { posts, total };
}

export function getPost(id: number): Post | undefined {
  return getDb()
    .prepare("SELECT * FROM posts WHERE id = ? AND hidden = 0")
    .get(id) as Post | undefined;
}

export function createPost(input: {
  body: string;
  nickname: string;
  category: string;
  image?: string | null;
}): number {
  const res = getDb()
    .prepare("INSERT INTO posts (body, nickname, category, image) VALUES (?, ?, ?, ?)")
    .run(input.body, input.nickname, input.category, input.image ?? null);
  return Number(res.lastInsertRowid);
}

export function addEmpathy(postId: number): number | undefined {
  const db = getDb();
  const res = db
    .prepare("UPDATE posts SET empathy_count = empathy_count + 1 WHERE id = ? AND hidden = 0")
    .run(postId);
  if (res.changes === 0) return undefined;
  const row = db.prepare("SELECT empathy_count FROM posts WHERE id = ?").get(postId) as {
    empathy_count: number;
  };
  return row.empathy_count;
}

export function listComments(postId: number): Comment[] {
  return getDb()
    .prepare("SELECT * FROM comments WHERE post_id = ? AND hidden = 0 ORDER BY created_at ASC, id ASC")
    .all(postId) as Comment[];
}

export function createComment(input: {
  postId: number;
  body: string;
  nickname: string;
}): number | undefined {
  const db = getDb();
  const post = db.prepare("SELECT id FROM posts WHERE id = ? AND hidden = 0").get(input.postId);
  if (!post) return undefined;
  const insert = db.prepare("INSERT INTO comments (post_id, body, nickname) VALUES (?, ?, ?)");
  const bump = db.prepare("UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?");
  const tx = db.transaction(() => {
    const res = insert.run(input.postId, input.body, input.nickname);
    bump.run(input.postId);
    return Number(res.lastInsertRowid);
  });
  return tx();
}

export function createReport(input: {
  targetType: "post" | "comment";
  targetId: number;
  reason: string;
}): void {
  const db = getDb();
  db.prepare("INSERT INTO reports (target_type, target_id, reason) VALUES (?, ?, ?)").run(
    input.targetType,
    input.targetId,
    input.reason
  );
  const count = (
    db
      .prepare("SELECT COUNT(*) AS c FROM reports WHERE target_type = ? AND target_id = ?")
      .get(input.targetType, input.targetId) as { c: number }
  ).c;
  // 通報が一定数を超えた対象は自動で非表示にする(運営側での確認までの暫定措置)
  if (count >= REPORT_HIDE_THRESHOLD) {
    const table = input.targetType === "post" ? "posts" : "comments";
    db.prepare(`UPDATE ${table} SET hidden = 1 WHERE id = ?`).run(input.targetId);
  }
}

export function listRecentPostIds(limit: number): { id: number; created_at: string }[] {
  return getDb()
    .prepare("SELECT id, created_at FROM posts WHERE hidden = 0 ORDER BY created_at DESC LIMIT ?")
    .all(limit) as { id: number; created_at: string }[];
}
