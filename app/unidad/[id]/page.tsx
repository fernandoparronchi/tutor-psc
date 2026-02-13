"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UnitContent, Unit } from "@/types";
import AudioPlayer from "@/components/AudioPlayer";
import Quiz from "@/components/Quiz";
import FlashcardDeck from "@/components/FlashcardDeck";
import { cn } from "@/lib/utils";

type Tab = "resumen" | "tutor" | "quiz" | "flashcards" | "profundizar";

export default function UnitPage() {
    const params = useParams();
    const id = params?.id as string;

    const [activeTab, setActiveTab] = useState<Tab>("resumen");
    const [data, setData] = useState<UnitContent | null>(null);
    const [unitInfo, setUnitInfo] = useState<Unit | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);

        // Load Unit Data
        Promise.all([
            fetch(`/data/unit${id}.json`).then(res => res.json()),
            fetch("/data/syllabus.json").then(res => res.json())
        ]).then(([unitData, syllabusData]) => {
            // Handle the nested structure from the JSON files
            const contentKey = `unit${id}`;
            const content = unitData[contentKey] || unitData; // Fallback if structure varies
            setData(content);

            const info = syllabusData.unidades.find((u: Unit) => u.numero === parseInt(id));
            setUnitInfo(info);
        }).catch(err => {
            console.error("Failed to load unit data", err);
        }).finally(() => {
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <div className="min-h-[50vh] flex items-center justify-center text-primary-500 animate-pulse">Cargando unidad...</div>;
    }

    if (!data || !unitInfo) {
        return <div className="text-center text-red-400">Error al cargar la unidad.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="border-b border-white/5 pb-8">
                <div className="flex items-center gap-3 text-sm text-primary-400 font-bold uppercase tracking-widest mb-2">
                    <span>Unidad {id}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span>Historia Social</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                    {unitInfo.titulo}
                </h1>
                <div className="flex flex-wrap gap-2">
                    {unitInfo.objetivos.slice(0, 2).map((obj, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">
                            🎯 {obj}
                        </span>
                    ))}
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 p-1 bg-dark-card/50 backdrop-blur-md border border-dark-border rounded-xl w-full md:w-fit overflow-x-auto">
                {[
                    { id: "resumen", label: "Resumen", icon: "📄" },
                    { id: "profundizar", label: "Profundizar", icon: "🧠" },
                    { id: "flashcards", label: "Flashcards", icon: "⚡" },
                    { id: "quiz", label: "Quiz", icon: "📝" },
                    { id: "tutor", label: "Tutor IA", icon: "🤖" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2",
                            activeTab === tab.id
                                ? "bg-primary-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === "resumen" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AudioPlayer text={data.summary} title={unitInfo.titulo} />

                        <div className="glass p-8 rounded-2xl border border-white/5 prose prose-invert prose-lg max-w-none">
                            <h3 className="text-xl font-bold text-white mb-4">Resumen de la Unidad</h3>
                            <span className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-xs font-bold border border-primary-500/30">
                                {unitInfo.duracion}
                            </span>
                            <a
                                href="https://notebooklm.google.com/notebook/4f3d8e20-9a21-445c-bb26-4f4e00720415"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
                            >
                                <span>✨ Studio AI (Mapas/Audio)</span>
                            </a>
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
                                {data.summary}
                            </div>
                        </div>

                        <div className="glass p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6">Preguntas Frecuentes</h3>
                            <div className="space-y-4">
                                {data.faq.map((item, i) => (
                                    <details key={i} className="group p-4 rounded-xl bg-white/5 open:bg-white/10 transition-colors">
                                        <summary className="font-medium text-gray-200 cursor-pointer list-none flex items-center justify-between">
                                            {item.question}
                                            <span className="transform group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "flashcards" && (
                    <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <FlashcardDeck cards={data.flashcards} />
                    </div>
                )}

                {activeTab === "quiz" && (
                    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Quiz questions={data.quiz} onComplete={(score) => console.log("Score:", score)} />
                    </div>
                )}

                {activeTab === "profundizar" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {data.deep_dive && (
                            <div className="glass p-8 rounded-2xl border border-white/5 prose prose-invert prose-lg max-w-none">
                                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Profundización Académica</h3>
                                <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
                                    {data.deep_dive}
                                </div>
                            </div>
                        )}

                        {data.timeline && (
                            <div className="glass p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                    <span className="text-2xl">⏳</span> Línea de Tiempo
                                </h3>
                                <div className="relative border-l-2 border-primary-500/30 ml-3 space-y-8">
                                    {data.timeline.map((event, i) => (
                                        <div key={i} className="relative pl-8">
                                            {/* Dot */}
                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-dark-bg border-2 border-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                                <span className="text-primary-400 font-bold font-mono text-lg">{event.year}</span>
                                                <h4 className="text-white font-bold text-lg">{event.event}</h4>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{event.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.key_concepts && (
                            <div className="glass p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-2xl">🔑</span> Conceptos Clave
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.key_concepts.map((concept, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-primary-500/30 transition-colors">
                                            <h4 className="text-primary-400 font-bold mb-2">{concept.term}</h4>
                                            <p className="text-sm text-gray-300 leading-snug">{concept.definition}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "tutor" && (
                    <div className="glass p-8 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                            🤖
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Tutor Virtual (IA)</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Estoy entrenado con los documentos oficiales de la cátedra. Pregúntame sobre cualquier tema de esta unidad.
                        </p>

                        {/* Placeholder Chat UI */}
                        <div className="max-w-xl mx-auto border border-dark-border rounded-xl h-[400px] flex flex-col bg-black/50 overflow-hidden">
                            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-left">
                                <div className="bg-primary-900/40 p-3 rounded-lg rounded-tl-none inline-block max-w-[80%] border border-primary-500/20">
                                    <p className="text-sm">¡Hola! Soy tu tutor de PSC. ¿Qué duda tienes sobre la Unidad {id}?</p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-dark-border flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Escribe tu pregunta..."
                                    className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                                />
                                <button className="p-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
