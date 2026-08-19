import React from "react";

export default function AuditLogsTab({ logs = [] }) {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-100 border-b border-white/5 pb-2">Historial de Auditoría (Audit Log)</h2>
        <p className="text-xs text-slate-400 mt-1">Línea de tiempo detallada con las modificaciones realizadas en el catálogo.</p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic bg-[#0f131c]/10 border border-dashed border-white/5 rounded-xl">
            No hay registros de auditoría en el sistema.
          </div>
        ) : (
          logs.map(log => {
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
