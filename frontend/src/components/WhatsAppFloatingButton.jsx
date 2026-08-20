import React from "react";
import { analyticsService } from "../services/api.js";

import { WHATSAPP_NUMBER } from "../config/constants.js";

export default function WhatsAppFloatingButton() {

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
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Tengo%20una%20consulta%20sobre%20los%20productos%20del%20catálogo.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 select-none cursor-pointer"
        title="WhatsApp Consultas"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      </a>
    </div>
  );
}
