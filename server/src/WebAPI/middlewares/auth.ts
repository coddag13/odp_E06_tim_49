import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // ako ti TS prijavi grešku, vidi napomenu dole

export interface JwtUser { user_id: number; role: "user" | "admin"; }

export function authJwt(roles?: Array<"user" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const h = req.headers.authorization || "";
    const m = h.match(/^Bearer\s+(.+)$/i);
    if (!m) return res.status(401).json({ message: "Nedostaje token" });

    try {
      const payload = jwt.verify(m[1], process.env.JWT_SECRET as string) as JwtUser;
      (req as any).user = payload;
      if (roles?.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: "Zabranjeno" });
      }
      next();
    } catch {
      return res.status(401).json({ message: "Neispravan token" });
    }
  };
}
