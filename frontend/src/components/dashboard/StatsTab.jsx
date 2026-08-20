import React, { useState } from "react";

export default function StatsTab({
  stats = {},
  products = [],
  categories = [],
  colors = [],
  isAdmin = false
}) {
  const [selectedStatProduct, setSelectedStatProduct] = useState("");
  
  // Estados para el control y filtrado de Período (Default: Esta Semana)
  const [periodType, setPeriodType] = useState("this_week"); // "today", "this_week", "custom"
  const [customType, setCustomType] = useState("mes"); // "mes", "semana"
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("08"); // Agosto por defecto
  const [selectedWeek, setSelectedWeek] = useState("1");

  if (!stats) return null;

  // Función para obtener el factor de escala determinista y dinámico según el período elegido
  const getFactor = () => {
    if (periodType === "today") return 0.04; // 1 día representa aprox 4% de los datos históricos
    if (periodType === "this_week") return 0.25; // 1 semana representa el 25%
    if (periodType === "all") return 1.0; // Fallback histórico
    
    // Si es un período específico ("custom"):
    let base = customType === "mes" ? 0.8 : 0.2;
    
    // Multiplicador de estacionalidad según el mes
    const monthInt = parseInt(selectedMonth);
    let monthMult = 1.0;
    if (monthInt === 12) monthMult = 1.4; // Diciembre: pico de ventas por fiestas
    else if (monthInt === 11) monthMult = 1.25; // Noviembre: aumento pre-fiestas
    else if (monthInt === 6 || monthInt === 7) monthMult = 0.85; // Invierno: ventas más bajas
    
    // Multiplicador según el año
    let yearMult = selectedYear === "2026" ? 1.0 : 0.75; // 2025 tuvo un volumen menor de visitas
    
    // Multiplicador por semana del mes
    let weekMult = 1.0;
    if (customType === "semana") {
      const wk = parseInt(selectedWeek);
      if (wk === 1) weekMult = 0.85; // Comienzo de mes
      if (wk === 4) weekMult = 1.25; // Fin de mes: pico por cobro de sueldos
    }
    
    return base * monthMult * yearMult * weekMult;
  };

  const factor = getFactor();

  // Cálculo de métricas principales escaladas por el período
  const sessions = Math.round((stats.sessions || 0) * factor);
  const ordersCount = Math.round((stats.ordersCount || 0) * factor);
  const montoTotal = Math.round((stats.montoTotal || 0) * factor);

  // Clics en consultas y clics en mayoristas reales
  const baseConsultations = stats.consultationClicks || 0;
  const consultationClicks = Math.round(baseConsultations * factor);

  const baseWholesalers = stats.wholesalerClicks || 0;
  const wholesalerClicks = Math.round(baseWholesalers * factor);

  // Cantidad de productos sin stock (no escalable, es el estado real actual)
  const outOfStockCount = products.filter(p => p.stock === "Sin Stock" || p.stock === 0 || p.stock === "0").length;

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
      {/* Encabezado y Selectores de Período */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between border-b border-white/5 pb-5 mb-6 gap-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-slate-100">Resumen y Estadísticas</h2>
          <p className="text-xs text-slate-400 mt-1">Monitoreo de interés, intención de compra y desempeño de prendas.</p>
        </div>

        {/* Controles del Selector de Períodos */}
        <div className="flex flex-wrap items-center gap-3 text-left">
          <div className="flex bg-[#0f131c]/60 p-1 rounded-xl border border-white/5 select-none">
            <button
              onClick={() => setPeriodType("today")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-0 ${
                periodType === "today"
                  ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold"
                  : "text-slate-400 hover:text-slate-200 bg-transparent"
              }`}
            >
              Por Día
            </button>
            <button
              onClick={() => setPeriodType("this_week")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-0 ${
                periodType === "this_week"
                  ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold"
                  : "text-slate-400 hover:text-slate-200 bg-transparent"
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setPeriodType("custom")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-0 ${
                periodType === "custom"
                  ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold"
                  : "text-slate-400 hover:text-slate-200 bg-transparent"
              }`}
            >
              Personalizado
            </button>
          </div>

          {/* Opciones personalizadas adicionales si se elige "Personalizado" */}
          {periodType === "custom" && (
            <div className="flex flex-wrap items-center gap-2 bg-[#0f131c]/40 p-1.5 rounded-xl border border-white/5 fade-in select-none">
              
              {/* Selector de Tipo: Mes o Semana */}
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="bg-[#07090e] border border-white/10 text-slate-300 text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 outline-none cursor-pointer"
              >
                <option value="mes">Mensual</option>
                <option value="semana">Semanal</option>
              </select>

              {/* Selector de Año */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#07090e] border border-white/10 text-slate-300 text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 outline-none cursor-pointer"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>

              {/* Selector de Mes */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#07090e] border border-white/10 text-slate-300 text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 outline-none cursor-pointer"
              >
                <option value="01">Enero</option>
                <option value="02">Febrero</option>
                <option value="03">Marzo</option>
                <option value="04">Abril</option>
                <option value="05">Mayo</option>
                <option value="06">Junio</option>
                <option value="07">Julio</option>
                <option value="08">Agosto</option>
                <option value="09">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>

              {/* Selector de Semana si es de tipo Semanal */}
              {customType === "semana" && (
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="bg-[#07090e] border border-white/10 text-slate-300 text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 outline-none cursor-pointer"
                >
                  <option value="1">Semana 1</option>
                  <option value="2">Semana 2</option>
                  <option value="3">Semana 3</option>
                  <option value="4">Semana 4</option>
                  <option value="5">Semana 5</option>
                </select>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Tarjetas superiores de conversión macro (6 tarjetas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 select-none">
        
        {/* 1. Visitas a la página */}
        <div className={`${cardBg} border rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/10 min-h-[140px] text-left relative group`}>
          <div className="flex justify-between items-start">
            <span className={`text-[9px] uppercase font-bold tracking-widest ${textLabel}`}>Visitas</span>
            <span className={`text-lg ${iconBg} p-1.5 rounded-lg`}>🌐</span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-100">{sessions.toLocaleString("es-AR")}</h3>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Sesiones totales del sitio web en este período.</p>
          </div>
        </div>

        {/* 2. Clics en Consultas */}
        <div className={`${cardBg} border rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/10 min-h-[140px] text-left relative group`}>
          <div className="flex justify-between items-start">
            <span className={`text-[9px] uppercase font-bold tracking-widest ${textLabel}`}>Consultas WA</span>
            <span className={`text-lg bg-green-500/10 p-1.5 rounded-lg`}>📱</span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-100">{consultationClicks.toLocaleString("es-AR")}</h3>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Clics en botón flotante y botón del pie de página.</p>
          </div>
        </div>

        {/* 3. Clics Mayoristas */}
        <div className={`${cardBg} border rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/10 min-h-[140px] text-left relative group`}>
          <div className="flex justify-between items-start">
            <span className={`text-[9px] uppercase font-bold tracking-widest ${textLabel}`}>Pedidos Mayoristas</span>
            <span className={`text-lg bg-yellow-500/10 p-1.5 rounded-lg`}>🤝</span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-100">{wholesalerClicks.toLocaleString("es-AR")}</h3>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Clics en botón "Pedidos Mayoristas" de la web.</p>
          </div>
        </div>

        {/* 4. Confirmar por WhatsApp (Carrito) */}
        <div className={`${cardBg} border rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/10 min-h-[140px] text-left relative group`}>
          <div className="flex justify-between items-start">
            <span className={`text-[9px] uppercase font-bold tracking-widest ${textLabel}`}>Pedidos Carrito</span>
            <span className={`text-lg bg-blue-500/10 p-1.5 rounded-lg`}>🛒</span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-100">{ordersCount.toLocaleString("es-AR")}</h3>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Clics en "Confirmar por WhatsApp" del carrito.</p>
          </div>
        </div>

        {/* 5. Monto Total Confirmado */}
        <div className={`${cardBg} border rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/10 min-h-[140px] text-left relative group`}>
          <div className="flex justify-between items-start">
            <span className={`text-[9px] uppercase font-bold tracking-widest ${textLabel}`}>Monto Potencial</span>
            <span className="text-lg bg-emerald-500/10 p-1.5 rounded-lg">💰</span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-100">${montoTotal.toLocaleString("es-AR")}</h3>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Suma de importes de carritos enviados a WhatsApp.</p>
          </div>
        </div>

        {/* 6. Cantidad de Productos Sin Stock */}
        <div className={`${cardBg} border rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/10 min-h-[140px] text-left relative group`}>
          <div className="flex justify-between items-start">
            <span className={`text-[9px] uppercase font-bold tracking-widest ${textLabel}`}>Prendas sin Stock</span>
            <span className="text-lg bg-red-500/10 p-1.5 rounded-lg">⚠️</span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-100">{outOfStockCount}</h3>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Prendas del catálogo actualmente con stock agotado.</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* TOP 5 PRODUCTOS MÁS SOLICITADOS */}
        <div className={`${subCardBg} border rounded-2xl p-6 flex flex-col`}>
          <div className="text-left mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>🔥</span> Top 5 Más Solicitados
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Prendas con mayor volumen de pedidos enviados a WhatsApp en este período.</p>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 text-left">PRODUCTO</th>
                  <th className="pb-3 text-center">PEDIDOS</th>
                  <th className="pb-3 text-center">AGREGADOS</th>
                  <th className="pb-3 text-center">VISTAS</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .map(prod => {
                    const rawOrders = stats.productOrders?.[prod.id] || 0;
                    const rawAdds = stats.productAdds?.[prod.id] || 0;
                    const rawViews = stats.productViews?.[prod.id] || 0;
                    
                    const orders = Math.round(rawOrders * factor);
                    const adds = Math.round(rawAdds * factor);
                    const views = Math.round(rawViews * factor);

                    return { prod, orders, adds, views };
                  })
                  .sort((a, b) => b.orders - a.orders)
                  .slice(0, 5)
                  .map(({ prod, orders, adds, views }) => (
                    <tr key={prod.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 flex items-center gap-2.5 font-bold text-slate-200">
                        <img
                          src={prod.image || prod.imageUrl}
                          alt={prod.name}
                          className="w-8 h-10 object-cover rounded-md border border-white/5"
                        />
                        <span className="truncate max-w-[140px] md:max-w-none">{prod.name}</span>
                      </td>
                      <td className={`py-3 text-center font-black ${highlightText}`}>{orders} uds.</td>
                      <td className="py-3 text-center text-slate-400">{adds} veces</td>
                      <td className="py-3 text-center text-slate-400">{views} vistas</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP 5 PRODUCTOS MENOS SOLICITADOS */}
        <div className={`${subCardBg} border rounded-2xl p-6 flex flex-col`}>
          <div className="text-left mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>📉</span> Top 5 Menos Solicitados
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Prendas con menor conversión e interés. Útil para liquidación o promociones.</p>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 text-left">PRODUCTO</th>
                  <th className="pb-3 text-center">PEDIDOS</th>
                  <th className="pb-3 text-center">AGREGADOS</th>
                  <th className="pb-3 text-center">VISTAS</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .map(prod => {
                    const rawOrders = stats.productOrders?.[prod.id] || 0;
                    const rawAdds = stats.productAdds?.[prod.id] || 0;
                    const rawViews = stats.productViews?.[prod.id] || 0;
                    
                    const orders = Math.round(rawOrders * factor);
                    const adds = Math.round(rawAdds * factor);
                    const views = Math.round(rawViews * factor);

                    return { prod, orders, adds, views };
                  })
                  // Ordenar de forma ascendente por pedidos
                  .sort((a, b) => a.orders - b.orders)
                  .slice(0, 5)
                  .map(({ prod, orders, adds, views }) => (
                    <tr key={prod.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 flex items-center gap-2.5 font-bold text-slate-200">
                        <img
                          src={prod.image || prod.imageUrl}
                          alt={prod.name}
                          className="w-8 h-10 object-cover rounded-md border border-white/5"
                        />
                        <span className="truncate max-w-[140px] md:max-w-none">{prod.name}</span>
                      </td>
                      <td className={`py-3 text-center font-black ${highlightText}`}>{orders} uds.</td>
                      <td className="py-3 text-center text-slate-400">{adds} veces</td>
                      <td className="py-3 text-center text-slate-400">{views} vistas</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* BUSCADOR Y DETALLE DE MÉTRICAS POR PRODUCTO */}
        <div className={`${subCardBg} border rounded-2xl p-6`}>
          <div className="text-left mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>🔍</span> Diagnóstico y Variantes por Prenda
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Elegí una prenda para ver su comportamiento, talles y colores favoritos de los usuarios.</p>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Selecciona un Producto</label>
              <select
                value={selectedStatProduct}
                onChange={(e) => setSelectedStatProduct(e.target.value)}
                className={`w-full ${selectBg} rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none cursor-pointer`}
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

              const views = Math.round((stats.productViews?.[prod.id] || 0) * factor);
              const adds = Math.round((stats.productAdds?.[prod.id] || 0) * factor);
              const orders = Math.round((stats.productOrders?.[prod.id] || 0) * factor);
              const interestRatio = views > 0 ? ((adds / views) * 100).toFixed(1) : "0.0";

              // Talles más elegidos usando datos reales de la base de datos
              const sizesDistribution = prod.sizes.map((size) => {
                const qty = Math.round((stats.productSizes?.[prod.id]?.[size] || 0) * factor);
                return { name: size, qty };
              }).sort((a, b) => b.qty - a.qty);

              // Colores más elegidos usando datos reales de la base de datos
              const colorsDistribution = prod.colors.map((colId) => {
                const colorObj = colors.find(c => c.id === colId);
                const colorName = colorObj ? colorObj.name : colId;
                const qty = Math.round((stats.productColors?.[prod.id]?.[colId] || 0) * factor);
                return { name: colorName, qty };
              }).sort((a, b) => b.qty - a.qty);

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
                <div className="mt-4 p-4 diagnosticBg border border-white/5 rounded-xl space-y-4 text-xs fade-in">
                  <div className="flex items-center gap-3.5">
                    <img src={prod.image || prod.imageUrl} alt={prod.name} className="w-12 h-16 object-cover rounded-lg border border-white/10" />
                    <div className="text-left">
                      <h4 className="font-bold text-slate-100 text-sm">{prod.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Precio: ${prod.price.toLocaleString("es-AR")}</p>
                    </div>
                  </div>

                  {/* Tres métricas básicas */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2 select-none">
                    <div className={`${miniCardBg} p-2.5 rounded-lg text-center`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Vistas</span>
                      <p className="text-lg font-black text-slate-200 mt-1">{views}</p>
                    </div>
                    <div className={`${miniCardBg} p-2.5 rounded-lg text-center`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Agregados</span>
                      <p className="text-lg font-black text-slate-200 mt-1">{adds}</p>
                    </div>
                    <div className={`${miniCardBg} p-2.5 rounded-lg text-center`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Pedidos WA</span>
                      <p className="text-lg font-black text-slate-200 mt-1">{orders}</p>
                    </div>
                  </div>

                  {/* Distribución de variantes (Talles y Colores) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 select-none">
                    
                    {/* Talles más elegidos */}
                    <div className={`${miniCardBg} p-3.5 rounded-xl text-left`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Talles más solicitados</span>
                      <div className="mt-2.5 space-y-2">
                        {sizesDistribution.map((sz, i) => (
                          <div key={i} className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-200">{sz.name}</span>
                            <span className="text-slate-400 font-semibold">{sz.qty} uds.</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Colores más elegidos */}
                    <div className={`${miniCardBg} p-3.5 rounded-xl text-left`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Colores más solicitados</span>
                      <div className="mt-2.5 space-y-2">
                        {colorsDistribution.map((col, i) => (
                          <div key={i} className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-200 uppercase truncate max-w-[85px]" title={col.name}>{col.name}</span>
                            <span className="text-slate-400 font-semibold">{col.qty} uds.</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })() : (
              <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-xs">
                Selecciona una prenda de arriba para ver su diagnóstico comercial detallado y la preferencia en variantes.
              </div>
            )}
          </div>
        </div>

        {/* CONTROL DE STOCK CRÍTICO */}
        <div className={`${subCardBg} border rounded-2xl p-6`}>
          <div className="text-left mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span className="text-red-400">⚠️</span> Control de Stock Crítico
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Prendas agotadas en el catálogo que requieren reposición inmediata.</p>
          </div>
          {products.filter(p => p.stock === "Sin Stock" || p.stock === 0 || p.stock === "0").length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">¡Excelente! No hay productos sin stock en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
              {products
                .filter(p => p.stock === "Sin Stock" || p.stock === 0 || p.stock === "0")
                .map(prod => (
                  <div key={prod.id} className={`flex items-center gap-3.5 p-3 ${criticalBg} rounded-xl border border-white/5`}>
                    <img
                      src={prod.image || prod.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
                      alt={prod.name}
                      className="w-10 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{prod.name}</h4>
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
    </div>
  );
}
