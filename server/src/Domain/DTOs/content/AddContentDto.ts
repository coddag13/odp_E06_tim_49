import { EpisodeDto } from "./EpisodeDto";

export class AddContentDto {
  constructor(
    public title: string,
    public type: "movie" | "series",
    public description: string | null = null,
    public release_date: string | null = null, // 'YYYY-MM-DD'
    public cover_image: string | null = null,
    public genre: string | null = null,
    public trivia: string | null = null,
    public episodes?: EpisodeDto[]
  ) {}
}