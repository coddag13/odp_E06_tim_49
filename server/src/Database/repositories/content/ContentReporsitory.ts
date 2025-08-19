import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { AddContentDto } from "../../../Domain/DTOs/content/AddContentDto";
import { PoolConnection } from "mysql2/promise";
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
  
  async getEpisodes(contentId: number) {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT episode_id, season_number, episode_number, title, description, cover_image
     FROM Episodes
     WHERE content_id = ?
     ORDER BY season_number ASC, episode_number ASC`,
    [contentId]
  );
  return rows as any;
}

  async rate(contentId: number, rating: number) {
  // clamp 1–10 (ako već radiš ranije, ovo može da se izbaci)
  const r = Math.max(1, Math.min(10, Math.round(Number(rating))));

  // Jedan UPDATE: (stari_avg * stari_cnt + nova_ocena) / (stari_cnt + 1)
  const [res] = await db.execute<ResultSetHeader>(
    `
    UPDATE Content
    SET
      average_rating = ROUND( (COALESCE(average_rating,0) * COALESCE(rating_count,0) + ?) 
                              / (COALESCE(rating_count,0) + 1), 2),
      rating_count   = COALESCE(rating_count,0) + 1
    WHERE content_id = ?
    `,
    [r, contentId]
  );

  if (res.affectedRows === 0) return null;

  // Vrati osvežene vrednosti
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT content_id, average_rating, rating_count FROM Content WHERE content_id = ?`,
    [contentId]
  );

  return rows[0] as { content_id: number; average_rating: number; rating_count: number };
}
  async create(dto: AddContentDto): Promise<{ content_id: number }> {
    const conn: PoolConnection = await (db as any).getConnection(); // mysql2/promise PoolConnection
    try {
      await conn.beginTransaction();

      // 1) Content
      const [cres] = await conn.execute<ResultSetHeader>(
        `INSERT INTO Content
          (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
         VALUES (?, ?, ?, ?, ?, ?, 0.00, 0)`,
        [
          dto.title,
          dto.description ?? null,
          dto.release_date ?? null,   // 'YYYY-MM-DD' ili null
          dto.cover_image ?? null,
          dto.genre ?? null,
          dto.type,                   // 'movie' | 'series'
        ]
      );
      const contentId = (cres as ResultSetHeader).insertId;

      // 2) Trivia (opciono)
      if (dto.trivia && dto.trivia.trim().length > 0) {
        await conn.execute(
          `INSERT INTO Trivia (content_id, trivia_text) VALUES (?, ?)`,
          [contentId, dto.trivia.trim()]
        );
      }

      // 3) Episodes (ako je serija)
      if (dto.type === "series" && Array.isArray(dto.episodes) && dto.episodes.length > 0) {
        const epSql = `
          INSERT INTO Episodes
            (content_id, season_number, episode_number, title, description, cover_image)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        for (const ep of dto.episodes) {
          await conn.execute(epSql, [
            contentId,
            Number(ep.season_number),
            Number(ep.episode_number),
            ep.title,
            ep.description ?? null,
            ep.cover_image ?? null,
          ]);
        }
      }

      await conn.commit();
      return { content_id: contentId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}
