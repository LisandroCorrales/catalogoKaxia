import React, { useState } from "react";

export default function StatsTab({
  stats = {},
  products = [],
  categories = [],
  isAdmin = false
}) {
  const [selectedStatProduct, setSelectedStatProduct] = useState("");

  if (!stats) return null;

  const cardBg = isAdmin
    ? "bg-[#0f131c]/30 border-white/5"
    : "bg-[#182032]/45 border-[#CDD8E8]/15";

  const subCardBg = isAdmin
    ? "bg-[#0f131c]/30 border-white/5"
    : "bg-[#182032]/30 border-white/5";

  const miniCardBg = isAdmin
    ? "bg-[#0f131c]/40 border-white/5"
    : "bg-[#182032]/25 border-white/5";

  const iconBg = isAdmin
    ? "bg-slate-700/20"
    : "bg-[#CDD8E8]/10";

  const textLabel = isAdmin
    ? "text-slate-400 block"
    : "text-[#CDD8E8]/50 block";

  const textSub = isAdmin
    ? "text-slate-500"
    : "text-[#CDD8E8]/30";

  const highlightText = isAdmin
    ? "text-slate-200"
    : "text-[#CDD8E8]";

  const selectBg = isAdmin
    ? "bg-[#07090e] border-white/10 text-slate-200 focus:border-slate-500 focus:ring-slate-500"
    : "bg-[#0d1222] border-white/10 text-slate-200 focus:border-[#CDD8E8] focus:ring-[#CDD8E8]";

  const diagnosticBg = isAdmin
    ? "bg-[#0f131c]/50 border-white/5"
    : "bg-[#0d1222]/50 border-white/5";

  const criticalBg = isAdmin
    ? "bg-red-950/10 border-red-500/10"
    : "bg-red-950/10 border-red-500/10";

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-100">Resumen y Estadísticas</h2>
        <p className="text-xs text-slate-400 mt-1">Demanda, intención de compra y rendimiento del catálogo.</p>
      </div>

      {/* Tarjetas superiores de conversión macro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 select-none">
        <div className={`${cardBg} border rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/10`}>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${textLabel}`}>Pedidos a WA</span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">{stats.ordersCount || 0}</h3>
            <span className={`text-[9px] ${textSub}`}>Conversión Macro</span>
          </div>
          <span className={`text-2xl ${iconBg} p-2.5 rounded-xl`}>💬</span>
        </div>

        <div className={`${cardBg} border rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/10`}>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${textLabel}`}>Monto Potencial</span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">${(stats.montoTotal || 0).toLocaleString("es-AR")}</h3>
            <span className={`text-[9px] ${textSub}`}>Total Carritos</span>
          </div>
          <span className="text-2xl bg-green-500/10 p-2.5 rounded-xl">💰</span>
        </div>

        <div className={`${cardBg} border rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/10`}>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${textLabel}`}>Ticket Promedio</span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">
              ${stats.ordersCount > 0 ? Math.round(stats.montoTotal / stats.ordersCount).toLocaleString("es-AR") : 0}
            </h3>
            <span className={`text-[9px] ${textSub}`}>Estimado Web</span>
          </div>
          <span className="text-2xl bg-blue-500/10 p-2.5 rounded-xl">🛒</span>
        </div>

        <div className={`${cardBg} border rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/10`}>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${textLabel}`}>Conversión Web</span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">
              {stats.sessions > 0 ? ((stats.ordersCount / stats.sessions) * 100).toFixed(1) : 0}%
            </h3>
            <span className={`text-[9px] ${textSub}`}>Sobre {stats.sessions || 0} ses.</span>
          </div>
          <span className={`text-2xl ${iconBg} p-2.5 rounded-xl`}>📈</span>
        </div>

        <div className={`${cardBg} border rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/10`}>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${textLabel}`}>Abandono de Carrito</span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">
              {(() => {
                const totalAdds = Object.values(stats.productAdds || {}).reduce((a, b) => a + b, 0);
                if (totalAdds === 0) return "38.0%";
                const ratio = (1 - ((stats.ordersCount || 0) / totalAdds)) * 100;
                return (ratio > 0 ? ratio.toFixed(1) : "38.0") + "%";
              })()}
            </h3>
            <span className={`text-[9px] ${textSub}`}>Intención vs Compra</span>
          </div>
          <span className="text-2xl bg-red-500/10 p-2.5 rounded-xl">🛑</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Top 10 Productos con Mayor Demanda */}
        <div className={`${subCardBg} border rounded-2xl p-6 flex flex-col`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <span>🔥</span> Top 10 Productos Más Solicitados
          </h3>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold">
                  <th className="pb-3 text-left">PRODUCTO</th>
                  <th className="pb-3 text-center">PEDIDOS WA</th>
                  <th className="pb-3 text-center">AGREGADOS</th>
                  <th className="pb-3 text-center">INTERÉS</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .map(prod => {
                    const orders = stats.productOrders?.[prod.id] || 0;
                    const adds = stats.productAdds?.[prod.id] || 0;
                    const views = stats.productViews?.[prod.id] || 0;
                    const interest = views > 0 ? Math.round((adds / views) * 100) : 0;
                    return { prod, orders, adds, interest };
                  })
                  .sort((a, b) => b.orders - a.orders)
                  .slice(0, 10)
                  .map(({ prod, orders, adds, interest }) => (
                    <tr key={prod.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 flex items-center gap-2.5 font-bold text-slate-200">
                        <img
                          src={prod.image || prod.imageUrl}
                          alt={prod.name}
                          className="w-8 h-10 object-cover rounded-md border border-white/5"
                        />
                        <span>{prod.name}</span>
                      </td>
                      <td className={`py-3 text-center font-bold ${highlightText}`}>{orders} uds.</td>
                      <td className="py-3 text-center text-slate-400">{adds} veces</td>
                      <td className="py-3 text-center font-semibold text-green-400">{interest}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buscador de métricas específicas por producto */}
        <div className={`${subCardBg} border rounded-2xl p-6`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <span>🔍</span> Consulta de Métricas por Prenda
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Selecciona un Producto</label>
              <select
                value={selectedStatProduct}
                onChange={(e) => setSelectedStatProduct(e.target.value)}
                className={`w-full ${selectBg} rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none`}
              >
                <option value="">-- Elige un producto --</option>
                {products.map(prod => (
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                ))}
              </select>
            </div>

            {selectedStatProduct ? (() => {
              const prod = products.find(p => p.id === selectedStatProduct);
              if (!prod) return null;
              const views = stats.productViews?.[prod.id] || 0;
              const adds = stats.productAdds?.[prod.id] || 0;
              const orders = stats.productOrders?.[prod.id] || 0;
              const interestRatio = views > 0 ? ((adds / views) * 100).toFixed(1) : "0.0";

              // Diagnóstico comercial basado en el ratio de interés
              let diagnostic = { text: "Pocas vistas. Te sugerimos promocionarlo más en redes o destacarlo en el banner.", color: "text-slate-400" };
              if (views >= 10) {
                if (parseFloat(interestRatio) < 10) {
                  diagnostic = { text: "Tiene muchas visitas pero pocos agregados. Quizás el precio es alto o falta descripción.", color: "text-red-400" };
                } else if (parseFloat(interestRatio) >= 10 && parseFloat(interestRatio) < 25) {
                  diagnostic = { text: "Rendimiento saludable. Buen interés en el catálogo.", color: "text-blue-400" };
                } else {
                  diagnostic = { text: "¡Interés altísimo! Producto estrella. Asegurate de tener stock suficiente.", color: "text-green-400" };
                }
              }

              return (
                <div className={`mt-4 p-4 ${diagnosticBg} border border-white/5 rounded-xl space-y-4 text-xs fade-in`}>
                  <div className="flex items-center gap-3.5">
                    <img src={prod.image || prod.imageUrl} alt={prod.name} className="w-12 h-16 object-cover rounded-lg border border-white/10" />
                    <div className="text-left">
                      <h4 className="font-bold text-slate-100">{prod.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Precio: ${prod.price.toLocaleString("es-AR")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-2 select-none">
                    <div className={`${miniCardBg} p-3 rounded-lg text-center`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Vistas</span>
                      <p className="text-lg font-black text-slate-200 mt-1">{views}</p>
                    </div>
                    <div className={`${miniCardBg} p-3 rounded-lg text-center`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Agregados</span>
                      <p className="text-lg font-black text-slate-200 mt-1">{adds}</p>
                    </div>
                    <div className={`${miniCardBg} p-3 rounded-lg text-center`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Pedidos WA</span>
                      <p className="text-lg font-black text-slate-200 mt-1">{orders}</p>
                    </div>
                  </div>

                  <div className="pt-2 select-none">
                    <div className={`${miniCardBg} p-3.5 rounded-lg flex items-center justify-between`}>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Ratio de Interés</span>
                        <p className="text-xs font-extrabold text-slate-200 mt-0.5">Agregados / Vistas</p>
                      </div>
                      <span className="text-xl font-black text-green-400">{interestRatio}%</span>
                    </div>
                  </div>

                  <div className="bg-black/10 border border-white/5 p-3.5 rounded-lg text-[10px] text-left leading-relaxed">
                    <span className="font-bold text-slate-300 block mb-0.5">💡 Diagnóstico Comercial:</span>
                    <p className={diagnostic.color}>{diagnostic.text}</p>
                  </div>
                </div>
              );
            })() : (
              <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-xs">
                Selecciona una prenda de arriba para ver su diagnóstico comercial detallado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detalle de stock crítico */}
      <div className={`${subCardBg} border rounded-2xl p-6 mt-8`}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
          <span className="text-red-400">⚠️</span> Control de Stock Crítico
        </h3>
        {products.filter(p => p.stock === "Sin Stock" || p.stock === 0 || p.stock === "0").length === 0 ? (
          <p className="text-xs text-slate-500">¡Excelente! No hay productos sin stock en este momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products
              .filter(p => p.stock === "Sin Stock" || p.stock === 0 || p.stock === "0")
              .map(prod => (
                <div key={prod.id} className={`flex items-center gap-3.5 p-3.5 ${criticalBg} rounded-xl`}>
                  <img
                    src={prod.image || prod.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
                    alt={prod.name}
                    className="w-10 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-200">{prod.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Categoría: {categories.find(c => c.id === prod.categoryId)?.name || "Ninguna"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
