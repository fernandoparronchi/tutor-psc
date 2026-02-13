"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OralData, OralSection } from "@/types";
import AudioPlayer from "@/components/AudioPlayer";

type Layer = "summary" | "academic" | "grounded";

interface OralGuideClientProps {
    data: OralData;
}

export default function OralGuideClient({ data }: OralGuideClientProps) {
    const [layer, setLayer] = useState<Layer>("academic");
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [activeSection, setActiveSection] = useState<string>("");

    // Load state from localStorage on mount
    useEffect(() => {
        const savedLayer = localStorage.getItem("oral_layer") as Layer;
        if (savedLayer) setLayer(savedLayer);

        const savedExpanded = localStorage.getItem("oral_expanded");
        if (savedExpanded) {
            try {
                setExpandedSections(new Set(JSON.parse(savedExpanded)));
            } catch (e) {
                console.error("Error parsing saved expanded sections", e);
            }
        }
    }, []);

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem("oral_layer", layer);
    }, [layer]);

    useEffect(() => {
        localStorage.setItem("oral_expanded", JSON.stringify(Array.from(expandedSections)));
    }, [expandedSections]);

    const toggleSection = (id: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedSections(newExpanded);
    };

    const expandAll = () => {
        setExpandedSections(new Set(data.sections.map(s => s.id)));
    };

    const collapseAll = () => {
        setExpandedSections(new Set());
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setActiveSection(id);
            if (!expandedSections.has(id)) {
                toggleSection(id);
            }
        }
    };

    // Construct full audio text based on current layer (or just academic for consistency?)
    // The user requested: "Convertir la Guía Oral en “estudio en capas”: TOC, secciones colapsables, resumen 30s / académico / a tierra."
    // Audio probably should stick to one version or be dynamic? Assuming static for now or just the academic one as "master".
    // Or maybe just combine all current visible text? Let's use the academic version for the full audio to avoid complexity, or maybe just the 'intro' + sections content.
    // The previous implementation used data.intro + sections.map(s => s.content) etc. 
    // Now content is an object. Let's use the "academic" version for the global audio for now as it's the "complete" one.
    const fullAudioText = `${data.title}. ${data.intro}. ${data.sections.map(s => `${s.title}. ${s.content.academic}`).join(" ")}. Consejos finales: ${data.tips.join(" ")}`;

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-20">
            {/* Sidebar / TOC */}
            <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
                <div className="sticky top-24 space-y-6">
                    <div className="glass p-4 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Tabla de Contenidos</h3>
                        <nav className="space-y-1">
                            {data.sections.map((section, idx) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                                            ? "bg-primary-500/20 text-primary-400 font-medium"
                                            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                        }`}
                                >
                                    {idx + 1}. {section.title.split(":")[0]}
                                </button>
                            ))}
                        </nav>
                        <div className="mt-6 flex gap-2 text-xs">
                            <button onClick={expandAll} className="text-gray-400 hover:text-white">Expandir todo</button>
                            <span>|</span>
                            <button onClick={collapseAll} className="text-gray-400 hover:text-white">Colapsar todo</button>
                        </div>
                    </div>

                    <div className="glass p-4 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Nivel de Profundidad</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setLayer("summary")}
                                className={`w-full px-4 py-3 rounded-xl border text-left transition-all ${layer === "summary"
                                        ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                                        : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                <div className="font-bold text-sm">⚡ Resumen 30s</div>
                                <div className="text-xs opacity-70">Puntos clave rápidos</div>
                            </button>
                            <button
                                onClick={() => setLayer("academic")}
                                className={`w-full px-4 py-3 rounded-xl border text-left transition-all ${layer === "academic"
                                        ? "bg-primary-500/10 border-primary-500 text-primary-400"
                                        : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                <div className="font-bold text-sm">🎓 Académico</div>
                                <div className="text-xs opacity-70">Nivel universitario</div>
                            </button>
                            <button
                                onClick={() => setLayer("grounded")}
                                className={`w-full px-4 py-3 rounded-xl border text-left transition-all ${layer === "grounded"
                                        ? "bg-green-500/10 border-green-500 text-green-400"
                                        : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                <div className="font-bold text-sm">🌱 A Tierra</div>
                                <div className="text-xs opacity-70">Explicación simple</div>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-8 order-1 lg:order-2">
                {/* Header */}
                <header className="text-center space-y-6 mb-12">
                    <span className="inline-block px-4 py-1 rounded-full bg-primary-900/30 text-primary-400 border border-primary-500/30 text-sm font-bold uppercase tracking-widest">
                        Modo Final Oral
                    </span>
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
                        {data.title}
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {data.description}
                    </p>

                    <div className="flex justify-center mt-6">
                        <AudioPlayer text={fullAudioText} title="Escuchar Guía Completa (Académica)" />
                    </div>
                </header>

                {/* Introduction */}
                <div className="glass p-8 rounded-2xl border-l-4 border-l-yellow-500">
                    <h3 className="text-xl font-bold text-white mb-4">💡 La Clave del Éxito</h3>
                    <p className="text-gray-300 text-lg leading-relaxed italic">
                        {data.intro}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {data.sections.map((section, idx) => {
                        const isExpanded = expandedSections.has(section.id);
                        return (
                            <section
                                key={section.id}
                                id={section.id}
                                className="glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                                    aria-expanded={isExpanded}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 rounded-full bg-primary-900/50 text-primary-400 flex items-center justify-center font-bold border border-primary-500/20">
                                            {idx + 1}
                                        </span>
                                        <h2 className="text-xl font-bold text-white">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <svg
                                        className={`w-6 h-6 text-gray-400 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isExpanded && (
                                    <div className="p-6 pt-0 animate-fadeIn">
                                        <div className={`prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed border-t border-white/5 pt-6 ${layer === "summary" ? "text-yellow-100" :
                                                layer === "grounded" ? "text-green-100" :
                                                    "text-gray-300"
                                            }`}>
                                            {section.content[layer]}
                                        </div>
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-primary-900/20 to-purple-900/20 p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">🔥</span> Consejos para el Oral
                    </h3>
                    <ul className="space-y-4">
                        {data.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300">
                                <span className="text-green-400 font-bold">✓</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Bar */}
                <div className="flex justify-center gap-4 mt-8">
                    <Link
                        href="/simulacro"
                        className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                        Probar en Simulacro
                    </Link>
                    <Link
                        href="/unidad/1"
                        className="px-8 py-3 rounded-full bg-primary-600 text-white font-bold hover:bg-primary-500 shadow-lg shadow-primary-600/20 transition-all hover:scale-105"
                    >
                        Ir a Unidad 1
                    </Link>
                </div>
            </main>
        </div>
    );
}
