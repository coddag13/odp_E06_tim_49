import { RowDataPacket } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { IContentRepository } from "../../../Domain/repositories/content/IContentReporsitory";

export class ContentRepository implements IContentRepository {
  async list(params: { q?: string; type?: "movie" | "series"; limit?: number; page?: number } = {}) {
    const { q, type } = params;
    const limit = Number.isFinite(Number(params.limit)) ? Math.max(1, Math.min(500, Number(params.limit))) : 100;
    const page  = Number.isFinite(Number(params.page))  ? Math.max(1, Number(params.page)) : 1;
    const offset = (page - 1) * limit;

    const args: any[] = [];
    let sql = "SELECT content_id,title,type,cover_image AS poster_url,average_rating,rating_count FROM content WHERE 1=1";
    if (q && q.trim() !== "") { sql += " AND title LIKE ?"; args.push(`%${q}%`); }
    if (type === "movie" || type === "series") { sql += " AND type = ?"; args.push(type); }
    sql += " ORDER BY title ASC LIMIT ? OFFSET ?";
    args.push(limit, offset);

    const [rows] = await db.execute<RowDataPacket[]>(sql, args);
    return rows as any[];
  }
}
