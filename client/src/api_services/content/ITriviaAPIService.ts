import type {TriviaItem } from "../../types/content/Trivia";

export interface IContentAPIService {
  getTrivia(id: number): Promise<TriviaItem[]>;
}
