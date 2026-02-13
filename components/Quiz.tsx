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
                        let buttonStyle = "bg-gray-800/50 border-gray-700 hover:bg-gray-800";
                        if (showExplanation) {
                            if (index === currentQuestion.correctAnswer) {
                                buttonStyle = "bg-green-500/20 border-green-500 text-green-400";
                            } else if (index === selectedOption) {
                                buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                            } else {
                                buttonStyle = "opacity-50 cursor-not-allowed";
                            }
                        } else if (selectedOption === index) {
                            buttonStyle = "bg-primary-500/20 border-primary-500 text-primary-400";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                disabled={showExplanation}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all text-sm md:text-base",
                                    buttonStyle
                                )}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {showExplanation && (
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                        <p className="font-bold text-blue-400 mb-1">Explicación:</p>
                        <p className="text-sm text-blue-200">{currentQuestion.explanation}</p>
                    </div>
                )}

                <div className="mt-8 flex justify-end">
                    {!showExplanation ? (
                        <button
                            onClick={checkAnswer}
                            disabled={selectedOption === null}
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Verificar
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors"
                        >
                            {currentIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
