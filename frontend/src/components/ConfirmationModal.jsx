import React from "react";

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Eliminar",
  cancelText = "Cancelar"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop con desenfoque */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onCancel}
      />

      {/* Tarjeta Modal */}
      <div className="bg-[#0f1422] border border-white/5 w-full max-w-md rounded-3xl p-6 shadow-2xl relative z-10 animate-fade-in text-left">
        <h3 className="text-lg font-black text-slate-100 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3 select-none">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border-0"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-red-600/10 border-0"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
