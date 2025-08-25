import { IEpisodeService } from "../../Domain/services/episode/IEpisodeService";
import { AddContentDto } from "../../Domain/DTOs/content/AddContentDto";
import { IEpisodeRepository } from "../../Domain/repositories/episode/IEpisodeReporsitory";


export class EpisodeService implements IEpisodeService {
  constructor(private repo: IEpisodeRepository) {}

  getEpisodes(id: number) {
  return this.repo.getEpisodes(id);
    }
}
