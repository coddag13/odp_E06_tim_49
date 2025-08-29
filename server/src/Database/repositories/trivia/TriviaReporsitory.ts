import db from "../../connection/DbConnectionPool";
import { ITriviaRepository } from "../../../Domain/repositories/trivia/ITriviaReporsitory";

export class TriviaRepository implements ITriviaRepository {
  async getTrivia(contentId: number) {
    const [rows] = await db.execute(
      "SELECT trivia_id, trivia_text FROM Trivia WHERE content_id=? ORDER BY trivia_id ASC",
      [contentId]
    );
    return rows as any[];
  }

  async addMany(contentId: number, items: string[]) {
    if (!items.length) return;

    
    const placeholders = items.map(() => "(?, ?)").join(", ");
    const args: any[] = [];
    for (const t of items) {
      args.push(contentId, t);
    }

    const sql = `INSERT INTO Trivia (content_id, trivia_text) VALUES ${placeholders}`;
    await db.execute(sql, args);
  }
}

