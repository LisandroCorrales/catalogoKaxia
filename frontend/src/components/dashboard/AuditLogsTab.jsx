import React, { useState, useEffect } from "react";

export default function AuditLogsTab({ logs = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState(""); // "" (Todos) | "CREATE" | "UPDATE" | "DELETE" | "RESTORE"
  const [filterEntity, setFilterEntity] = useState(""); // "" (Todos) | "Product" | "Category" | "Tag" | "Color" | "User" | "UserPassword"
  const [filterDate, setFilterDate] = useState(""); // YYYY-MM-DD
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Reiniciar la cantidad visible de logs cuando se cambian los filtros
  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, filterAction, filterEntity, filterDate]);

  // Filtrado de logs de auditoría
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesEntity = !filterEntity || log.entityType === filterEntity;
    const matchesDate = !filterDate || (() => {
      const d = new Date(log.createdAt);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const localDateStr = `${year}-${month}-${day}`;
      return localDateStr === filterDate;
    })();
    return matchesSearch && matchesAction && matchesEntity && matchesDate;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-slate-100">Historial de Auditoría</h2>
        <p className="text-xs text-slate-400 mt-1">Línea de tiempo detallada con las modificaciones realizadas en el catálogo.</p>
      </div>

      {/* Barra de Filtros Principal */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between select-none max-w-4xl">
        <div className="flex flex-grow gap-2 items-center w-full max-w-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-medium"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 select-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.608 10.608Z" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(prev => !prev)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              showFilters 
                ? "bg-[#CDD8E8] text-[#0d1222] border-[#CDD8E8] font-black" 
                : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/5"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <span>Filtros {showFilters ? "▾" : "▸"}</span>
          </button>
        </div>
      </div>

      {/* Panel Desplegable de Filtros Avanzados */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 p-4.5 rounded-2xl select-none fade-in text-left max-w-4xl">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Filtrar por acción</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full bg-[#0d1222] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-semibold"
            >
              <option value="" className="bg-[#12172d] text-slate-200">Todas las acciones</option>
              <option value="CREATE" className="bg-[#12172d] text-slate-200">CREAR (CREATE)</option>
              <option value="UPDATE" className="bg-[#12172d] text-slate-200">MODIFICAR (UPDATE)</option>
              <option value="DELETE" className="bg-[#12172d] text-slate-200">ELIMINAR / SUSPENDER (DELETE)</option>
              <option value="RESTORE" className="bg-[#12172d] text-slate-200">RESTAURAR (RESTORE)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Filtrar por elemento</label>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="w-full bg-[#0d1222] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-semibold"
            >
              <option value="" className="bg-[#12172d] text-slate-200">Todos los elementos</option>
              <option value="Product" className="bg-[#12172d] text-slate-200">Prenda (Product)</option>
              <option value="Category" className="bg-[#12172d] text-slate-200">Categoría (Category)</option>
              <option value="Tag" className="bg-[#12172d] text-slate-200">Etiqueta (Tag)</option>
              <option value="Color" className="bg-[#12172d] text-slate-200">Color (Color)</option>
              <option value="User" className="bg-[#12172d] text-slate-200">Usuario (User)</option>
              <option value="UserPassword" className="bg-[#12172d] text-slate-200">Contraseña (UserPassword)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Filtrar por fecha</label>
            <div className="relative">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-[#0d1222] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-semibold cursor-pointer"
              />
              {filterDate && (
                <button
                  type="button"
                  onClick={() => setFilterDate("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-bold border-0 bg-transparent cursor-pointer select-none"
                  title="Limpiar fecha"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 max-w-4xl">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic bg-[#0f131c]/10 border border-dashed border-white/5 rounded-xl">
            No se encontraron registros de auditoría con los filtros seleccionados.
          </div>
        ) : (
          <>
            {filteredLogs.slice(0, visibleCount).map(log => {
              const formattedDate = new Date(log.createdAt).toLocaleString("es-AR");
              return (
                <div key={log.id} className="p-4 rounded-xl border border-white/5 bg-[#0f131c]/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{formattedDate}</span>
                      <span className="text-xs font-semibold text-slate-300">
                        Usuario: <span className="font-bold text-amber-400">{log.username}</span>
                      </span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        log.action === "CREATE" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        log.action === "UPDATE" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        log.action === "RESTORE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {log.entityType} (ID: {log.entityId})
                      </span>
                    </div>
                  </div>

                  {/* Detalles/Diff */}
                  {Object.keys(log.details).length > 0 && (
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5 font-mono text-[11px] space-y-1.5 break-all select-all">
                      {log.action === "UPDATE" ? (
                        Object.keys(log.details).map(field => {
                          const val = log.details[field];
                          return (
                            <div key={field} className="flex flex-wrap gap-x-1.5 gap-y-0.5 items-center border-b border-white/[0.02] last:border-b-0 pb-1 last:pb-0">
                              <span className="text-slate-500">{field}:</span>
                              <span className="text-red-400 line-through">{JSON.stringify(val.previous)}</span>
                              <span className="text-slate-400">→</span>
                              <span className="text-green-400">{JSON.stringify(val.current)}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-slate-400 overflow-x-auto whitespace-pre-wrap break-all">
                          {JSON.stringify(log.details, null, 2)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredLogs.length > visibleCount && (
              <div className="flex justify-center pt-2 w-full">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer select-none border-0"
                >
                  + Cargar Más Registros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
