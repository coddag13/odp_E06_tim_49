import { Router, Request, Response } from "express";
import { IContentService } from "../../Domain/services/content/IContentService";
import { authJwt } from "../middlewares/auth";

export class ContentController {
  private router: Router;
  private service: IContentService;

  constructor(service: IContentService) {
    this.router = Router();
    this.service = service;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    this.router.get("/content", this.listContent.bind(this));
    this.router.get("/content/:id", this.getContentById.bind(this));

    
    this.router.post(
      "/content/:id/rate",
      authJwt(["user", "admin"]),
      this.rateContent.bind(this)
    );

    
    this.router.post(
      "/content",
      authJwt(["admin"]),
      this.createContent.bind(this)
    );
  }


  private async listContent(req: Request, res: Response): Promise<void> {
    try {
      const { q, type, limit, page } = req.query;
      const data = await this.service.list({
        q: q ? String(q) : undefined,
        type: type === "movie" || type === "series" ? (type as "movie" | "series") : undefined,
        limit: limit ? Number(limit) : undefined,
        page: page ? Number(page) : undefined,
      });
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      console.error("[GET /content] ERROR:", e);
      res.status(500).json({
        success: false,
        message: "Greška pri listanju sadržaja",
        detail: e?.message ?? String(e),
      });
    }
  }

  private async getContentById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ success: false, message: "Neispravan ID" });
        return;
      }

      const item = await this.service.getById(id);
      if (!item) {
        res.status(404).json({ success: false, message: "Nije pronađeno" });
        return;
      }
      res.status(200).json({ success: true, data: item });
    } catch (e: any) {
      console.error("[GET /content/:id] ERROR:", e);
      res.status(500).json({
        success: false,
        message: "Greška pri čitanju",
        detail: e?.message ?? String(e),
      });
    }
  }

 
  private async rateContent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const rraw = (req.body?.rating ?? "").toString();
      const rating = Math.max(1, Math.min(10, Math.round(Number(rraw))));

      if (!Number.isFinite(id)) {
        res.status(400).json({ success: false, message: "Neispravan ID" });
        return;
      }
      if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
        res.status(400).json({ success: false, message: "Ocena mora biti 1–10" });
        return;
      }

      
      const userId =
        (req as any).user?.id ??
        (req as any).user?.user_id ??
        null;

      const result = await this.service.rate(id, rating, Number(userId));
      if (!result) {
        res.status(404).json({ success: false, message: "Sadržaj nije pronađen" });
        return;
      }
      res.status(200).json({ success: true, data: result });
    } catch (e: any) {
      console.error("[POST /content/:id/rate] ERROR:", e);
      res.status(500).json({
        success: false,
        message: "Greška pri ocenjivanju",
        detail: e?.message ?? String(e),
      });
    }
  }

  
  private async createContent(req: Request, res: Response): Promise<void> {
    try {
      console.log("[ContentController.createContent] body:", req.body)
      const p = req.body;

      if (!p?.title || !p?.type) {
        res.status(400).json({ success: false, message: "Nedostaje title ili type" });
        return;
      }
      if (p.type !== "movie" && p.type !== "series") {
        res.status(400).json({ success: false, message: "type mora biti 'movie' ili 'series'" });
        return;
      }

      const payload = {
        title: String(p.title),
        type: p.type as "movie" | "series",
        description: p.description ?? null,
        release_date: p.release_date ?? null, // 'YYYY-MM-DD' ili null
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
      res.status(500).json({
        success: false,
        message: "Greška pri dodavanju sadržaja",
        detail: e?.message ?? String(e),
      });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}