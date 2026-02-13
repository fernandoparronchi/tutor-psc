import { SRSItem, SRSQuestion } from "@/types";

// Leitner System Implementation
// Box 0: New/Failed (Review ASAP/Daily)
// Box 1: Verified once (Review in 1 day)
// Box 2: Verified twice (Review in 3 days)
// Box 3: Verified thrice (Review in 1 week)
// Box 4: Mastered (Review in 2 weeks)
// Box 5: Retired (Review in 1 month)

const INTERVALS = [0, 1, 3, 7, 14, 30];

export function getNextReviewDate(box: number): number {
    const days = INTERVALS[Math.min(box, INTERVALS.length - 1)];
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.setHours(4, 0, 0, 0); // Reset to 4 AM next due day
}

export function processReview(item: SRSItem, rating: "hard" | "medium" | "easy"): SRSItem {
    let newBox = item.box;

    if (rating === "hard") { // No lo sé
        newBox = 0; // Reset to start
    } else if (rating === "medium") { // Dudé
        newBox = Math.max(0, newBox - 1); // Regress one step or stay
    } else { // Lo sé
        newBox = newBox + 1; // Advance
    }

    return {
        ...item,
        box: newBox,
        nextReview: getNextReviewDate(newBox),
        lastReviewed: Date.now(),
        history: [...item.history, rating === "hard" ? 0 : rating === "medium" ? 1 : 2]
    };
}

export function getDueItems(items: Record<string, SRSItem>): string[] {
    const now = Date.now();
    return Object.values(items)
        .filter(item => item.nextReview <= now)
        .map(item => item.questionId);
}

// LocalStorage helpers
const STORAGE_KEY = "tutor_psc_srs_progress";

export function saveProgress(progress: Record<string, SRSItem>) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function loadProgress(): Record<string, SRSItem> {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

export function exportProgress() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "{}";
}

export function importProgress(json: string) {
    if (typeof window === "undefined") return;
    try {
        const parsed = JSON.parse(json);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
    } catch (e) {
        console.error("Invalid progress JSON", e);
        return false;
    }
}
