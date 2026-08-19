import React from "react";

export default function ProductsTab({
  products = [],
  categories = [],
  tags = [],
  onEditProduct,
  onCreateProduct,
  onDeleteProduct,
  isAdmin = false
}) {
  const btnStyles = isAdmin
    ? "bg-slate-700 text-white hover:bg-slate-650 shadow-black/10"
    : "bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] shadow-[#CDD8E8]/10";

  const tableHeaderBg = isAdmin
    ? "bg-slate-900/60"
    : "bg-[#182032]/85";

  const tableContainerBg = isAdmin
    ? "bg-[#0f131c]/35"
    : "bg-[#182032]/35";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4 text-left">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Administrar Productos</h2>
          <p className="text-xs text-slate-400 mt-1">Crea, edita o elimina prendas del catálogo.</p>
        </div>
        <button
          onClick={onCreateProduct}
          className={`${btnStyles} px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border-0`}
        >
          + Crear Producto
        </button>
      </div>

      <div className={`overflow-x-auto rounded-xl border border-white/5 ${tableContainerBg}`}>
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
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 italic">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map(prod => (
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
                    {prod.tagId && (
                      <span
                        className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-full mt-1 text-white border"
                        style={{
                          backgroundColor: tags.find(t => t.id === prod.tagId)?.color + "25",
                          borderColor: tags.find(t => t.id === prod.tagId)?.color + "60",
                          color: tags.find(t => t.id === prod.tagId)?.color
                        }}
                      >
                        {tags.find(t => t.id === prod.tagId)?.name}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400 font-medium">
                    {categories.find(c => c.id === prod.categoryId)?.name || "Ninguna"}
                  </td>
                  <td className="p-4 text-slate-300 font-bold font-mono">
                    ${prod.price.toLocaleString("es-AR")}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      prod.stock === "Disponible" 
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
    </div>
  );
}
