import React, { useState, useEffect } from "react";
import { announcementService } from "../../services/api.js";

export default function AnnouncementsTab({
  announcements: initialAnnouncements = [],
  onRefresh,
  showToast,
  isAdmin = false
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    if (announcements.includes(newAnnouncement.trim())) {
      showToast("Ese anuncio ya existe.", "error");
      return;
    }
    const updated = [...announcements, newAnnouncement.trim()];
    setAnnouncements(updated);
    setNewAnnouncement("");
    try {
      await announcementService.save(updated);
      showToast("Anuncio agregado y guardado.");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast("Error al guardar anuncios.", "error");
    }
  };

  const handleRemoveAnnouncement = async (indexToRemove) => {
    const updated = announcements.filter((_, idx) => idx !== indexToRemove);
    setAnnouncements(updated);
    try {
      await announcementService.save(updated);
      showToast("Anuncio eliminado y guardado.");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast("Error al guardar anuncios.", "error");
    }
  };

  const handleSaveEdit = async (idx, newVal) => {
    const trimmed = newVal.trim();
    let updated;
    if (!trimmed) {
      updated = announcements.filter((_, i) => i !== idx);
    } else {
      updated = [...announcements];
      updated[idx] = trimmed;
    }
    setAnnouncements(updated);
    setEditingIndex(null);
    try {
      await announcementService.save(updated);
      showToast("Anuncio modificado y guardado.");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast("Error al guardar anuncios.", "error");
    }
  };

  const cardBg = isAdmin
    ? "bg-[#0f131c]/45 border-white/5"
    : "bg-[#182032]/45 border-white/5";

  const pillContainerBg = isAdmin
    ? "bg-black/40 border-white/10"
    : "bg-[#07090e] border-white/10";

  const pillBg = isAdmin
    ? "bg-slate-800 border-white/5 text-slate-200"
    : "bg-[#182032] border-[#CDD8E8]/10 text-[#CDD8E8]";

  const inputBg = isAdmin
    ? "bg-black/40 border-white/10 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:ring-slate-500/10"
    : "bg-[#07090e] border-white/10 text-[#CDD8E8] placeholder-[#CDD8E8]/35 focus:border-[#CDD8E8] focus:ring-[#CDD8E8]/10";

  const btnStyles = isAdmin
    ? "bg-slate-700 hover:bg-slate-600 text-white shadow-black/10"
    : "bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] shadow-[#CDD8E8]/5";

  const editBorder = isAdmin
    ? "focus:border-slate-500"
    : "focus:border-[#CDD8E8]";

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-slate-100">Administrar Anuncios Superiores</h2>
        <p className="text-xs text-slate-400 mt-1">Configura las frases informativas del carrusel superior fino.</p>
      </div>

      <div className="max-w-xl space-y-4">
        <div className={`p-5 border rounded-2xl space-y-4 ${cardBg}`}>
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Anuncios Activos
            </label>
            <span className="text-[10px] text-slate-500 font-medium italic">Haz clic en el texto para editar</span>
          </div>

          {/* Grid de Etiquetas / Anuncios */}
          <div className={`flex flex-wrap gap-2.5 min-h-[50px] p-3.5 border rounded-xl ${pillContainerBg}`}>
            {announcements.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No hay anuncios activos. Añade uno abajo.</span>
            ) : (
              announcements.map((ann, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold ${pillBg}`}
                >
                  {editingIndex === idx ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => handleSaveEdit(idx, editingValue)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(idx, editingValue);
                        if (e.key === "Escape") setEditingIndex(null);
                      }}
                      className="bg-black/50 border border-white/20 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none max-w-[150px] font-semibold"
                      style={{ outline: "none" }}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingIndex(idx);
                        setEditingValue(ann);
                      }}
                      className="cursor-pointer hover:underline hover:text-white"
                      title="Click para editar"
                    >
                      {ann}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveAnnouncement(idx)}
                    className="hover:text-red-400 font-extrabold cursor-pointer outline-none border-0 bg-transparent text-sm leading-none shrink-0"
                    style={{ color: "inherit", opacity: 0.6 }}
                  >
                    &times;
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Añadir anuncio nuevo */}
          <form onSubmit={handleAddAnnouncement} className="flex gap-2">
            <input
              type="text"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Escribe una nueva frase de anuncio... (Ej: Envíos gratis a todo el país)"
              className={`flex-grow border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 ${inputBg}`}
            />
            <button
              type="submit"
              className={`${btnStyles} px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all shrink-0 border-0 hover:scale-[1.01] active:scale-95 shadow-md`}
            >
              Añadir y Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
