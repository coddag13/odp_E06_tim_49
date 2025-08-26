import { Router, Request, Response } from "express";
import type { IEpisodeService } from "../../Domain/services/episode/IEpisodeService";

export class EpisodeController {
  private router: Router;

  constructor(private service: IEpisodeService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    this.router.get("/content/:id/episodes", this.getEpisodes.bind(this));
  }

  private async getEpisodes(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ message: "Neispravan content id" });
        return;
      }
      const data = await this.service.getEpisodes(id);
      res.status(200).json(data); // 👈 samo niz!
    } catch (e: any) {
      console.error("[GET /content/:id/episodes] ERROR:", e);
      res.status(500).json({ message: "Greška pri čitanju epizoda", detail: e?.message ?? String(e) });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
