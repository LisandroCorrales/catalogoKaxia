import React, { useEffect } from "react";

export default function ToastNotification({ text, type = "success", onClose }) {
  useEffect(() => {
    if (!text) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [text, onClose]);

  if (!text) return null;

  const isError = type === "error";

  return (
    <>
      <style>{`
        @keyframes toastSlideDown {
          from {
            transform: translateY(-1.5rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-toast-slide-down {
          animation: toastSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      <div className="fixed top-6 right-6 z-55 flex justify-end w-full max-w-sm pointer-events-none select-none">
        <div className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-2xl animate-toast-slide-down pointer-events-auto ${
          isError
            ? "bg-[#18090b]/90 border-red-500/30 text-red-300 shadow-red-500/10"
            : "bg-[#09180f]/90 border-green-500/30 text-green-300 shadow-green-500/10"
        }`}>
          <span className="font-sans font-extrabold text-left">{text}</span>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent text-sm font-bold ml-1.5 outline-none"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
