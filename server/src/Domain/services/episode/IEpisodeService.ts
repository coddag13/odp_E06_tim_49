import { EpisodeItem } from "../../repositories/episode/IEpisodeReporsitory";

export interface IEpisodeService {
  getEpisodes(id: number): Promise<EpisodeItem[]>;
}
