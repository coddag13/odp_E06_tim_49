import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface IAuthAPIService {
  prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse>;
  registracija(korisnickoIme: string, lozinka: string, uloga: string,email: string): Promise<AuthResponse>;
}