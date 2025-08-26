import db from "../../connection/DbConnectionPool";
import { IEpisodeRepository, EpisodeItem } from "../../../Domain/repositories/episode/IEpisodeReporsitory";

export class EpisodeRepository implements IEpisodeRepository {
  async getEpisodes(contentId: number) {
    const [rows] = await db.execute(
      `SELECT episode_id, season_number, episode_number, title, description, cover_image
       FROM Episodes
       WHERE content_id=?
       ORDER BY season_number, episode_number`,
      [contentId]
    );
    return rows as EpisodeItem[];
  }

  async addMany(contentId: number, eps: Omit<EpisodeItem, "episode_id">[]) {
    if (!eps.length) return;

    
    const placeholders = eps.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const args: any[] = [];
    for (const e of eps) {
      args.push(
        contentId,
        e.season_number,
        e.episode_number,
        e.title,
        e.description ?? null,
        e.cover_image ?? null
      );
    }

    const sql = `
      INSERT INTO Episodes
        (content_id, season_number, episode_number, title, description, cover_image)
      VALUES ${placeholders}
    `;
    await db.execute(sql, args);
  }
}