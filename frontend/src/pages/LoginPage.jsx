import React, { useState, useEffect, useRef } from "react";
import { authService } from "../services/api.js";
import isotypeImg from "../assets/isotipo kaxia.png";

export default function LoginPage({ onLoginSuccess, onNavigateToCatalog }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const timerRef = useRef(null);

  const formatDisplay = (rawStr, insertedIdx = -1) => {
    return rawStr
      .split("")
      .map((char, idx) => (idx === insertedIdx ? char : "•"))
      .join("");
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;

    if (showPassword) {
      setPassword(val);
      setDisplayValue(val);
      return;
    }

    let newRaw = "";
    if (val.length === 0) {
      newRaw = "";
      setDisplayValue("");
    } else if (val.length > displayValue.length) {
      // Carácter o texto insertado
      let diffIdx = 0;
      while (diffIdx < displayValue.length && val[diffIdx] === displayValue[diffIdx]) {
        diffIdx++;
      }
      const insertedCount = val.length - displayValue.length;
      const insertedText = val.substring(diffIdx, diffIdx + insertedCount);
      newRaw = password.substring(0, diffIdx) + insertedText + password.substring(diffIdx);

      const lastInsertedIdx = diffIdx + insertedCount - 1;
      setDisplayValue(formatDisplay(newRaw, lastInsertedIdx));

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setDisplayValue(formatDisplay(newRaw, -1));
      }, 1500);
    } else if (val.length < displayValue.length) {
      // Carácter o texto borrado
      let diffIdx = 0;
      while (diffIdx < val.length && val[diffIdx] === displayValue[diffIdx]) {
        diffIdx++;
      }
      const deletedCount = displayValue.length - val.length;
      newRaw = password.substring(0, diffIdx) + password.substring(diffIdx + deletedCount);

      setDisplayValue(formatDisplay(newRaw, -1));
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      // Reemplazo de igual longitud
      let temp = password.split("");
      for (let i = 0; i < val.length; i++) {
        if (val[i] !== "•") {
          temp[i] = val[i];
        }
      }
      newRaw = temp.join("");
      setDisplayValue(formatDisplay(newRaw, -1));
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    setPassword(newRaw);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => {
      const next = !prev;
      if (next) {
        setDisplayValue(password);
        if (timerRef.current) clearTimeout(timerRef.current);
      } else {
        setDisplayValue(formatDisplay(password, -1));
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return setError("Por favor complete todos los campos.");
    }

    setLoading(true);
    setError("");
    try {
      const user = await authService.login(username, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1222] to-[#07090e] px-4 relative overflow-hidden">
      {/* Resplandores difuminados de fondo (Identidad de color de la marca) */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[#CDD8E8]/5 blur-[95px] -top-32 -left-20 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#74acdf]/5 blur-[100px] -bottom-20 -right-20 pointer-events-none" />

      {/* Card de Login Esmerilada */}
      <div className="w-full max-w-md bg-[#0f131c]/65 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/40 relative z-10 fade-in text-left">
        
        {/* Cabecera de Marca (Isotipo y Título) */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src={isotypeImg} 
            alt="Kaxia Isotipo" 
            className="h-16 w-auto object-contain mb-3 select-none filter drop-shadow-[0_4px_12px_rgba(205,216,232,0.15)]" 
          />
          <h2 className="text-2xl font-black tracking-[0.22em] text-slate-100 mb-1 select-none">
            KAXIA
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#CDD8E8]/60 font-black select-none">
            Acceso Vendedor
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/20 text-red-200 p-3.5 rounded-xl text-xs mb-5 font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Usuario */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#CDD8E8]/50 mb-2 select-none">
              Nombre de Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/20 transition-all font-medium"
              placeholder="Ej: admin"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#CDD8E8]/50 mb-2 select-none">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={displayValue}
                onChange={handlePasswordChange}
                className="w-full bg-black/35 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/20 transition-all font-mono"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3.5 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer select-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botón Envío (Estilo Acero) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#CDD8E8] text-navy font-bold rounded-xl py-3.5 flex items-center justify-center font-extrabold text-xs uppercase tracking-widest hover:bg-[#b9c9df] transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#CDD8E8]/5 cursor-pointer disabled:opacity-50 mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              "Ingresar al Panel"
            )}
          </button>
        </form>

        <div className="text-center mt-6.5 border-t border-white/5 pt-5">
          <button
            onClick={onNavigateToCatalog}
            className="inline-flex items-center justify-center border border-white/10 bg-white/5 rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            ← Volver al Catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
