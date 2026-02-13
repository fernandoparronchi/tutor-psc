import Link from "next/link";
import { SRS_QUESTIONS } from "@/lib/data.server";
import SRSReview from "@/components/SRSReview";

export const metadata = {
    title: "Repaso Diario - Tutor PSC",
    description: "Sistema de Repaso Espaciado para dominar la materia.",
};

export default function RepasoPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-12 text-center">
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al Dashboard
                </Link>
                <h1 className="text-4xl font-heading font-bold text-white mb-4">Repaso Diario</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Algoritmo de Repaso Espaciado (SRS) activado. Priorizamos lo que más te cuesta recordar.
                </p>
            </header>

            <SRSReview questions={SRS_QUESTIONS} />
        </div>
    );
}
