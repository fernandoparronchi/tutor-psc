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

export interface SRSQuestion {
    id: string;
    unitId: number;
    question: string;
    answer: string;
    topic: string;
}

export interface SRSItem {
    questionId: string;
    box: number; // 0-5 (Leitner)
    nextReview: number; // timestamp
    lastReviewed: number; // timestamp
    history: number[]; // 0=No lo sé, 1=Dudé, 2=Lo sé (history of ratings)
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
    srsItems: Record<string, SRSItem>; // questionId -> Item data
    streak: number;
    lastStudyDate: string; // ISO date
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
