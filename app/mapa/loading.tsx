export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-primary-500/20"></div>
            <div className="text-xl text-primary-400 font-bold">Cargando Mapa del Programa...</div>
        </div>
    );
}
