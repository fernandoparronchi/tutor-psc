export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-primary-500/20"></div>
            <div className="h-8 bg-white/10 rounded w-64"></div>
            <div className="h-4 bg-white/5 rounded w-96"></div>
            <div className="space-y-4 w-full max-w-2xl mt-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
                ))}
            </div>
        </div>
    );
}
