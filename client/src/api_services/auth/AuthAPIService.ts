import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import axios from "axios";

const RAW_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1");
const API_URL: string = `${RAW_BASE.replace(/\/+$/, "")}/auth`;

export const authApi: IAuthAPIService = {
  async prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
        korisnickoIme,
        lozinka,
      });
      return res.data;
    } catch (error) {
      let message = "Грешка приликом пријаве.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: undefined,
      };
    }
  },

  async registracija(
    korisnickoIme: string,
    lozinka: string,
    uloga: string,
    email: string
  ): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
        korisnickoIme,
        lozinka,
        uloga,
        email
      });
      return res.data;
    } catch (error) {
      let message = "Greška prilikom registracije.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: undefined,
      };
    }
  },
};
