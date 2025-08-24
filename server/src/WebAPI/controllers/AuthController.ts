import { Request, Response, Router } from 'express';
import { IAuthService } from '../../Domain/services/auth/IAuthService';
import { validacijaPodatakaAuth } from '../validators/auth/RegisterValidator';
import jwt from "jsonwebtoken";

export class AuthController {
  private router: Router;
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.router = Router();
    this.authService = authService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/auth/login', this.prijava.bind(this));
    this.router.post('/auth/register', this.registracija.bind(this));
  }

  private async prijava(req: Request, res: Response): Promise<void> {
    try {
      const { korisnickoIme, lozinka } = req.body;

      const rezultat = validacijaPodatakaAuth(korisnickoIme, lozinka);

      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }

      const result = await this.authService.prijava(korisnickoIme, lozinka);

      if (result.id !== 0) {
        const token = jwt.sign(
          { 
            id: result.id, 
            korisnickoIme: result.korisnickoIme, 
            uloga: result.uloga,
          }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

        res.status(200).json({success: true, message: 'Uspešna prijava', data: token});
        return;
      } else {
        res.status(401).json({success: false, message: 'Неисправно корисничко име или лозинка'});
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({success: false, message: error});
    }
  }

  private async registracija(req: Request, res: Response): Promise<void> {
  try {
    const { korisnickoIme, lozinka, uloga, email } = req.body;

    const rezultat = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }

    const result = await this.authService.registracija(
      korisnickoIme,
      uloga,
      lozinka,
      email 
    );

    if (result.id !== 0) {
      const token = jwt.sign(
        { id: result.id, korisnickoIme: result.korisnickoIme, uloga: result.uloga },
        process.env.JWT_SECRET ?? "",
        { expiresIn: '6h' }
      );

      res.status(201).json({ success: true, message: 'Uspešna registracija', data: token });
    } else {
      res.status(401).json({
        success: false,
        message: 'Регистрација није успела. Корисничко име већ постоји.',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

  public getRouter(): Router {
    return this.router;
  }
}