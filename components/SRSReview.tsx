"use client";

import { useState, useEffect } from "react";
import { SRSQuestion, SRSItem } from "@/types";
import { processReview, loadProgress, saveProgress, getDueItems } from "@/lib/srs";

interface SRSReviewProps {
    questions: SRSQuestion[];
}

export default function SRSReview({ questions }: SRSReviewProps) {
    const [progress, setProgress] = useState<Record<string, SRSItem>>({});
    const [dueQueue, setDueQueue] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });

    useEffect(() => {
        // Load progress or initialize if empty
        const saved = loadProgress();
        const initialProgress = { ...saved };
        let hasChanges = false;

        // Ensure all questions exist in progress
        questions.forEach(q => {
            if (!initialProgress[q.id]) {
                initialProgress[q.id] = {
                    questionId: q.id,
                    box: 0,
                    nextReview: Date.now(),
                    lastReviewed: 0,
                    history: []
                };
                hasChanges = true;
            }
        });

        if (hasChanges) {
            saveProgress(initialProgress);
        }

        setProgress(initialProgress);
        const due = getDueItems(initialProgress);
        setDueQueue(due);
    }, [questions]);

    const handleRate = (rating: "hard" | "medium" | "easy") => {
        const currentId = dueQueue[currentQuestionIndex];
        const item = progress[currentId];

        if (!item) return;

        const updatedItem = processReview(item, rating);
        const newProgress = { ...progress, [currentId]: updatedItem };

        setProgress(newProgress);
        saveProgress(newProgress);
        setSessionStats(prev => ({
            reviewed: prev.reviewed + 1,
            correct: prev.correct + (rating === "easy" ? 1 : 0)
        }));

        setIsFlipped(false);
        if (currentQuestionIndex < dueQueue.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // End of session
            setDueQueue([]); // Clear queue to trigger "Done" state
        }
    };

    if (dueQueue.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">¡Todo listo por hoy!</h2>
                <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                    Has repasado todas las tarjetas pendientes. ¡Gran trabajo!
                </p>
                {sessionStats.reviewed > 0 && (
                    <div className="bg-white/5 inline-block px-8 py-4 rounded-xl border border-white/10">
                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Repasadas hoy</div>
                        <div className="text-3xl font-bold text-primary-400">{sessionStats.reviewed}</div>
                    </div>
                )}
            </div>
        );
    }

    const currentQId = dueQueue[currentQuestionIndex];
    const currentQ = questions.find(q => q.id === currentQId);

    if (!currentQ) return <div>Cargando pregunta...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Progreso: {currentQuestionIndex + 1} / {dueQueue.length}</span>
                <span>Caja: {progress[currentQId]?.box || 0}</span>
            </div>

            {/* Flashcard */}
            <div
                className="perspective-1000 group cursor-pointer h-[400px]"
                onClick={() => !isFlipped && setIsFlipped(true)}
            >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-dark-card border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                        <span className="absolute top-6 left-6 text-xs font-bold px-2 py-1 rounded bg-primary-500/20 text-primary-400 uppercase tracking-wider">
                            {currentQ.topic}
                        </span>
                        <h3 className="text-2xl font-bold text-white leading-relaxed">
                            {currentQ.question}
                        </h3>
                        <p className="absolute bottom-6 text-sm text-gray-500 animate-pulse">
                            (Toca para ver la respuesta)
                        </p>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-800 border border-primary-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                        <span className="absolute top-6 left-6 text-xs font-bold px-2 py-1 rounded bg-gray-700 text-gray-300 uppercase tracking-wider">
                            Respuesta
                        </span>
                        <p className="text-xl text-white leading-relaxed">
                            {currentQ.answer}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {isFlipped ? (
                <div className="grid grid-cols-3 gap-4 animate-fadeIn">
                    <button
                        onClick={() => handleRate("hard")}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 font-bold hover:bg-red-500/20 transition-all hover:-translate-y-1"
                    >
                        No lo sé
                        <div className="text-xs font-normal opacity-70 mt-1">Reiniciar</div>
                    </button>
                    <button
                        onClick={() => handleRate("medium")}
                        className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 font-bold hover:bg-yellow-500/20 transition-all hover:-translate-y-1"
                    >
                        Dudé
                        <div className="text-xs font-normal opacity-70 mt-1">Mantener</div>
                    </button>
                    <button
                        onClick={() => handleRate("easy")}
                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/50 text-green-400 font-bold hover:bg-green-500/20 transition-all hover:-translate-y-1"
                    >
                        Lo sé
                        <div className="text-xs font-normal opacity-70 mt-1">Avanzar</div>
                    </button>
                </div>
            ) : (
                <div className="h-[88px] flex items-center justify-center">
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="px-8 py-3 rounded-full bg-primary-600 font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500 transition-all"
                    >
                        Mostrar Respuesta
                    </button>
                </div>
            )}
        </div>
    );
}
