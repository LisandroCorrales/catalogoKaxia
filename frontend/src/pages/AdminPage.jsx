import React, { useState, useEffect } from "react";
import {
  authService,
  productService,
  categoryService,
  tagService,
  colorService,
  auditLogService,
  announcementService,
  userService,
  analyticsService
} from "../services/api.js";
import ProductForm from "../components/ProductForm.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import ToastNotification from "../components/ToastNotification.jsx";
import logoImg from "../assets/logo.png";

// Importación de subcomponentes modulares del dashboard
import ProductsTab from "../components/dashboard/ProductsTab.jsx";
import CategoriesTab from "../components/dashboard/CategoriesTab.jsx";
import TagsTab from "../components/dashboard/TagsTab.jsx";
import ColorsTab from "../components/dashboard/ColorsTab.jsx";
import AnnouncementsTab from "../components/dashboard/AnnouncementsTab.jsx";
import StatsTab from "../components/dashboard/StatsTab.jsx";
import UsersTab from "../components/dashboard/UsersTab.jsx";
import AuditLogsTab from "../components/dashboard/AuditLogsTab.jsx";

// Componente helper para no duplicar los botones del Sidebar de Admin
function SidebarContent({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "products", name: "Productos", icon: "👕" },
    { id: "categories", name: "Categorías", icon: "📁" },
    { id: "tags", name: "Etiquetas", icon: "🏷️" },
    { id: "colors", name: "Colores Globales", icon: "🎨" },
    { id: "settings", name: "Barra de Anuncios", icon: "📢" },
    { id: "metrics", name: "Estadísticas", icon: "📊" },
    { id: "users", name: "Usuarios", icon: "👥" },
    { id: "logs", name: "Auditoría", icon: "📋" }
  ];

  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border-0 ${
            activeTab === tab.id 
              ? "bg-slate-700 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" 
              : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100"
          }`}
        >
          <span>{tab.icon}</span> <span>{tab.name}</span>
        </button>
      ))}
    </>
  );
}

export default function AdminPage({ onLogout, onNavigateToCatalog, currentUser }) {
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Control responsivo de menú lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Control de eliminación custom modal
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, title, message }

  // Estados de datos principales
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [logs, setLogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState(null);

  // Estados de formularios / modales
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Toast/Mensajes
  const [message, setMessage] = useState({ text: "", type: "" });

  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, cats, tgs, cols, auditLogs, annons, usersRes, analyticsData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        tagService.getAll(),
        colorService.getAll(),
        auditLogService.getAll(),
        announcementService.getAll(),
        userService.getAll(),
        analyticsService.getStats()
      ]);
      setProducts(prods);
      setCategories(cats);
      setTags(tgs);
      setColors(cols);
      setLogs(auditLogs);
      setAnnouncements(annons);
      setUsersList(usersRes);
      setStats(analyticsData);
    } catch (err) {
      showToast("Error al cargar datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  // --- CRUD PRODUCTOS ---
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (data) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, data);
        showToast("Producto actualizado con éxito.");
      } else {
        await productService.create(data);
        showToast("Producto creado con éxito.");
      }
      setIsProductFormOpen(false);
      loadAllData();
    } catch (err) {
      showToast(err.message || "Error al guardar el producto.", "error");
    }
  };

  const handleDeleteProduct = (id) => {
    setDeleteTarget({
      type: "product",
      id,
      title: "Eliminar Producto",
      message: "¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
    });
  };

  // --- CRUD CATEGORÍAS ---
  const handleSaveCategory = async (name, description, id = null) => {
    try {
      const slug = name.toLowerCase().replace(/ /g, "-");
      if (id) {
        await categoryService.update(id, { name, description, slug });
        showToast("Categoría actualizada con éxito.");
      } else {
        await categoryService.create({ name, description, slug });
        showToast("Categoría agregada con éxito.");
      }
      loadAllData();
    } catch (err) {
      showToast("Error al guardar.", "error");
    }
  };

  const handleDeleteCategory = (id) => {
    setDeleteTarget({
      type: "category",
      id,
      title: "Eliminar Categoría",
      message: "¿Seguro que deseas eliminar esta categoría? Esto podría afectar a las prendas asociadas."
    });
  };

  // --- CRUD ETIQUETAS (TAGS) ---
  const handleSaveTag = async (name, color, id = null) => {
    try {
      const slug = name.toLowerCase().replace(/ /g, "-");
      if (id) {
        await tagService.update(id, { name, color, slug });
        showToast("Etiqueta actualizada con éxito.");
      } else {
        await tagService.create({ name, color, slug });
        showToast("Etiqueta creada con éxito.");
      }
      loadAllData();
    } catch (err) {
      showToast("Error al guardar etiqueta.", "error");
    }
  };

  const handleDeleteTag = (id) => {
    setDeleteTarget({
      type: "tag",
      id,
      title: "Eliminar Etiqueta",
      message: "¿Seguro que deseas eliminar esta etiqueta?"
    });
  };

  // --- CRUD COLORES ---
  const handleSaveColor = async (name, hexCode, id = null) => {
    try {
      if (id) {
        await colorService.update(id, { name, hexCode });
        showToast("Color actualizado con éxito.");
      } else {
        await colorService.create({ name, hexCode });
        showToast("Color global agregado.");
      }
      loadAllData();
    } catch (err) {
      showToast("Error al guardar color.", "error");
    }
  };

  const handleDeleteColor = (id) => {
    setDeleteTarget({
      type: "color",
      id,
      title: "Eliminar Color",
      message: "¿Seguro que deseas eliminar este color global?"
    });
  };

  // --- CRUD ACCESOS DE USUARIOS ---
  const handleCreateUser = async (username, password, role) => {
    try {
      await userService.create({ username, password, role });
      showToast("Usuario creado con éxito.");
      loadAllData();
    } catch (err) {
      showToast(err.message || "Error al crear usuario.", "error");
    }
  };

  const handleUpdatePasswordSubmit = (id, newPassword) => {
    setDeleteTarget({
      type: "changePassword",
      id,
      extraData: { newPassword },
      title: "Confirmar Cambio de Contraseña",
      message: "¿Seguro que deseas cambiar la contraseña de este usuario? Deberá iniciar sesión con su nueva contraseña.",
      confirmText: "Confirmar"
    });
  };

  const handleDeleteUser = (id) => {
    setDeleteTarget({
      type: "user",
      id,
      title: "Suspender Usuario",
      message: "¿Seguro que deseas dar de baja esta cuenta de usuario? Se desactivará su acceso pero podrás reactivarla cuando quieras.",
      confirmText: "Confirmar"
    });
  };

  const handleRestoreUser = async (id) => {
    try {
      await userService.restore(id);
      showToast("Usuario reactivado con éxito.");
      loadAllData();
    } catch (err) {
      showToast("Error al reactivar usuario.", "error");
    }
  };

  // --- CONFIRMAR ELIMINADO / ACCIONES ---
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      if (type === "product") {
        await productService.delete(id);
        showToast("Producto eliminado con éxito.");
      } else if (type === "category") {
        await categoryService.delete(id);
        showToast("Categoría eliminada con éxito.");
      } else if (type === "tag") {
        await tagService.delete(id);
        showToast("Etiqueta eliminada.");
      } else if (type === "color") {
        await colorService.delete(id);
        showToast("Color eliminado.");
      } else if (type === "user") {
        await userService.delete(id);
        showToast("Usuario eliminado con éxito.");
      } else if (type === "changePassword") {
        const { newPassword } = deleteTarget.extraData;
        await userService.updatePassword(id, newPassword);
        showToast("Contraseña cambiada con éxito.");
      }
      setDeleteTarget(null);
      loadAllData();
    } catch (err) {
      showToast(err.message || "Error al realizar acción.", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#04060a]">
      {/* Toast Notificación */}
      <ToastNotification
        text={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "", type: "" })}
      />

      {/* Header Fino */}
      <header className="bg-[#07090e] border-b border-white/5 py-4 px-6 md:px-8 flex items-center justify-between shadow-md select-none">
        {/* Lado Izquierdo: Botón Hamburguesa y Logotipo alineados a la izquierda */}
        <div className="flex items-center gap-3">
          {/* Botón hamburguesa (mobile) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer border-0 bg-transparent flex items-center justify-center outline-none"
            title="Abrir Menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <img src={logoImg} alt="KAXIA" className="h-8 object-contain" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 hidden sm:inline" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hidden sm:inline">Panel Administrador</span>
        </div>

        {/* Lado Derecho (Escritorio únicamente, oculto en mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onNavigateToCatalog}
            className="text-xs font-bold border border-white/20 hover:bg-white/10 px-3 py-1.5 rounded-lg text-slate-200 transition-colors cursor-pointer block bg-transparent"
          >
            Ver Catálogo
          </button>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Hola, <span className="font-bold text-slate-200">{currentUser?.username}</span></span>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-wider py-1.5 px-3.5 rounded-lg cursor-pointer transition-all active:scale-95"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar para Escritorio */}
        <aside className="hidden md:flex w-64 bg-[#07090e]/60 border-r border-white/5 p-5 flex-col gap-2 shrink-0">
          <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        {/* Sidebar para Móvil (Drawer Overlay responsivo) */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity" 
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Drawer */}
            <aside className="relative w-64 max-w-[80vw] bg-[#07090e] border-r border-white/10 p-5 flex flex-col justify-between h-full z-10 animate-slide-right text-left">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2 select-none">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Navegación</span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-slate-400 hover:text-white p-1 cursor-pointer border-0 bg-transparent outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <SidebarContent 
                  activeTab={activeTab} 
                  setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setIsSidebarOpen(false);
                  }} 
                />
              </div>

              {/* Botones de acción integrados al Drawer en móviles */}
              <div className="border-t border-white/5 pt-4 mt-auto space-y-4">
                <div className="text-xs font-medium text-slate-400 select-none">
                  Hola, <span className="font-bold text-slate-200">{currentUser?.username}</span>
                </div>
                <button
                  onClick={() => {
                    onNavigateToCatalog();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-center text-xs font-bold border border-white/20 hover:bg-white/10 px-3 py-2.5 rounded-lg text-slate-200 transition-colors cursor-pointer block bg-transparent"
                >
                  Ver Catálogo
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-center bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 text-xs font-black uppercase tracking-wider py-2.5 px-3.5 rounded-lg cursor-pointer transition-all active:scale-95 block"
                >
                  Cerrar Sesión
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Tab Content Panels */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <div className="w-8 h-8 border-4 border-slate-650 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-sm font-medium font-sans animate-pulse">Cargando información del panel...</p>
            </div>
          ) : (
            <div className="fade-in space-y-8 text-left">
              {activeTab === "products" && (
                <ProductsTab
                  products={products}
                  categories={categories}
                  tags={tags}
                  onEditProduct={handleEditProductClick}
                  onCreateProduct={handleCreateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  isAdmin={true}
                />
              )}
              {activeTab === "categories" && (
                <CategoriesTab
                  categories={categories}
                  onSaveCategory={handleSaveCategory}
                  onDeleteCategory={handleDeleteCategory}
                  isAdmin={true}
                />
              )}
              {activeTab === "tags" && (
                <TagsTab
                  tags={tags}
                  onSaveTag={handleSaveTag}
                  onDeleteTag={handleDeleteTag}
                  isAdmin={true}
                />
              )}
              {activeTab === "colors" && (
                <ColorsTab
                  colors={colors}
                  onSaveColor={handleSaveColor}
                  onDeleteColor={handleDeleteColor}
                  isAdmin={true}
                />
              )}
              {activeTab === "settings" && (
                <AnnouncementsTab
                  announcements={announcements}
                  onRefresh={loadAllData}
                  showToast={showToast}
                  isAdmin={true}
                />
              )}
              {activeTab === "metrics" && (
                <StatsTab
                  stats={stats}
                  products={products}
                  categories={categories}
                  isAdmin={true}
                />
              )}
              {activeTab === "users" && (
                <UsersTab
                  usersList={usersList}
                  currentUser={currentUser}
                  onCreateUser={handleCreateUser}
                  onUpdatePassword={handleUpdatePasswordSubmit}
                  onDeleteUser={handleDeleteUser}
                  onRestoreUser={handleRestoreUser}
                />
              )}
              {activeTab === "logs" && (
                <AuditLogsTab
                  logs={logs}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal de Producto */}
      <ProductForm
        isOpen={isProductFormOpen}
        product={editingProduct}
        categories={categories}
        colors={colors}
        tags={tags}
        onSave={handleSaveProduct}
        onClose={() => setIsProductFormOpen(false)}
      />

      {/* Modal de Confirmación de Eliminado */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || ""}
        message={deleteTarget?.message || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={deleteTarget?.confirmText || "Eliminar"}
      />
    </div>
  );
}
