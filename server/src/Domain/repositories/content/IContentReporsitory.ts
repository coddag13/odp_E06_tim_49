export interface ContentListItem {
  content_id: number;
  title: string;
  type: "movie" | "series";
  poster_url: string | null; // dolazi iz cover_image AS poster_url
}

export interface IContentRepository {
  list(params?: { q?: string; type?: "movie" | "series"; limit?: number; page?: number }):
    Promise<ContentListItem[]>;
}
