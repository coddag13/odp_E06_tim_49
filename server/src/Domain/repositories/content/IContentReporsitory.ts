export interface IContentRepository {
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }):
    Promise<Array<{ content_id: number; title: string }>>;
}
