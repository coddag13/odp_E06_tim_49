import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AppRole = "user" | "admin";

export function authJwt(roles?: Array<AppRole>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const h = req.headers.authorization || "";
    const m = h.match(/^Bearer\s+(.+)$/i);
    if (!m) return res.status(401).json({ message: "Nedostaje token" });

    try {
      const raw = jwt.verify(m[1], process.env.JWT_SECRET as string) as any;

      const user_id = raw.user_id ?? raw.id;
      const role: AppRole | undefined = (raw.role ?? raw.uloga) as AppRole | undefined;

      if (!user_id || !role) {
        return res.status(401).json({ message: "Neispravan token" });
      }

      (req as any).user = { user_id, role };

      if (roles?.length && !roles.includes(role)) {
        return res.status(403).json({ message: "Zabranjeno" });
      }

      next();
    } catch {
      return res.status(401).json({ message: "Neispravan token" });
    }
  };
}
