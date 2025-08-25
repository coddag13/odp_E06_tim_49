import { Router, Request, Response } from "express";
import { IEpisodeService } from "../../Domain/services/content/IEpisodeService";
import { authJwt } from "../middlewares/auth";

export class EpisodeController {
  constructor(private service: IEpisodeService) { }

  getRouter() {
    const r = Router();

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

    return r;
  }
}
