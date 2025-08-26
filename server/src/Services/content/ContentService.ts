import { IContentService } from "../../Domain/services/content/IContentService";
import { IContentRepository } from "../../Domain/repositories/content/IContentReporsitory";
import { AddContentDto } from "../../Domain/DTOs/content/AddContentDto";
import { IEpisodeRepository } from "../../Domain/repositories/episode/IEpisodeReporsitory";
import { ITriviaRepository } from "../../Domain/repositories/trivia/ITriviaReporsitory";

export class ContentService implements IContentService {
  constructor(
    private repo: IContentRepository,
    private triviaRepo?: ITriviaRepository,
    private episodeRepo?: IEpisodeRepository
  ) {}

  list(p?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }) {
    return this.repo.list(p);
  }
  getById(id: number) {
    return this.repo.getById(id);
  }
  rate(contentId: number, rating: number, _userId: number) {
    return this.repo.rate(contentId, rating);
  }

  async create(dto: AddContentDto) {
  const created = await this.repo.create(dto);
  const contentId: number = Number((created as any)?.content_id ?? (created as any)?.id ?? created);

  if (this.triviaRepo && dto.trivia) {
    const items = Array.isArray(dto.trivia)
      ? dto.trivia
      : String(dto.trivia).split(/\r?\n|;|•| - /).map(s => s.trim()).filter(Boolean);
    if (items.length) {
      await this.triviaRepo.addMany(contentId, items);
    }
  }

  if (dto.type === "series" && this.episodeRepo && Array.isArray(dto.episodes) && dto.episodes.length) {
    const eps = dto.episodes.map(e => ({
      season_number: Number(e.season_number),
      episode_number: Number(e.episode_number),
      title: String(e.title),
      description: e.description ?? null,
      cover_image: e.cover_image ?? null,
    }));
    await this.episodeRepo.addMany(contentId, eps);
  }
  
  return { content_id: contentId };
}
}
