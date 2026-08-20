import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import isotypeImg from '../assets/isotipo kaxia.png';
import { analyticsService } from '../services/api.js';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_PHONE || "5491137639321";

export default function Header({ onOpenEditor, onOpenCart, cartItemsCount, currentUser, onBackToPanel }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWholesalerClick = () => {
    try {
      analyticsService.trackWholesalerClick();
    } catch (e) {
      console.error("Error tracking wholesaler click:", e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md text-white border-b border-white/10">
      <div className="relative max-w-[1220px] mx-auto px-6 py-[9px] flex items-center justify-between gap-4 max-sm:px-3.5 max-sm:py-2.5">
        <a 
          href="#" 
          className="flex items-center gap-2 sm:gap-3 select-none" 
          title="Kaxia Home"
        >
          <img src={isotypeImg} alt="Isotipo_kaxia" className="h-[32px] sm:h-[40px] w-auto object-contain mix-blend-screen" />
          <img src={logoImg} alt="Logotipo_kaxia" className="h-[16px] sm:h-[21px] w-auto object-contain mix-blend-screen" />
        </a>
        
        <div className="flex items-center gap-3">
          {/* Botón CARRITO (Siempre Visible) */}
          <div className="relative w-[38px] h-[38px] rounded-full bg-white/5 border border-white/15 flex items-center justify-center shrink-0 shadow-sm hover:border-white/40 hover:bg-white/10 hover:scale-105 transition-all duration-200">
            <button
              type="button"
              onClick={onOpenCart}
              className="text-slate-300 hover:text-white transition-all duration-200 cursor-pointer p-2 flex items-center justify-center select-none bg-transparent"
              title="Ver Carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5.5 h-5.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.116 60.116 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#fb923c] text-navy text-[9.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-navy shadow-md select-none z-10">
                {cartItemsCount}
              </span>
            )}
          </div>

          {/* Botones de Escritorio (Acceso y Pedidos Mayoristas) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Botón ACCESO (Icono Simple Padlock con Hover) */}
            <div className="w-[38px] h-[38px] rounded-full bg-white/5 border border-white/15 flex items-center justify-center overflow-hidden shrink-0 shadow-sm hover:border-white/40 hover:bg-white/10 hover:scale-105 transition-all duration-200">
              <button
                type="button"
                onClick={onOpenEditor}
                className="text-slate-300 hover:text-white transition-all duration-200 cursor-pointer p-2 flex items-center justify-center select-none bg-transparent"
                title="Acceso Administración"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5.5 h-5.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-2.25 10.5h13.5c.621 0 1.125-.504 1.125-1.125v-7.5c0-.621-.504-1.125-1.125-1.125H5.25c-.621 0-1.125.504-1.125 1.125v7.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </button>
            </div>

            {/* Botón PEDIDOS MAYORISTAS (Sólido Acero Claro #CDD8E8) */}
            <a
              onClick={handleWholesalerClick}
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20hacer%20un%20pedido%20mayorista.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#CDD8E8] text-navy font-bold rounded-full px-4.5 h-[38px] text-[12px] hover:bg-[#b9c9df] transition-colors tracking-wider uppercase inline-flex items-center justify-center text-center select-none ml-2"
            >
              Pedidos Mayoristas
            </a>

            {/* Botón VOLVER AL PANEL (Sólido Acero Claro si está logueado) */}
            {currentUser && onBackToPanel && (
              <button
                type="button"
                onClick={onBackToPanel}
                className="bg-[#CDD8E8] text-navy font-black rounded-full px-5 h-[38px] text-[12px] hover:bg-[#b9c9df] transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#CDD8E8]/10 cursor-pointer tracking-wider uppercase inline-flex items-center justify-center text-center select-none ml-2 gap-1.5"
              >
                ⚙️ Volver al Panel
              </button>
            )}
          </div>

          {/* Menú Hamburguesa Móvil (Acceso y Pedidos Mayoristas colapsados) */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="w-[38px] h-[38px] rounded-full bg-white/5 border border-white/15 flex items-center justify-center shrink-0 shadow-sm hover:border-white/40 hover:bg-white/10 transition-all cursor-pointer"
              title="Abrir Menú"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5.5 h-5.5 text-slate-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5.5 h-5.5 text-slate-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            {isMenuOpen && (
              <>
                {/* Backdrop invisible para cerrar al hacer click afuera */}
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)} />
                
                {/* Menú desplegable */}
                <div className="absolute right-0 mt-2 w-52 bg-[#0f131c]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden py-2.5 flex flex-col gap-2.5 fade-in text-left">
                  
                  {currentUser && onBackToPanel && (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onBackToPanel();
                        }}
                        className="mx-3 bg-[#CDD8E8] text-navy font-black rounded-xl py-2.5 text-xs text-center tracking-wider uppercase hover:bg-[#b9c9df] transition-all select-none cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        ⚙️ Volver al Panel
                      </button>
                      <div className="border-t border-white/10 mx-3" />
                    </>
                  )}

                  {/* Botón PEDIDOS MAYORISTAS en Dropdown */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20hacer%20un%20pedido%20mayorista.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleWholesalerClick();
                    }}
                    className="mx-3 bg-[#CDD8E8] text-navy font-bold rounded-xl py-2.5 text-xs text-center tracking-wider uppercase hover:bg-[#b9c9df] transition-colors select-none"
                  >
                    Pedidos Mayoristas
                  </a>

                  {/* Divisor */}
                  <div className="border-t border-white/10 mx-3" />

                  {/* Acceso Admin */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenEditor();
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2.5 cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4.5 h-4.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-2.25 10.5h13.5c.621 0 1.125-.504 1.125-1.125v-7.5c0-.621-.504-1.125-1.125-1.125H5.25c-.621 0-1.125.504-1.125 1.125v7.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <span>Acceso Admin</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}