import React from 'react';
import heroBg from '../assets/hero-bg.jpg';

export default function Hero() {
  return (
    <section 
      className="relative h-[60vh] md:h-[80vh] w-full bg-cover bg-center flex items-center px-6 overflow-hidden select-none"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Capa de gradiente oscuro a la izquierda para legibilidad del texto en la imagen */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent z-10" />

      <div className="max-w-[1220px] mx-auto w-full relative z-20 grid grid-cols-1 md:grid-cols-12 items-center">
        <div className="md:col-span-8 text-left">
          <div className="eyebrow text-[15px] md:text-[15px] uppercase tracking-[0.15em] text-[#CDD8E8] font-bold">
            INDUMENTARIA MASCULINA
          </div>
          
          <h1 className="text-[54px] md:text-[80px] font-black tracking-tight leading-[0.95] text-white uppercase mt-[14px] mb-[30px]">
            CATÁLOGO<br />2026
          </h1>
          
          <p className="text-[16px] md:text-[18px] text-[#E8EDF8] leading-relaxed max-w-xl">
            Indumentaria masculina de calidad superior. Prendas diseñadas para quienes valoran el detalle, la durabilidad y el estilo propio. Elegí tu modelo, talle y color y hacé tu pedido por WhatsApp.
          </p>
        </div>
      </div>

      {/* Indicador de SCROLL al final centrado */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none pointer-events-none">
        <style>{`
          @keyframes scroll-down-play {
            0% {
              transform: translateY(0);
              opacity: 0;
            }
            20% {
              transform: translateY(0);
              opacity: 1;
            }
            80% {
              transform: translateY(18px);
              opacity: 1;
            }
            100% {
              transform: translateY(18px);
              opacity: 0;
            }
          }
          .animate-scroll-down-play {
            animation: scroll-down-play 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
        `}</style>
        <span className="text-[12px] font-bold tracking-widest text-[#CDD8E8] uppercase">SCROLL</span>
        <div className="w-[5px] h-8 bg-[#CDD8E8]/30 relative overflow-hidden rounded-full">
          <div className="absolute top-[2px] left-0 w-full h-2.5 bg-[#CDD8E8] rounded-full animate-scroll-down-play" />
        </div>
      </div>
    </section>
  );
}
