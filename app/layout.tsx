
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Tutor PSC | Premium Learning",
  description: "Estudia Procesos Sociales Contemporáneos con tecnología de vanguardia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="antialiased min-h-screen bg-dark-bg text-gray-200">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar (Simple for initial layout) */}
          <aside className="w-64 glass-nav hidden md:flex flex-col p-6 h-full border-r border-dark-border z-20">
            <div className="mb-10">
              <h1 className="text-2xl font-heading font-bold text-gradient">Tutor PSC</h1>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Premium Edition</p>
            </div>

            <nav className="flex-1 space-y-2">
              <a href="/" className="block px-4 py-3 rounded-xl bg-primary-500/10 text-primary-400 font-medium hover:bg-primary-500/20 transition-all">
                Dashboard
              </a>
              <a href="/mapa" className="block px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                Mapa del Programa
              </a>
              <a href="/oral" className="block px-4 py-3 rounded-xl text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-all font-medium border border-amber-500/20">
                🔥 Guía Final Oral
              </a>
              <a href="/simulacro" className="block px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                Simulacro Final
              </a>
            </nav>

            <div className="mt-auto pt-6 border-t border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Usuario</p>
                  <p className="text-xs text-gray-500">Estudiante</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-hero-glow pointer-events-none opacity-40"></div>

            <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
