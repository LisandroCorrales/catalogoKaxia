import React from "react";

export default function AnnouncementBar({ announcements = [] }) {
  if (announcements.length === 0) return null;

  // Formateador dinámico para inyectar la bandera argentina vectorial (SVG)
  // en sistemas Windows que no soportan emojis de banderas nativamente (muestran "AR")
  const formatText = (text) => {
    const flagSvg = (
      <svg className="w-4 h-2.5 rounded-xs shadow-xs inline-block shrink-0 select-none ml-1.5 relative -top-[1px]" viewBox="0 0 14 9" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#74acdf" width="14" height="9" />
        <rect fill="#ffffff" y="3" width="14" height="3" />
        <circle fill="#f6b316" cx="7" cy="4.5" r="1.2" />
        <circle fill="#845c1c" cx="7" cy="4.5" r="0.4" />
      </svg>
    );

    if (text.includes("🇦🇷")) {
      const parts = text.split("🇦🇷");
      return (
        <span className="flex items-center">
          <span>{parts[0]}</span>
          {flagSvg}
          {parts[1] && <span>{parts[1]}</span>}
        </span>
      );
    }

    if (text.toLowerCase().includes("argentina")) {
      // Reemplazar la palabra argentina e inyectar el SVG a su derecha
      const regex = /argentina/i;
      const match = text.match(regex);
      if (match) {
        const parts = text.split(regex);
        return (
          <span className="flex items-center">
            <span>{parts[0]}{match[0]}</span>
            {flagSvg}
            {parts[1] && <span>{parts[1]}</span>}
          </span>
        );
      }
    }

    return <span>{text}</span>;
  };

  // Helper para renderizar un set de anuncios con sus bolitas divisoras al final
  const renderGroup = () => (
    <div className="flex items-center gap-12 shrink-0">
      {announcements.map((text, idx) => (
        <React.Fragment key={idx}>
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase flex items-center">
            {formatText(text)}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#CDD8E8]/30" />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#0d1222] text-[#CDD8E8] border-b border-white/5 overflow-hidden h-[30px] flex items-center select-none z-50 relative">
      <style>{`
        @keyframes announcement-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-announcement-marquee {
          animation: announcement-marquee 50s linear infinite;
        }
      `}</style>
      <div className="flex whitespace-nowrap animate-announcement-marquee gap-12">
        {renderGroup()}
        {renderGroup()}
        {renderGroup()}
        {renderGroup()}
      </div>
    </div>
  );
}
