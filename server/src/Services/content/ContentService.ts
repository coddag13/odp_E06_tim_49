import { IContentService } from "../../Domain/services/content/IContentService";
import { IContentRepository } from "../../Domain/repositories/content/IContentReporsitory";
import { AddContentDto } from "../../Domain/DTOs/content/AddContentDto";

export class ContentService implements IContentService {
  constructor(private repo: IContentRepository) {}

  list(p?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }) {
    return this.repo.list(p);
  }
  getById(id: number) {
    return this.repo.getById(id);
  }

  rate(contentId: number, rating: number, _userId: number) {
    return this.repo.rate(contentId, rating);
  }

  create(dto: AddContentDto) {
    return this.repo.create(dto);
  }
}

