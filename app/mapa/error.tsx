"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
            <h2 className="text-2xl font-bold text-red-400">¡Ups! Algo salió mal.</h2>
            <p className="text-gray-400 max-w-md">
                No pudimos cargar el mapa del programa. Esto puede ser un error temporal.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold transition-colors"
                >
                    Intentar de nuevo
                </button>
                <Link
                    href="/"
                    className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
