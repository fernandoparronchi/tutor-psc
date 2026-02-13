export interface Unit {
    numero: number;
    titulo: string;
    objetivos: string[];
    temas: string[];
    duracion?: string;
}

export interface UnitContent {
    summary: string;
    deep_dive?: string;
    key_concepts?: KeyConcept[];
    timeline?: TimelineEvent[];
    quiz: QuizQuestion[];
    flashcards: Flashcard[];
    faq: FAQ[];
}

export interface KeyConcept {
    term: string;
    definition: string;
}

export interface TimelineEvent {
    year: string;
    event: string;
    description: string;
    duracion?: string; // e.g. "2 semanas"
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

export interface OralSection {
    id: string;
    title: string;
    content: {
        summary: string;     // Resumen 30s
        academic: string;    // Nivel Universitario (lo actual)
        grounded: string;    // A tierra / Explicación simple
    };
}

export interface OralData {
    title: string;
    description: string;
    intro: string;
    sections: OralSection[];
    tips: string[];
}
