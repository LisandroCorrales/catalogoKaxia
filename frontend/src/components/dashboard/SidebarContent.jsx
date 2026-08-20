import React from "react";

export default function SidebarContent({ activeTab, setActiveTab, isAdmin = false }) {
  const tabs = [
    { id: "products", name: "Productos", icon: "👕" },
    { id: "categories", name: "Categorías", icon: "📁" },
    { id: "tags", name: "Etiquetas", icon: "🏷️" },
    { id: "colors", name: "Colores Globales", icon: "🎨" },
    { id: "settings", name: "Barra de Anuncios", icon: "📢" },
    { id: "metrics", name: "Estadísticas", icon: "📊" }
  ];

  if (isAdmin) {
    tabs.push(
      { id: "users", name: "Usuarios", icon: "👥" },
      { id: "logs", name: "Auditoría", icon: "📋" }
    );
  }

  const activeClass = isAdmin
    ? "bg-slate-700 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5"
    : "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10";

  const inactiveClass = isAdmin
    ? "bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100"
    : "bg-transparent text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100";

  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border-0 ${
            activeTab === tab.id ? activeClass : inactiveClass
          }`}
        >
          <span>{tab.icon}</span> <span>{tab.name}</span>
        </button>
      ))}
    </>
  );
}
