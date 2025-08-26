import { Router, Request, Response } from "express";
import { ITriviaService } from "../../Domain/services/trivia/ITriviaService";
import { authJwt } from "../middlewares/auth";

export class TriviaController {
  private router: Router;
  private service: ITriviaService;

  constructor(service: ITriviaService) {
    this.router = Router();
    this.service = service;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /content/:id/trivia
    this.router.get("/content/:id/trivia", this.getTrivia.bind(this));

    // Ako ćeš dodavanje/brisanje trivije (admin), dodaš:
     //this.router.post("/content/:id/trivia", authJwt(["admin"]), this.addTrivia.bind(this));
    // this.router.delete("/content/:id/trivia/:triviaId", authJwt(["admin"]), this.removeTrivia.bind(this));
  }

  private async getTrivia(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ success: false, message: "Neispravan content id" });
        return;
      }

      const data = await this.service.getTrivia(id);
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      console.error("[GET /content/:id/trivia] ERROR:", e);
      res.status(500).json({ success: false, message: "Greška pri čitanju trivie", detail: e?.message ?? String(e) });
    }
  }

  
  public getRouter(): Router {
    return this.router;
  }
}