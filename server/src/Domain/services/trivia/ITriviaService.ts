import type {
  TriviaItem,
} from "../../repositories/trivia/ITriviaReporsitory";

export interface ITriviaService {
  getTrivia(id: number): Promise<TriviaItem[]>;
}
