import { Router, Request, Response } from "express";
import { IContentService } from "../../Domain/services/content/IContentServise";

export class ContentController {
  constructor(private service: IContentService) {}

  getRouter() {
    const r = Router();

    // GET /api/v1/content?q=...&type=movie|series&limit=...&page=...
    r.get("/content", async (req: Request, res: Response) => {
      try {
        const { q, type, limit, page } = req.query;
        const data = await this.service.list({
          q: q ? String(q) : undefined,
          type: type === "movie" || type === "series" ? (type as any) : undefined,
          limit: limit ? Number(limit) : undefined,
          page: page ? Number(page) : undefined,
        });
        res.json(data);
      } catch (e) {
        res.status(500).json({ message: "Greška pri listanju sadržaja" });
      }
    });

    return r;
  }
}
