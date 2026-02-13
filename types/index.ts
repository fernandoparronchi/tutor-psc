export interface Unit {
    numero: number;
    titulo: string;
    objetivos: string[];
    temas: string[];
}

export interface UnitContent {
    summary: string;
    quiz: QuizQuestion[];
    flashcards: Flashcard[];
    faq: FAQ[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index of correct option
    explanation: string;
}

export interface Flashcard {
    front: string;
    back: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface UserProgress {
    completedUnits: number[];
    quizScores: Record<string, number>; // unitId -> score
    flashcardMastery: Record<string, number>; // cardId -> ease factor
    streak: number;
}
