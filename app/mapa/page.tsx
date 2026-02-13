"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Unit } from "@/types";

export default function MapaPage() {
    const [units, setUnits] = useState<Unit[]>([]);

    useEffect(() => {
        fetch("/data/syllabus.json")
            .then((res) => res.json())
            .then((data) => setUnits(data.unidades))
            .catch((err) => console.error("Error loading syllabus:", err));
    }, []);

    return (
        <div className="space-y-8">
            <header className="mb-12">
                <h1 className="text-4xl font-heading font-bold text-white mb-4">Mapa del Programa</h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                    Navega por las 5 unidades clave de la materia. Tu ruta hacia el dominio de los Procesos Sociales Contemporáneos.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                    <Link href={`/unidad/${unit.numero}`} key={unit.numero} className="group">
                        <div className="glass h-full p-8 rounded-2xl border border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                            {/* Number Background */}
                            <div className="absolute -right-4 -bottom-8 text-9xl font-bold text-white/5 group-hover:text-primary-500/10 transition-colors pointer-events-none select-none">
                                {unit.numero}
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
                                    Unidad {unit.numero}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">
                                    {unit.titulo}
                                </h3>
                                <ul className="space-y-2 mb-6">
                                    {unit.temas.slice(0, 3).map((tema, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 group-hover:bg-primary-500 transition-colors"></span>
                                            <span className="line-clamp-2">{tema}</span>
                                        </li>
                                    ))}
                                    {unit.temas.length > 3 && (
                                        <li className="text-xs text-gray-500 pl-3.5 italic">
                                            +{unit.temas.length - 3} temas más...
                                        </li>
                                    )}
                                </ul>

                                <span className="inline-flex items-center text-sm font-medium text-primary-400 group-hover:text-primary-300 transition-colors">
                                    Explorar Unidad
                                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
