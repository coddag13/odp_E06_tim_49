import { Router, Request, Response } from "express";
import { ITriviaService } from "../../Domain/services/content/ITriviaService";
import { authJwt } from "../middlewares/auth";

export class TriviaController {
  constructor(private service: ITriviaService) { }

  getRouter() {
    const r = Router();

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

    return r;
  }
}
