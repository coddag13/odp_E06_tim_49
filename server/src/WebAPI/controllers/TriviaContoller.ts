import { Router, Request, Response } from "express";
import { ITriviaService } from "../../Domain/services/trivia/ITriviaService";


export class TriviaController {
  private router: Router;
  private service: ITriviaService;

  constructor(service: ITriviaService) {
    this.router = Router();
    this.service = service;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    this.router.get("/content/:id/trivia", this.getTrivia.bind(this));

   
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