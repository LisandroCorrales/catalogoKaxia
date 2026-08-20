import React, { useState } from "react";

export default function CategoriesTab({
  categories = [],
  onSaveCategory,
  onDeleteCategory,
  isAdmin = false
}) {
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const labelStyles = isAdmin
    ? "text-slate-400"
    : "text-[#CDD8E8]/50";

  const btnStyles = isAdmin
    ? "bg-slate-700 hover:bg-slate-650 text-white shadow-black/10"
    : "bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] shadow-[#CDD8E8]/10";

  const focusBorder = isAdmin
    ? "focus:border-slate-500 focus:ring-slate-500/20"
    : "focus:border-[#CDD8E8] focus:ring-[#CDD8E8]/20";

  const cardBg = isAdmin
    ? "bg-[#0f131c]/45"
    : "bg-[#182032]/45";

  const listItemBg = isAdmin
    ? "bg-[#0f131c]/15"
    : "bg-[#182032]/15";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    onSaveCategory(newCategory.name.trim(), newCategory.description.trim(), editingId);
    setNewCategory({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setNewCategory({ name: cat.name, description: cat.description || "" });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewCategory({ name: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Administrar Categorías</h2>
          <p className="text-xs text-slate-400 mt-1">Organiza tus productos en colecciones.</p>
        </div>        <div className="mt-4 flex justify-center w-full lg:hidden">
          <button
            onClick={() => {
              if (showForm) {
                handleCancelEdit();
              } else {
                setShowForm(true);
                setEditingId(null);
                setNewCategory({ name: "", description: "" });
              }
            }}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border-0 select-none ${
              showForm 
                ? "bg-[#1f293e] hover:bg-[#28354f] text-slate-300 border border-white/10" 
                : btnStyles
            }`}
          >
            {showForm ? "✕ Cerrar Formulario" : "+ Agregar Categoría"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className={`${cardBg} border border-white/5 p-5 rounded-2xl h-fit fade-in ${showForm ? "block" : "hidden lg:block"}`}>
          <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
            {editingId ? "Editar Categoría" : "Nueva Categoría"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider ${labelStyles} mb-2`}>Nombre</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 ${focusBorder}`}
                placeholder="Ej: Remeras"
                required
              />
            </div>
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider ${labelStyles} mb-2`}>Descripción</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 ${focusBorder}`}
                placeholder="Descripción de la categoría..."
                rows="3"
              />
            </div>
            <div className="flex gap-2">
              {(editingId || showForm) && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`w-1/2 bg-white/5 hover:bg-white/10 text-slate-300 py-3 text-xs rounded-xl font-bold uppercase tracking-widest cursor-pointer border-0 transition-colors ${!editingId ? "lg:hidden" : ""}`}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className={`${(editingId || showForm) ? "w-1/2" : "w-full"} ${btnStyles} py-3 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border-0`}
              >
                {editingId ? "Guardar" : "Agregar Categoría"}
              </button>
            </div>
          </form>
        </div>

        {/* Lista */}
        <div className="lg:col-span-2 space-y-3">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic bg-white/[0.01] border border-dashed border-white/5 rounded-xl">
              No hay categorías registradas.
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className={`p-4 rounded-xl border border-white/5 ${listItemBg} flex items-center justify-between gap-4`}>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{cat.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{cat.description || "Sin descripción."}</p>
                  <span className="inline-block text-[9px] font-mono text-slate-500 mt-1">Slug: {cat.slug}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
