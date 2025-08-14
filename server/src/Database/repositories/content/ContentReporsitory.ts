import { RowDataPacket } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { IContentRepository } from "../../../Domain/repositories/content/IContentReporsitory";

export class ContentRepository implements IContentRepository {
  async list(params: { q?: string; type?: "movie" | "series"; limit?: number; page?: number } = {}) {
    const { q, type, limit = 100, page = 1 } = params;
    const offset = (page - 1) * limit;

    const args: any[] = [];
    let sql = `SELECT content_id, title FROM Content WHERE 1=1`;
    if (q)   { sql += ` AND title LIKE ?`; args.push(`%${q}%`); }
    if (type){ sql += ` AND type = ?`;    args.push(type); }

    sql += ` ORDER BY title ASC LIMIT ? OFFSET ?`;
    args.push(limit, offset);

    const [rows] = await db.execute<RowDataPacket[]>(sql, args);
    return rows as any;
  }
}
