import type { IEpisodeService } from "../../Domain/services/episode/IEpisodeService";
import type { IEpisodeRepository, EpisodeItem } from "../../Domain/repositories/episode/IEpisodeReporsitory";

export class EpisodeService implements IEpisodeService {
  constructor(private repo: IEpisodeRepository) {}

  async getEpisodes(contentId: number): Promise<EpisodeItem[]> {
    return this.repo.getEpisodes(contentId);
  }
}