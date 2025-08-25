import type {EpisodeItem} from "../../types/content/Episodes.ts";

export interface IContentAPIService {
  getEpisodes(id: number): Promise<EpisodeItem[]>;
}
