"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types";
import { cn } from "@/lib/utils";

interface QuizProps {
    questions: QuizQuestion[];
    onComplete: (score: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleOptionClick = (index: number) => {
        if (showExplanation) return;
        setSelectedOption(index);
    };

    const checkAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === questions[currentIndex].correctAnswer;
        if (isCorrect) setScore(score + 1);
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
            onComplete(score + (selectedOption === questions[currentIndex].correctAnswer ? 1 : 0)); // Add last point if correct
        }
    };

    if (isFinished) {
        return (
            <div className="text-center p-8 bg-dark-card border border-dark-border rounded-2xl">
                <h3 className="text-3xl font-bold text-white mb-4">¡Quiz Completado!</h3>
                <div className="text-6xl font-bold text-primary-500 mb-6">
                    {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-gray-400 mb-8">
                    Acertaste {score} de {questions.length} preguntas.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-dark-border text-white rounded-xl hover:bg-gray-700 transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        Volver al menú
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-primary-500 h-full transition-all duration-300"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8">
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2 block">
                    Pregunta {currentIndex + 1} de {questions.length}
                </span>
                <h3 className="text-xl font-bold text-white mb-6">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let buttonStyle = "bg-dark-card border-dark-border hover:bg-white/5 hover:border-gray-600 text-gray-300";

                        if (showExplanation) {
                            if (index === currentQuestion.correctAnswer) {
                                buttonStyle = "bg-green-900/20 border-green-500/50 text-green-100 ring-1 ring-green-500/50"; // Highlight Correct
                            } else if (index === selectedOption) {
                                buttonStyle = "bg-red-900/20 border-red-500/50 text-red-100 ring-1 ring-red-500/50"; // Highlight Wrong Selection
                            } else {
                                buttonStyle = "opacity-40 cursor-not-allowed border-dark-border";
                            }
                        } else if (selectedOption === index) {
                            buttonStyle = "bg-primary-500/20 border-primary-500 text-primary-100 ring-1 ring-primary-500/50";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                disabled={showExplanation}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm md:text-base flex justify-between items-center",
                                    buttonStyle
                                )}
                            >
                                <span>{option}</span>
                                {showExplanation && index === currentQuestion.correctAnswer && (
                                    <span className="text-green-400 font-bold">✓</span>
                                )}
                                {showExplanation && index === selectedOption && index !== currentQuestion.correctAnswer && (
                                    <span className="text-red-400 font-bold">✗</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {showExplanation && (
                    <div className={cn(
                        "mt-6 p-6 rounded-xl border animate-in fade-in slide-in-from-top-2",
                        selectedOption === currentQuestion.correctAnswer
                            ? "bg-green-900/10 border-green-500/20"
                            : "bg-red-900/10 border-red-500/20"
                    )}>
                        <h4 className={cn(
                            "font-bold mb-2 flex items-center gap-2 text-lg",
                            selectedOption === currentQuestion.correctAnswer ? "text-green-400" : "text-red-400"
                        )}>
                            {selectedOption === currentQuestion.correctAnswer ? "¡Correcto!" : "Respuesta Incorrecta"}
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                            <span className="font-bold text-white block mb-1">Explicación:</span>
                            {currentQuestion.explanation || "No hay explicación disponible para esta pregunta."}
                        </p>
                    </div>
                )}

                <div className="mt-8 flex justify-end">
                    {!showExplanation ? (
                        <button
                            onClick={checkAnswer}
                            disabled={selectedOption === null}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 active:scale-95"
                        >
                            Verificar Respuesta
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 hover:scale-105 active:scale-95"
                        >
                            {currentIndex === questions.length - 1 ? "Ver Resultados" : "Siguiente Pregunta →"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
