import React, { useState } from "react";

export default function AuditLogsTab({ logs = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState(""); // "" (Todos) | "CREATE" | "UPDATE" | "DELETE" | "RESTORE"
  const [filterEntity, setFilterEntity] = useState(""); // "" (Todos) | "Product" | "Category" | "Tag" | "Color" | "User" | "UserPassword"

  // Filtrado de logs de auditoría
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesEntity = !filterEntity || log.entityType === filterEntity;
    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-100 border-b border-white/5 pb-2">Historial de Auditoría</h2>
        <p className="text-xs text-slate-400 mt-1">Línea de tiempo detallada con las modificaciones realizadas en el catálogo.</p>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 text-left max-w-4xl">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Buscar por usuario</label>
          <input
            type="text"
            placeholder="Ej: admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-medium"
          />
        </div>

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
      </div>

      <div className="space-y-4 max-w-4xl">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic bg-[#0f131c]/10 border border-dashed border-white/5 rounded-xl">
            No se encontraron registros de auditoría con los filtros seleccionados.
          </div>
        ) : (
          filteredLogs.map(log => {
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
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 font-mono text-[11px] space-y-1">
                    {log.action === "UPDATE" ? (
                      Object.keys(log.details).map(field => {
                        const val = log.details[field];
                        return (
                          <div key={field} className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-slate-500">{field}:</span>
                            <span className="text-red-400 line-through">{JSON.stringify(val.previous)}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-green-400">{JSON.stringify(val.current)}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-slate-400 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(log.details, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
