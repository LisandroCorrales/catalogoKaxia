import React from "react";

export default function SizeTableModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 p-6 rounded-2xl z-10 fade-in text-left shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-navy">Tabla de Talles</h3>
            <p className="text-xs text-slate-400">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-0 bg-transparent"
            title="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                <th className="p-3">Talle</th>
                <th className="p-3">Detalle de Medidas</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes.map(size => {
                const measure = product.measurements?.[size] || "Medidas no completadas aún";
                return (
                  <tr key={size} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold font-mono text-navy">{size}</td>
                    <td className="p-3 text-slate-600">{measure}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4 mt-6">
          <button
            onClick={onClose}
            className="btn-navy px-5 py-2 text-xs rounded-xl cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
