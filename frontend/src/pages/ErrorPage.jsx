import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage({ code = "404" }) {
  const navigate = useNavigate();
  const errorDetails = {
    "401": {
      title: "No Autorizado",
      subtitle: "Necesitas iniciar sesión para ver esta sección.",
      message: "Para acceder a este recurso debes autenticarte en la plataforma con una cuenta válida de Administrador o Vendedor.",
      showLogin: true,
      glowColor: "shadow-amber-500/10 border-amber-500/20 text-amber-400"
    },
    "403": {
      title: "Acceso Denegado",
      subtitle: "No tienes permisos para acceder aquí.",
      message: "Tu nivel de acceso actual no cuenta con las autorizaciones de seguridad requeridas para visualizar este panel administrativo.",
      showLogin: false,
      glowColor: "shadow-red-500/10 border-red-500/20 text-red-400"
    },
    "404": {
      title: "Página No Encontrada",
      subtitle: "La página que buscas no existe.",
      message: "El recurso al que intentas acceder puede haber sido removido, renombrado o no estar disponible temporalmente.",
      showLogin: false,
      glowColor: "shadow-indigo-500/10 border-indigo-500/20 text-indigo-400"
    }
  };

  const details = errorDetails[code] || errorDetails["404"];

  return (
    <div className="min-h-screen bg-[#04060a] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full space-y-6">
        {/* Large pulsing error code */}
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-500/30 font-sans select-none animate-pulse">
            {code}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center filter blur-xl opacity-20 bg-gradient-to-b from-indigo-500 to-slate-100 bg-clip-text text-8xl md:text-9xl font-black tracking-tighter select-none">
            {code}
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white/[0.01] ${details.glowColor}`}>
            {details.title}
          </span>
          <h2 className="text-xl font-bold text-slate-100 font-sans mt-2">
            {details.subtitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mx-auto">
            {details.message}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 select-none">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 cursor-pointer border-0 shadow-lg shadow-black/20"
          >
            Volver al Catálogo
          </button>
          
          {details.showLogin && (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-[#CDD8E8] hover:bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 cursor-pointer border-0 shadow-lg shadow-[#CDD8E8]/10"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
