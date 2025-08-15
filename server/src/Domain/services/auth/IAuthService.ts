import { UserAuthDataDto } from "../../DTOs/auth/UserAuthDataDto";

export interface IAuthService {
  /**
   * Prijavljuje korisnika sa datim korisničkim imenom i lozinkom.
   * @param korisnickoIme - Korisničko ime korisnika.
   * @param lozinka - Lozinka korisnika.
   * @returns Podatke o korisniku ako je prijava uspešna, ili prazan objekat ako nije.
   */
  prijava(korisnickoIme: string, lozinka: string): Promise<UserAuthDataDto>;

  /**
   * Registruje novog korisnika sa datim korisničkim imenom, lozinkom i email adresom.
   * @param korisnickoIme - Korisničko ime korisnika.
   * @param uloga - Uloga korisnika u sistemu.
   * @param lozinka - Lozinka korisnika.
   * @param email - Email adresa korisnika.
   * @returns Podatke o korisniku ako je registracija uspešna, ili prazan objekat ako nije.
   */
  registracija(
    korisnickoIme: string,
    uloga: string,
    lozinka: string,
    email: string
  ): Promise<UserAuthDataDto>;
}
