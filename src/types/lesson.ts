export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;     
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  questions: QuizQuestion[];
  nftMetadata: {
    name: string;
    symbol: string;
    uri: string;
  };
}
