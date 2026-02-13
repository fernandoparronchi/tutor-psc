"use client";

import { useState, useEffect } from "react";
import { QuizQuestion, Unit } from "@/types";
import { cn } from "@/lib/utils";

export default function SimulacroPage() {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<(QuizQuestion & { unitId: number })[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // questionIndex -> selectedOption
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const loadSimulacro = async () => {
            try {
                // Fetch syllabus to know how many units there are
                const syllabusRes = await fetch("/data/syllabus.json");
                const syllabusData = await syllabusRes.json();
                const units: Unit[] = syllabusData.unidades;

                let allQuestions: (QuizQuestion & { unitId: number })[] = [];

                // Fetch questions from all units
                for (const unit of units) {
                    const res = await fetch(`/data/unit${unit.numero}.json`);
                    const data = await res.json();

                    // Handle potential nested structure
                    const content = data[`unit${unit.numero}`] || data;

                    if (content.quiz) {
                        const unitQuestions = content.quiz.map((q: QuizQuestion) => ({
                            ...q,
                            unitId: unit.numero
                        }));
                        // Take 2 random questions from each unit for the mix
                        const shuffled = unitQuestions.sort(() => 0.5 - Math.random());
                        allQuestions = [...allQuestions, ...shuffled.slice(0, 3)]; // 3 questions per unit -> 15 total
                    }
                }

                setQuestions(allQuestions.sort(() => 0.5 - Math.random())); // Shuffle final exam
                setLoading(false);
            } catch (error) {
                console.error("Error creating simulacro:", error);
                setLoading(false);
            }
        };

        loadSimulacro();
    }, []);

    const handleSelect = (questionIndex: number, optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-bold text-white">Generando Examen...</h2>
                <p className="text-gray-400">Seleccionando preguntas de todas las unidades.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="text-center space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider border border-red-500/20">
                    Modo Evaluación
                </span>
                <h1 className="text-4xl font-heading font-bold text-white">Simulacro de Final</h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Este examen combina preguntas de las 5 unidades.
                    {!isSubmitted ? " Responde todas las preguntas y al final verás tu nota." : " Revisa tus resultados."}
                </p>
            </header>

            {isSubmitted && (
                <div className="glass p-8 rounded-2xl border-l-4 border-l-primary-500 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Resultados</h2>
                    <div className="flex items-end gap-3 mb-4">
                        <span className="text-6xl font-bold text-primary-500">{Math.round((score / questions.length) * 10).toFixed(1)}</span>
                        <span className="text-xl text-gray-400 mb-2">/ 10</span>
                    </div>
                    <p className="text-gray-300">
                        Has acertado <strong className="text-white">{score}</strong> de <strong className="text-white">{questions.length}</strong> preguntas.
                        {score / questions.length >= 0.6
                            ? <span className="text-green-400 font-bold ml-2">¡Aprobado! 🎉</span>
                            : <span className="text-red-400 font-bold ml-2">Necesitas repasar más. 📚</span>
                        }
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-dark-bg border border-dark-border rounded-lg text-white hover:bg-white/5 transition-colors"
                    >
                        Generar Nuevo Examen
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {questions.map((q, idx) => {
                    const isCorrect = answers[idx] === q.correctAnswer;
                    const isSelected = answers[idx] !== undefined;

                    return (
                        <div key={idx} className={cn(
                            "glass p-6 rounded-2xl border transition-colors",
                            isSubmitted
                                ? (isCorrect ? "border-green-500/30 bg-green-900/10" : "border-red-500/30 bg-red-900/10")
                                : "border-white/5 hover:border-white/10"
                        )}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Pregunta {idx + 1} • Unidad {q.unitId}
                                </span>
                                {isSubmitted && (
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-1 rounded",
                                        isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                    )}>
                                        {isCorrect ? "CORRECTA" : "INCORRECTA"}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-white mb-6 leading-relaxed">
                                {q.question}
                            </h3>

                            <div className="space-y-3">
                                {q.options.map((opt, optIdx) => {
                                    let style = "bg-dark-bg/50 border-dark-border hover:bg-dark-bg";

                                    if (isSubmitted) {
                                        if (optIdx === q.correctAnswer) {
                                            style = "bg-green-500/20 border-green-500 text-green-400";
                                        } else if (answers[idx] === optIdx) {
                                            style = "bg-red-500/20 border-red-500 text-red-400";
                                        } else {
                                            style = "opacity-50";
                                        }
                                    } else if (answers[idx] === optIdx) {
                                        style = "bg-primary-500/20 border-primary-500 text-primary-400";
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleSelect(idx, optIdx)}
                                            disabled={isSubmitted}
                                            className={cn(
                                                "w-full text-left p-4 rounded-xl border transition-all text-sm",
                                                style
                                            )}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>

                            {isSubmitted && !isCorrect && (
                                <div className="mt-4 p-4 rounded-xl bg-red-900/20 border border-red-500/20 text-sm text-red-200">
                                    <strong className="block text-red-400 mb-1">Corrección:</strong>
                                    {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!isSubmitted && (
                <div className="sticky bottom-8 flex justify-center pt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < questions.length}
                        className="px-8 py-4 bg-primary-600 text-white font-bold rounded-full shadow-lg shadow-primary-600/30 hover:bg-primary-500 hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                    >
                        {Object.keys(answers).length < questions.length
                            ? `Respondiste ${Object.keys(answers).length} de ${questions.length}`
                            : "Entregar Examen"
                        }
                    </button>
                </div>
            )}
        </div>
    );
}
