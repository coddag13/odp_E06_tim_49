import { IContentService } from "../../Domain/services/content/IContentServise";
import { IContentRepository } from "../../Domain/repositories/content/IContentReporsitory";

export class ContentService implements IContentService {
  constructor(private repo: IContentRepository) {}
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }) {
    return this.repo.list(params);
  }
}
