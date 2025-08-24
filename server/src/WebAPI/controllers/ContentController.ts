import { Router, Request, Response } from "express";
import { IContentService } from "../../Domain/services/content/IContentServise";
import { authJwt } from "../middlewares/auth";

export class ContentController {
  constructor(private service: IContentService) { }

  getRouter() {
    const r = Router();

    r.get("/content", async (req: Request, res: Response) => {
      try {
        const { q, type, limit, page } = req.query;
        const data = await this.service.list({
          q: q ? String(q) : undefined,
          type: type === "movie" || type === "series" ? (type as "movie" | "series") : undefined,
          limit: limit ? Number(limit) : undefined,
          page: page ? Number(page) : undefined,
        });
        res.json(data);
      } catch (e: any) {
        console.error("[GET /content] ERROR:", e);
        res.status(500).json({ message: "Greška pri listanju sadržaja", detail: e?.message ?? String(e) });
      }
    });

    r.get("/content/:id", async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const item = await this.service.getById(id);
        if (!item) return res.status(404).json({ message: "Nije pronađeno" });
        res.json(item);
      } catch (e: any) {
        console.error("[GET /content/:id] ERROR:", e);
        res.status(500).json({ message: "Greška pri čitanju", detail: e?.message ?? String(e) });
      }
    });

    r.get("/content/:id/trivia", async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const data = await this.service.getTrivia(id);
        res.json(data);
      } catch (e: any) {
        console.error("[GET /content/:id/trivia] ERROR:", e);
        res.status(500).json({ message: "Greška pri čitanju trivie", detail: e?.message ?? String(e) });
      }
    });

    r.post("/content/:id/rate", authJwt(["user", "admin"]), async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const rraw = (req.body?.rating ?? "").toString();
        const rating = Math.max(1, Math.min(10, Math.round(Number(rraw))));
        if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
          return res.status(400).json({ message: "Ocena mora biti 1–10" });
        }
        const userId = (req as any).user?.user_id as number;
        const result = await this.service.rate(id, rating, userId);
        if (!result) return res.status(404).json({ message: "Sadržaj nije pronađen" });
        res.json(result);
      } catch (e: any) {
        console.error("[POST /content/:id/rate] ERROR:", e);
        res.status(500).json({ message: "Greška pri ocenjivanju", detail: e?.message ?? String(e) });
      }
    });

    r.get("/content/:id/episodes", async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const data = await this.service.getEpisodes(id);
        res.json(data);
      } catch (e: any) {
        console.error("[GET /content/:id/episodes] ERROR:", e);
        res.status(500).json({ message: "Greška pri čitanju epizoda", detail: e?.message ?? String(e) });
      }
    });

    r.post("/content", authJwt(["admin"]), async (req: Request, res: Response) => {
      try {
        const p = req.body;

        
        if (!p?.title || !p?.type) {
          return res.status(400).json({ message: "Nedostaje title ili type" });
        }
        if (p.type !== "movie" && p.type !== "series") {
          return res.status(400).json({ message: "type mora biti 'movie' ili 'series'" });
        }

        const payload = {
          title: String(p.title),
          type: p.type as "movie" | "series",
          description: p.description ?? null,
          release_date: p.release_date ?? null, 
          cover_image: p.cover_image ?? null,
          genre: p.genre ?? null,
          trivia: p.trivia ?? null,
          episodes:
            p.type === "series" && Array.isArray(p.episodes)
              ? p.episodes.map((e: any) => ({
                season_number: Number(e.season_number),
                episode_number: Number(e.episode_number),
                title: String(e.title),
                description: e.description ?? null,
                cover_image: e.cover_image ?? null,
              }))
              : undefined,
        };

        const created = await this.service.create(payload);
        res.status(201).json({ success: true, data: created });
      } catch (e: any) {
        console.error("[POST /content] ERROR:", e);
        res.status(500).json({ message: "Greška pri dodavanju sadržaja", detail: e?.message ?? String(e) });
      }
    });

    return r;
  }
}
