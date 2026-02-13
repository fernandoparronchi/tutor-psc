"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";

interface OralSection {
    id: string;
    title: string;
    content: string;
}

interface OralData {
    title: string;
    description: string;
    intro: string;
    sections: OralSection[];
    tips: string[];
}

export default function OralPrepPage() {
    const [data, setData] = useState<OralData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/data/oral_prep.json")
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center text-primary-500 animate-pulse mt-20">Cargando Guía Maestra...</div>;
    if (!data) return <div className="text-center text-red-500 mt-20">Error al cargar la guía.</div>;


    // Combine all content for the audio player
    const fullAudioText = data
        ? `${data.title}. ${data.intro}. ${data.sections.map(s => `${s.title}. ${s.content}`).join(" ")}. Consejos finales: ${data.tips.join(" ")}`
        : "";

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <header className="text-center space-y-6">
                <span className="inline-block px-4 py-1 rounded-full bg-primary-900/30 text-primary-400 border border-primary-500/30 text-sm font-bold uppercase tracking-widest">
                    Modo Final Oral
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
                    {data.title}
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    {data.description}
                </p>

                <div className="flex justify-center mt-6">
                    <AudioPlayer text={fullAudioText} title="Guía Completa para el Final" />
                </div>
            </header>

            {/* Introduction Card */}
            <div className="glass p-8 rounded-2xl border-l-4 border-l-yellow-500">
                <h3 className="text-xl font-bold text-white mb-4">💡 La Clave del Éxito</h3>
                <p className="text-gray-300 text-lg leading-relaxed italic">
                    {data.intro}
                </p>
            </div>

            {/* Script Sections */}
            <div className="space-y-12 relative">
                {/* Connecting Line */}
                <div className="absolute left-[27px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary-500 via-purple-500 to-blue-500 hidden md:block opacity-30"></div>

                {data.sections.map((section, idx) => (
                    <div key={section.id} className="relative md:pl-16 group">
                        {/* Number Bubble */}
                        <div className="absolute left-0 top-0 w-14 h-14 hidden md:flex items-center justify-center rounded-full bg-dark-bg border-2 border-primary-500 text-primary-500 font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10 group-hover:scale-110 transition-transform">
                            {idx + 1}
                        </div>

                        {/* Content Card */}
                        <div className="glass p-8 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-all hover:shadow-2xl hover:shadow-primary-900/20">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                {section.title}
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pro Tips */}
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
            <div className="flex justify-center gap-4">
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
        </div>
    );
}
