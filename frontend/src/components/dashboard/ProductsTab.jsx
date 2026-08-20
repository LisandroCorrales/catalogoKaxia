import React, { useState } from "react";

export default function ProductsTab({
  products = [],
  categories = [],
  tags = [],
  onEditProduct,
  onCreateProduct,
  onDeleteProduct,
  isAdmin = false
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const btnStyles = isAdmin
    ? "bg-slate-700 text-white hover:bg-slate-650 shadow-black/10"
    : "bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] shadow-[#CDD8E8]/10";

  const tableHeaderBg = isAdmin
    ? "bg-slate-900/60"
    : "bg-[#182032]/85";

  const tableContainerBg = isAdmin
    ? "bg-[#0f131c]/35"
    : "bg-[#182032]/35";

  const inputBg = isAdmin
    ? "bg-black/40 border-white/10 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:ring-slate-500/10"
    : "bg-[#0d1222] border-white/10 text-slate-200 placeholder-[#CDD8E8]/35 focus:border-[#CDD8E8] focus:ring-[#CDD8E8]/10";

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || prod.categoryId == filterCategory;
    const matchesStock = !filterStock || prod.stock === filterStock;
    const matchesTag = !filterTag || (filterTag === "none" ? (!prod.tags || prod.tags.length === 0) : (prod.tags && prod.tags.some(tId => tId == filterTag)));
    return matchesSearch && matchesCategory && matchesStock && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/5 pb-4 text-left">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Administrar Productos</h2>
          <p className="text-xs text-slate-400 mt-1">Crea, edita o elimina prendas del catálogo.</p>
        </div>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={onCreateProduct}
            className={`w-full sm:w-auto px-8 py-3 sm:px-4.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border-0 ${btnStyles}`}
          >
            + Crear Producto
          </button>
        </div>
      </div>

      {/* Barra de Filtros Principal */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between select-none">
        <div className="flex flex-grow gap-2 items-center max-w-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar prenda por nombre..."
              className={`w-full border rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 ${inputBg}`}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 select-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.608 10.608Z" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(prev => !prev)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${showFilters
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 p-4.5 rounded-2xl select-none fade-in text-left">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 ${inputBg}`}
            >
              <option value="" className="bg-[#12172d] text-slate-200">Todas las categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-[#12172d] text-slate-200">{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Disponibilidad</label>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 ${inputBg}`}
            >
              <option value="" className="bg-[#12172d] text-slate-200">Todos los estados</option>
              <option value="Disponible" className="bg-[#12172d] text-slate-200">Disponible</option>
              <option value="Sin Stock" className="bg-[#12172d] text-slate-200">Sin Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Etiqueta destacada</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 ${inputBg}`}
            >
              <option value="" className="bg-[#12172d] text-slate-200">Todas las etiquetas</option>
              <option value="none" className="bg-[#12172d] text-slate-200">Sin etiquetas</option>
              {tags.map(t => (
                <option key={t.id} value={t.id} className="bg-[#12172d] text-slate-200">{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Vista de Tabla en Escritorio (md en adelante) */}
      <div className={`hidden md:block overflow-x-auto rounded-xl border border-white/5 ${tableContainerBg}`}>
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className={`border-b border-white/5 ${tableHeaderBg} text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none`}>
              <th className="p-4">Foto</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 italic">
                  No se encontraron productos con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <img
                      src={prod.image || prod.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
                      alt={prod.name}
                      className="w-10 h-12 object-cover rounded-lg border border-white/10"
                    />
                  </td>
                  <td className="p-4 font-bold text-slate-200">
                    <div>{prod.name}</div>
                    {prod.tags && prod.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prod.tags.map(tId => {
                          const t = tags.find(tag => tag.id == tId);
                          if (!t) return null;
                          return (
                            <span
                              key={tId}
                              className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-full text-white border"
                              style={{
                                backgroundColor: t.color + "25",
                                borderColor: t.color + "60",
                                color: t.color
                              }}
                            >
                              {t.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-slate-400 font-medium">
                    {categories.find(c => c.id == prod.categoryId)?.name || "Ninguna"}
                  </td>
                  <td className="p-4 text-slate-300 font-bold font-mono">
                    ${prod.price.toLocaleString("es-AR")}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${prod.stock === "Disponible"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2.5">
                      <button
                        onClick={() => onEditProduct(prod)}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer border-0 bg-transparent"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer border-0 bg-transparent"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas en Móviles (inferior a md) */}
      <div className="block md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic bg-[#0f131c]/10 border border-dashed border-white/5 rounded-xl">
            No se encontraron productos con los filtros seleccionados.
          </div>
        ) : (
          filteredProducts.map(prod => (
            <div key={prod.id} className="p-4 rounded-xl border border-white/5 bg-[#0f131c]/30 flex gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={prod.image || prod.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
                  alt={prod.name}
                  className="w-12 h-15 object-cover rounded-lg border border-white/10 shrink-0"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-200 text-sm leading-snug">{prod.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Categoría: {categories.find(c => c.id == prod.categoryId)?.name || "Ninguna"}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-slate-300 font-bold font-mono text-xs">
                      ${prod.price.toLocaleString("es-AR")}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${prod.stock === "Disponible"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                      {prod.stock}
                    </span>
                  </div>
                  {prod.tags && prod.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prod.tags.map(tId => {
                        const t = tags.find(tag => tag.id == tId);
                        if (!t) return null;
                        return (
                          <span
                            key={tId}
                            className="inline-block text-[8px] font-extrabold px-1.5 py-0.1 rounded-full text-white border"
                            style={{
                              backgroundColor: t.color + "15",
                              borderColor: t.color + "30",
                              color: t.color
                            }}
                          >
                            {t.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => onEditProduct(prod)}
                  className="text-xs font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 px-3 py-1.5 rounded-lg border border-blue-500/20 text-center transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeleteProduct(prod.id)}
                  className="text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-lg border border-red-500/20 text-center transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
