import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { AddContentDto } from "../../../Domain/DTOs/content/AddContentDto";
import { PoolConnection } from "mysql2/promise";
import { ITriviaRepository } from "../../../Domain/repositories/trivia/ITriviaReporsitory";
import { TriviaItem } from "../../../Domain/repositories/trivia/ITriviaReporsitory";

export class TriviaRepository implements ITriviaRepository {
  async getTrivia(id: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT trivia_id, trivia_text FROM trivia
       WHERE content_id = ? ORDER BY trivia_id ASC`,
      [id]
    );
    return rows as unknown as TriviaItem[];
  }
}


