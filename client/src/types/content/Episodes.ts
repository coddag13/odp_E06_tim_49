
export interface EpisodeItem {
  episode_id: number;
  season_number: number;
  episode_number: number;
  title: string;
  description?: string | null;
  cover_image?: string | null;
}