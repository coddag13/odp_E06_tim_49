import type {EpisodeItem} from "../../types/content/Episodes.ts";

export interface IEpisodeAPIService {
  getEpisodes(id: number): Promise<EpisodeItem[]>;
}
