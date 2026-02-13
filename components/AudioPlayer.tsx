"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
    text: string;
    title: string;
}

export default function AudioPlayer({ text, title }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            // Try to find a Spanish voice, preferably from Google or Microsoft
            const spanishVoice = voices.find(v => v.lang.startsWith("es") && (v.name.includes("Google") || v.name.includes("Microsoft"))) || voices.find(v => v.lang.startsWith("es"));
            setVoice(spanishVoice || null);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const togglePlay = () => {
        if (!voice) return;

        if (isPlaying && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
        } else if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
                setProgress(0);
            };

            utterance.onboundary = (event) => {
                // Approximate progress based on character index
                const progress = (event.charIndex / text.length) * 100;
                setProgress(progress);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
    };

    return (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isPlaying ? "bg-primary-500 text-white animate-pulse" : "bg-gray-800 text-gray-400"
                    )}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isPlaying ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            )}
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm md:text-base">Clase de Audio</h4>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{title}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={togglePlay}
                        disabled={!voice}
                        className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                    >
                        {isPlaying ? "Pausar" : isPaused ? "Reanudar" : "Reproducir"}
                    </button>
                    {(isPlaying || isPaused) && (
                        <button
                            onClick={stop}
                            className="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {!voice && (
                <p className="text-xs text-red-400 mt-2">
                    No se detectó una voz en español compatible.
                </p>
            )}
        </div>
    );
}
