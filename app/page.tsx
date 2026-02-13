"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Mock progress loading
    setTimeout(() => setProgress(35), 500);
  }, []);

  const tasks = [
    { id: 1, title: "Escuchar Unidad 2: Resumen", completed: true, type: "audio" },
    { id: 2, title: "Quiz: Revolución Industrial", completed: false, type: "quiz" },
    { id: 3, title: "Repaso Flashcards: Imperialismo", completed: false, type: "flashcards" },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Greeting */}
      <section>
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
          Hola, Estudiante.
        </h2>
        <p className="text-xl text-gray-400">
          Faltan <span className="text-primary-400 font-bold">10 días</span> para el final libre.
          Hoy es un buen día para avanzar.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Progress */}
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl text-primary-500/20 font-bold group-hover:scale-110 transition-transform">
            %
          </div>
          <h3 className="text-lg font-medium text-gray-300">Progreso Total</h3>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-bold text-white">{progress}%</span>
            <span className="text-sm text-gray-400 mb-2">del programa cubierto</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Streak */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-medium text-gray-300">Racha de Estudio</h3>
          <div className="mt-4">
            <span className="text-5xl font-bold text-white">3</span>
            <span className="text-sm text-gray-400 ml-2">días seguidos</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">¡Mantén el ritmo para fijar conocimientos!</p>
        </div>

        {/* Weak Spot */}
        <div className="glass p-6 rounded-2xl border-l-4 border-l-red-500">
          <h3 className="text-lg font-medium text-gray-300">Foco Sugerido</h3>
          <p className="mt-2 text-white font-medium">Unidad 3: Revolución Francesa</p>
          <p className="text-xs text-gray-500 mt-1">Tu rendimiento en quizzes fue bajo (40%).</p>
          <Link href="/unidad/3" className="mt-4 inline-block text-sm text-primary-400 hover:text-primary-300 font-medium">
            Ir a repasar →
          </Link>
        </div>
      </section>

      {/* Today's Plan */}
      <section>
        <h3 className="text-2xl font-heading font-bold text-white mb-6">Plan para Hoy</h3>
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden divide-y divide-dark-border">
          {tasks.map((task) => (
            <div key={task.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                  task.completed ? "bg-primary-500 border-primary-500" : "border-gray-600 group-hover:border-primary-400"
                )}>
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={cn("font-medium", task.completed ? "text-gray-500 line-through" : "text-gray-200")}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{task.type}</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm bg-dark-bg border border-dark-border rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all">
                {task.completed ? "Repetir" : "Iniciar"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
