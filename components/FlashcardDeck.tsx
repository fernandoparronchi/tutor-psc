"use client";

import { useState } from "react";
import { Flashcard } from "@/types";
import { cn } from "@/lib/utils";

interface FlashcardDeckProps {
    cards: Flashcard[];
}

export default function FlashcardDeck({ cards }: FlashcardDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    const currentCard = cards[currentIndex];

    return (
        <div className="max-w-xl mx-auto flex flex-col items-center">
            {/* Card Container */}
            <div
                className="w-full aspect-[3/2] cursor-pointer perspective-1000 group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={cn(
                    "relative w-full h-full duration-500 transform-style-3d transition-all",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-dark-card border border-dark-border rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                        <span className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-4">Concepto</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            {currentCard.front}
                        </h3>
                        <p className="absolute bottom-6 text-xs text-gray-500">Toca para voltear</p>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-primary-900/20 border border-primary-500/50 rotate-y-180 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                        <span className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4">Definición</span>
                        <p className="text-lg text-white leading-relaxed">
                            {currentCard.back}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-8">
                <button
                    onClick={handlePrev}
                    className="p-4 rounded-full bg-dark-card border border-dark-border hover:bg-white/5 transition-colors text-white"
                >
                    ←
                </button>
                <div className="text-sm font-medium text-gray-400">
                    {currentIndex + 1} / {cards.length}
                </div>
                <button
                    onClick={handleNext}
                    className="p-4 rounded-full bg-dark-card border border-dark-border hover:bg-white/5 transition-colors text-white"
                >
                    →
                </button>
            </div>
        </div>
    );
}
