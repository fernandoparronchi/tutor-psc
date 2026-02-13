export default function Loading() {
    return (
        <div className="max-w-2xl mx-auto py-20 px-4">
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-white/10 rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-white/5 rounded w-1/2 mx-auto"></div>
                <div className="h-[400px] bg-white/5 rounded-2xl w-full"></div>
                <div className="h-16 bg-white/5 rounded-xl w-full"></div>
            </div>
        </div>
    );
}
