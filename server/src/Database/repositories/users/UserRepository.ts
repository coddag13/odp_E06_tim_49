import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

/*export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (korisnickoIme, uloga, lozinka) 
        VALUES (?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.uloga,
        user.lozinka,
      ]);


      if (result.insertId) {
        // Vraćamo novog korisnika sa dodeljenim ID-om
        return new User(result.insertId, user.korisnickoIme, user.uloga, user.lozinka);
      }

      // Vraćamo prazan objekat ako kreiranje nije uspešno
      return new User();
    } catch (error) {
      console.error('Error creating user:', error);
      return new User();
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const query = `SELECT *FROM users WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(row.id, row.korisnickoIme, row.uloga, row.lozinka);
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async getByUsername(korisnickoIme: string): Promise<User> {
    try {
      const query = `
        SELECT id, korisnickoIme, uloga, lozinka
        FROM users 
        WHERE korisnickoIme = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [korisnickoIme]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(row.id, row.korisnickoIme, row.uloga, row.lozinka);
      }

      return new User();
    } catch (error) {
      console.log("user get by username: " + error);
      return new User();
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const query = `SELECT *FROM users ORDER BY id ASC`;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => new User(row.id, row.korisnickoIme, row.uloga, row.lozinka)
      );
    } catch {
      return [];
    }
  }

  async update(user: User): Promise<User> {
    try {
      const query = `
        UPDATE users 
        SET korisnickoIme = ?, lozinka = ? 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.lozinka,
        user.uloga,
        user.id,
      ]);

      if (result.affectedRows > 0) {
        return user;
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM users 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [id]);

      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE id = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      return rows[0].count > 0;
    } catch {
      return false;
    }
  }
}*/
export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const sql = `
        INSERT INTO Users (username, role, password_hash, email)
        VALUES (?, ?, ?, ?)
      `;
      const [res] = await db.execute<ResultSetHeader>(sql, [
        user.korisnickoIme,  // -> username
        user.uloga,          // -> role
        user.lozinka,        // -> password_hash (hash!)
        user.email ?? null,  // -> email
      ]);

      if (!res.insertId) return new User();
      // minimalna promjena: učitamo iz baze umjesto da sklapamo iz inputa
      return await this.getById(res.insertId);
    } catch (err) {
      console.error("UserRepository.create error:", err);
      return new User();
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const sql = `
        SELECT 
          user_id        AS id,
          username       AS korisnickoIme,
          role           AS uloga,
          password_hash  AS lozinka,
          email
        FROM Users
        WHERE user_id = ?
        LIMIT 1
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [id]);
      if (rows.length === 0) return new User();

      const r = rows[0] as any;
      return new User(r.id, r.korisnickoIme, r.uloga, r.lozinka, r.email);
    } catch (err) {
      console.error("UserRepository.getById error:", err);
      return new User();
    }
  }

  async getByUsername(korisnickoIme: string): Promise<User> {
    try {
      const sql = `
        SELECT 
          user_id        AS id,
          username       AS korisnickoIme,
          role           AS uloga,
          password_hash  AS lozinka,
          email
        FROM Users
        WHERE username = ?
        LIMIT 1
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [korisnickoIme]);

      

      if (rows.length === 0) return new User();

      const r = rows[0] as any;
      return new User(r.id, r.korisnickoIme, r.uloga, r.lozinka, r.email);
    } catch (err) {
      console.error("UserRepository.getByUsername error:", err);
      return new User();
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const sql = `
        SELECT 
          user_id        AS id,
          username       AS korisnickoIme,
          role           AS uloga,
          password_hash  AS lozinka,
          email
        FROM Users
        ORDER BY user_id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql);
      return (rows as any[]).map(
        r => new User(r.id, r.korisnickoIme, r.uloga, r.lozinka, r.email)
      );
    } catch (err) {
      console.error("UserRepository.getAll error:", err);
      return [];
    }
  }

  async update(user: User): Promise<User> {
    try {
      const sql = `
        UPDATE Users
        SET username = ?, role = ?, password_hash = ?, email = ?
        WHERE user_id = ?
      `;
      const [res] = await db.execute<ResultSetHeader>(sql, [
        user.korisnickoIme,
        user.uloga,
        user.lozinka,
        user.email ?? null,
        user.id,
      ]);
      return res.affectedRows > 0 ? user : new User();
    } catch (err) {
      console.error("UserRepository.update error:", err);
      return new User();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const sql = `DELETE FROM Users WHERE user_id = ?`;
      const [res] = await db.execute<ResultSetHeader>(sql, [id]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("UserRepository.delete error:", err);
      return false;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const sql = `SELECT COUNT(*) AS cnt FROM Users WHERE user_id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [id]);
      return (rows[0] as any).cnt > 0;
    } catch (err) {
      console.error("UserRepository.exists error:", err);
      return false;
    }
  }
}