import React, { useState } from "react";

export default function TagsTab({
  tags = [],
  onSaveTag,
  onDeleteTag,
  isAdmin = false
}) {
  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6" });
  const [editingId, setEditingId] = useState(null);

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
    if (!newTag.name.trim()) return;
    onSaveTag(newTag.name.trim(), newTag.color, editingId);
    setNewTag({ name: "", color: "#3b82f6" });
    setEditingId(null);
  };

  const handleEditClick = (tag) => {
    setEditingId(tag.id);
    setNewTag({ name: tag.name, color: tag.color });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewTag({ name: "", color: "#3b82f6" });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-slate-100">Administrar Etiquetas</h2>
        <p className="text-xs text-slate-400 mt-1">Crea marcas visuales destacadas como "Hot Sale" o "Nuevo".</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className={`${cardBg} border border-white/5 p-5 rounded-2xl h-fit`}>
          <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
            {editingId ? "Editar Etiqueta" : "Nueva Etiqueta"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider ${labelStyles} mb-2`}>Nombre</label>
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 ${focusBorder}`}
                placeholder="Ej: Hot Sale"
                required
              />
            </div>
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider ${labelStyles} mb-2`}>Color identificativo</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  className="w-12 h-10 bg-transparent border-0 cursor-pointer rounded-xl shrink-0"
                />
                <input
                  type="text"
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  className={`flex-grow bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-slate-100 uppercase focus:outline-none focus:ring-1 ${focusBorder}`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-1/2 bg-white/5 hover:bg-white/10 text-slate-300 py-3 text-xs rounded-xl font-bold uppercase tracking-widest cursor-pointer border-0 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className={`${editingId ? 'w-1/2' : 'w-full'} ${btnStyles} py-3 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border-0`}
              >
                {editingId ? "Guardar" : "Crear Etiqueta"}
              </button>
            </div>
          </form>
        </div>

        {/* Lista */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tags.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-500 italic bg-white/[0.01] border border-dashed border-white/5 rounded-xl">
              No hay etiquetas registradas.
            </div>
          ) : (
            tags.map(tag => (
              <div key={tag.id} className={`p-4 rounded-xl border border-white/5 ${listItemBg} flex items-center justify-between gap-4`}>
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: tag.color }} />
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{tag.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{tag.color}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(tag)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteTag(tag.id)}
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
