import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { EpisodeItem, IEpisodeRepository } from "../../../Domain/repositories/content/IEpisodeReporsitory";

export class EpisodeRepository implements IEpisodeRepository {
 async getEpisodes(contentId: number) {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT episode_id, season_number, episode_number, title, description, cover_image
     FROM Episodes
     WHERE content_id = ?
     ORDER BY season_number ASC, episode_number ASC`,
    [contentId]
  );
  return rows as EpisodeItem[];
    }
}