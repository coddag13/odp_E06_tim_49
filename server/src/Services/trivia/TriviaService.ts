import { ITriviaService } from "../../Domain/services/trivia/ITriviaService";
import { ITriviaRepository, TriviaItem } from "../../Domain/repositories/trivia/ITriviaReporsitory";

export class TriviService implements ITriviaService {
  constructor(private repo: ITriviaRepository) {}

  getTrivia(id: number) {
      return this.repo.getTrivia(id);
  }

}

