import React from 'react';
import logoImg from '../assets/logo.png';
import isotypeImg from '../assets/isotipo kaxia.png';
import { analyticsService } from '../services/api.js';

import { WHATSAPP_NUMBER, INSTAGRAM_URL } from '../config/constants.js';

export default function Footer({ categories = [], onCategorySelect }) {
  const handleConsultationClick = () => {
    try {
      analyticsService.trackConsultationClick();
    } catch (e) {
      console.error("Error tracking consultation click:", e);
    }
  };

  const handleWholesalerClick = () => {
    try {
      analyticsService.trackWholesalerClick();
    } catch (e) {
      console.error("Error tracking wholesaler click:", e);
    }
  };
  const handleCategoryClick = (catId) => {
    if (onCategorySelect) {
      onCategorySelect(catId);
    }
    // Desplazamiento suave al listado de productos
    const element = document.getElementById('productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full flex flex-col bg-navy text-white mt-auto select-none">
      {/* Sección CTA WhatsApp (Fondo Claro) */}
      <div className="bg-[#f8fafc] border-t border-b border-slate-200/80 py-12 px-6 text-center text-slate-800">
        <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase mb-3.5">¿No encontrás lo que buscás?</p>
        <a
          onClick={handleConsultationClick}
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Tengo%20una%20consulta.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-md hover:scale-102 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current text-[#25d366]" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
          Consultanos por WhatsApp
        </a>
      </div>

      {/* Contenido Footer Principal (Fondo Oscuro Navy) */}
      <div className="bg-navy border-t border-white/5 py-14 px-6">
        <div className="max-w-[1220px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Logo y Descripción */}
          <div className="md:col-span-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-4 select-none">
                <img src={isotypeImg} alt="" className="h-9 w-auto object-contain mix-blend-screen" />
                <img src={logoImg} alt="KAXIA" className="h-7 w-auto object-contain mix-blend-screen" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Marca de indumentaria informal urbana masculina. Prendas con identidad, calidad y estilo.
              </p>
            </div>
            
            {/* Iconos de Redes Sociales */}
            <div className="flex gap-3.5 mt-6">
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all cursor-pointer"
                title="WhatsApp"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
              </a>
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all cursor-pointer"
                title="Instagram"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna Medio: Catálogo */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 select-none">Catálogo</h4>
            <ul className="space-y-2.5 text-xs">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Derecha: Contacto */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 select-none">Contacto</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="text-slate-400 select-none flex items-center gap-1.5">
                <span>Argentina</span>
                <svg className="w-4 h-2.5 rounded-xs shadow-xs inline-block shrink-0 select-none" viewBox="0 0 14 9" xmlns="http://www.w3.org/2000/svg">
                  <rect fill="#74acdf" width="14" height="9"/>
                  <rect fill="#ffffff" y="3" width="14" height="3"/>
                  <circle fill="#f6b316" cx="7" cy="4.5" r="1.2"/>
                  <circle fill="#845c1c" cx="7" cy="4.5" r="0.4"/>
                </svg>
              </li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a 
                  onClick={handleWholesalerClick}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20hacer%20un%20pedido%20mayorista.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Pedidos mayoristas
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barra Inferior del Footer (Derechos y Créditos) */}
      <div className="bg-[#0b0e1b] border-t border-white/5 py-6 px-6 text-slate-500 text-xs select-none">
        <div className="max-w-[1220px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© 2026 KAXIA. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Creado por{" "}
            <a
              href="https://github.com/LisandroCorrales"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-450 hover:text-white font-semibold transition-colors"
            >
              Lisandro Corrales
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
