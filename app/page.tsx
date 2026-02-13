"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { loadProgress, getDueItems } from "@/lib/srs";

export default function Dashboard() {
  const [progress, setProgress] = useState(0);
  const [srsDueCount, setSrsDueCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load real progress
    const srsData = loadProgress();
    const due = getDueItems(srsData);
    setSrsDueCount(due.length);

    // Mock general progress for now (could be calculated from SRS mastery items / total items)
    // For demo purposes:
    const totalItems = Object.keys(srsData).length || 50; // default denominator
    const masteredItems = Object.values(srsData).filter(i => i.box > 3).length;
    setProgress(Math.round((masteredItems / totalItems) * 100) || 15); // Default 15% start

    // Mock streak
    setStreak(3);
  }, []);

  const todayTasks = [
    {
      id: "srs",
      title: `Repaso Diario (${srsDueCount} pendientes)`,
      completed: srsDueCount === 0,
      type: "SRS",
      href: "/repaso"
    },
    {
      id: "oral",
      title: "Estudiar Guía Final Oral",
      completed: false,
      type: "oral",
      href: "/oral"
    },
    {
      id: "simulacro",
      title: "Simulacro de Examen",
      completed: false,
      type: "simulacro",
      href: "/simulacro"
    },
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
          <h3 className="text-lg font-medium text-gray-300">Dominio Real (SRS)</h3>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-bold text-white">{progress}%</span>
            <span className="text-sm text-gray-400 mb-2">del contenido maestro</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* SRS Card (Replaces Streak for now or combined) */}
        <Link href="/repaso" className="glass p-6 rounded-2xl block hover:border-primary-500/50 transition-colors group">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">Repaso Espaciado</h3>
            <span className="text-2xl">🧠</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${srsDueCount > 0 ? "text-primary-400" : "text-green-400"}`}>
                {srsDueCount}
              </span>
              <span className="text-sm text-gray-400">pendientes hoy</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {srsDueCount > 0 ? "¡No rompas la cadena de olvido!" : "¡Todo al día! Gran trabajo."}
          </p>
        </Link>

        {/* Streak / Weak Spot Combined */}
        <div className="glass p-6 rounded-2xl border-l-4 border-l-yellow-500">
          <h3 className="text-lg font-medium text-gray-300">Racha Actual</h3>
          <div className="mt-4">
            <span className="text-5xl font-bold text-white">{streak}</span>
            <span className="text-sm text-gray-400 ml-2">días seguidos</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Próximo hito: 7 días</p>
        </div>
      </section>

      {/* Today's Plan */}
      <section>
        <h3 className="text-2xl font-heading font-bold text-white mb-6">Plan para Hoy</h3>
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden divide-y divide-dark-border">
          {todayTasks.map((task) => (
            <Link
              key={task.id}
              href={task.href}
              className="block p-5 hover:bg-white/5 transition-colors group relative border-b border-dark-border last:border-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                    task.completed ? "bg-green-500 border-green-500" : "border-gray-600 group-hover:border-primary-400"
                  )}>
                    {task.completed && (
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span
                  className={cn(
                    "px-4 py-2 text-sm bg-dark-bg border rounded-lg transition-all",
                    task.completed
                      ? "border-green-900/30 text-green-500"
                      : "border-dark-border text-gray-300 group-hover:text-white group-hover:border-gray-500"
                  )}
                >
                  {task.completed ? "Completado" : "Iniciar"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
