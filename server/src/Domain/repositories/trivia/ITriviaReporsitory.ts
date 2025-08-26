
export interface TriviaItem {
  trivia_id: number;
  trivia_text: string;
}

export interface ITriviaRepository {
  getTrivia(id: number): Promise<TriviaItem[]>;
  addMany(contentId: number, items: string[]): Promise<void>;
}


  
