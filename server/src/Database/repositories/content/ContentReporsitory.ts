import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import {
  IContentRepository,
  ContentListItem,
  ContentFull,
  TriviaItem,
} from "../../../Domain/repositories/content/IContentReporsitory";

export class ContentRepository implements IContentRepository {
  async list(params: { q?: string; type?: "movie" | "series"; limit?: number; page?: number } = {}) {
    const { q, type } = params;

    const limit = Number.isFinite(Number(params.limit)) ? Math.max(1, Math.min(500, Number(params.limit))) : 100;
    const page  = Number.isFinite(Number(params.page))  ? Math.max(1, Number(params.page)) : 1;
    const offset = (page - 1) * limit;

    const args: any[] = [];
    let sql = `
      SELECT content_id, title, type,
             cover_image AS poster_url,
             average_rating, rating_count
      FROM content
      WHERE 1=1
    `;

    if (q && q.trim() !== "") {
      sql += " AND title LIKE ?";
      args.push(`%${q}%`);
    }
    if (type === "movie" || type === "series") {
      sql += " AND type = ?";
      args.push(type);
    }

    sql += ` ORDER BY title ASC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute<RowDataPacket[]>(sql, args);
    return rows as unknown as ContentListItem[];
  }

  async getById(id: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT content_id, title, description, release_date,
              cover_image AS poster_url, genre, type,
              average_rating, rating_count
       FROM content WHERE content_id = ?`,
      [id]
    );
    return (rows[0] as unknown as ContentFull) || null;
  }

  async getTrivia(id: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT trivia_id, trivia_text FROM trivia
       WHERE content_id = ? ORDER BY trivia_id ASC`,
      [id]
    );
    return rows as unknown as TriviaItem[];
  }

  async rate(contentId: number, rating: number) {
    const [res] = await db.execute<ResultSetHeader>(
      `UPDATE content
       SET average_rating = ROUND(((IFNULL(average_rating,0) * IFNULL(rating_count,0)) + ?)/(IFNULL(rating_count,0) + 1), 2),
           rating_count = IFNULL(rating_count,0) + 1
       WHERE content_id = ?`,
      [rating, contentId]
    );
    if (res.affectedRows === 0) return null;

    const [rows2] = await db.execute<RowDataPacket[]>(
      "SELECT content_id, average_rating, rating_count FROM content WHERE content_id = ?",
      [contentId]
    );
    return rows2[0] as any;
  }
}
