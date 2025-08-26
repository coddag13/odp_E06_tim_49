import type { IEpisodeAPIService } from "./IEpisodeAPIService";
import type { EpisodeItem } from "../../types/content/Episodes";

const RAW_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
const BASE = RAW_BASE.replace(/\/+$/, "");

function buildUrl(path: string) {
  return `${BASE}/${path.replace(/^\/+/, "")}`;
}

export const episodeApi: IEpisodeAPIService = {
  async getEpisodes(id: number): Promise<EpisodeItem[]> {
    const res = await fetch(buildUrl(`content/${id}/episodes`)); 
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

   
    const json = await res.json();
    if (Array.isArray(json)) return json as EpisodeItem[];
    if (json && Array.isArray(json.data)) return json.data as EpisodeItem[];
    return [];
  },
};