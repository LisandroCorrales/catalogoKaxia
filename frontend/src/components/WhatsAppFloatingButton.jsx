import React from "react";
import { analyticsService } from "../services/api.js";

const DEFAULT_PHONE = "5491137639321";

export default function WhatsAppFloatingButton() {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || DEFAULT_PHONE;

  const handleClick = () => {
    try {
      analyticsService.trackConsultationClick();
    } catch (err) {
      console.error("Error tracking consultation click:", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 group flex items-center">
      {/* Globo de Conversación (Tooltip) */}
      <div className="absolute right-14 bg-white text-slate-800 border border-slate-200/80 shadow-md px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap opacity-0 translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1.5 select-none">
        <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
        ¿Consultas?
        {/* Pequeño triángulo indicador */}
        <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-r border-t border-slate-200/80 rotate-45" />
      </div>

      {/* Botón Circular Verde */}
      <a
        onClick={handleClick}
        href={`https://wa.me/${phone}?text=Hola!%20Tengo%20una%20consulta%20sobre%20los%20productos%20del%20catálogo.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 select-none cursor-pointer"
        title="WhatsApp Consultas"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.963L2 22l5.233-1.372a9.912 9.912 0 0 0 4.778 1.218h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.924-7.062C17.194 3.016 14.685 2 12.012 2zm5.79 14.184c-.237.669-1.38 1.285-1.921 1.36-.464.064-.993.076-1.636-.129a8.497 8.497 0 0 1-3.693-2.19 9.18 9.18 0 0 1-2.551-3.79c-.314-.882-.016-1.36.216-1.687.165-.232.362-.432.544-.645.132-.15.226-.264.318-.432.093-.169.046-.319-.023-.469-.068-.15-.618-1.488-.847-2.044-.223-.54-.447-.469-.618-.469l-.527-.012c-.183 0-.479.068-.729.338-.25.27-1.01 1.012-1.01 2.467s1.047 2.854 1.196 3.053c.149.2 2.059 3.244 5.045 4.473.71.293 1.263.468 1.693.602.719.227 1.373.195 1.89.117.577-.087 1.777-.727 2.025-1.429.248-.702.248-1.302.173-1.429-.074-.127-.27-.2-.566-.339z" />
        </svg>
      </a>
    </div>
  );
}
