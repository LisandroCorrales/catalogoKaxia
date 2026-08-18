import React, { useState, useEffect } from "react";
import {
  authService,
  productService,
  categoryService,
  tagService,
  colorService,
  auditLogService,
  announcementService,
  userService
} from "../services/api.js";
import ProductForm from "../components/ProductForm.jsx";
import logoImg from "../assets/logo.png";
import isotypeImg from "../assets/isotipo kaxia.png";

export default function AdminPage({ onLogout, onNavigateToCatalog, currentUser }) {
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Datos
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [logs, setLogs] = useState([]);

  // Estados de formularios / modales
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Inputs para creaciones simples (categoría, color, tag)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6" });
  const [newColor, setNewColor] = useState({ name: "", hexCode: "#000000" });

  // Estados para anuncios de barra superior
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsText, setAnnouncementsText] = useState("");

  // Estados para administración de usuarios
  const [usersList, setUsersList] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "Vendedor" });
  const [editingUserPasswordId, setEditingUserPasswordId] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });

  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, cats, tgs, cols, auditLogs, annons, usersRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        tagService.getAll(),
        colorService.getAll(),
        auditLogService.getAll(),
        announcementService.getAll(),
        userService.getAll()
      ]);
      setProducts(prods);
      setCategories(cats);
      setTags(tgs);
      setColors(cols);
      setLogs(auditLogs);
      setAnnouncements(annons);
      setAnnouncementsText(annons.join("\n"));
      setUsersList(usersRes);
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

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await productService.delete(id);
      showToast("Producto eliminado con éxito.");
      loadAllData();
    } catch (err) {
      showToast("Error al eliminar.", "error");
    }
  };

  // --- CRUD CATEGORÍAS ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      const slug = newCategory.name.toLowerCase().replace(/ /g, "-");
      await categoryService.create({ ...newCategory, slug });
      setNewCategory({ name: "", description: "" });
      showToast("Categoría agregada con éxito.");
      loadAllData();
    } catch (err) {
      showToast("Error al guardar.", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta categoría?")) return;
    try {
      await categoryService.delete(id);
      showToast("Categoría eliminada.");
      loadAllData();
    } catch (err) {
      showToast(err.message || "Error al eliminar.", "error");
    }
  };

  // --- CRUD ETIQUETAS (TAGS) ---
  const handleSaveTag = async (e) => {
    e.preventDefault();
    if (!newTag.name.trim()) return;
    try {
      const slug = newTag.name.toLowerCase().replace(/ /g, "-");
      await tagService.create({ ...newTag, slug });
      setNewTag({ name: "", color: "#3b82f6" });
      showToast("Etiqueta creada con éxito.");
      loadAllData();
    } catch (err) {
      showToast("Error al crear etiqueta.", "error");
    }
  };

  const handleDeleteTag = async (id) => {
    if (!window.confirm("¿Eliminar etiqueta?")) return;
    try {
      await tagService.delete(id);
      showToast("Etiqueta eliminada.");
      loadAllData();
    } catch (err) {
      showToast("Error al eliminar.", "error");
    }
  };

  // --- CRUD COLORES ---
  const handleSaveColor = async (e) => {
    e.preventDefault();
    if (!newColor.name.trim() || !newColor.hexCode.trim()) return;
    try {
      await colorService.create(newColor);
      setNewColor({ name: "", hexCode: "#000000" });
      showToast("Color global agregado.");
      loadAllData();
    } catch (err) {
      showToast("Error al agregar color.", "error");
    }
  };

  const handleDeleteColor = async (id) => {
    if (!window.confirm("¿Eliminar color global?")) return;
    try {
      await colorService.delete(id);
      showToast("Color eliminado.");
      loadAllData();
    } catch (err) {
      showToast("Error al eliminar.", "error");
    }
  };

  const handleSaveAnnouncements = async (e) => {
    e.preventDefault();
    try {
      const lines = announcementsText
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);
      
      await announcementService.save(lines);
      showToast("Anuncios actualizados correctamente.");
      loadAllData();
    } catch (err) {
      showToast("Error al guardar anuncios.", "error");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username.trim()) {
      return showToast("El nombre de usuario es obligatorio.", "error");
    }
    try {
      await userService.create(newUser);
      setNewUser({ username: "", password: "", role: "Vendedor" });
      showToast("Usuario creado con éxito.");
      loadAllData();
    } catch (err) {
      showToast(err.message || "Error al crear usuario.", "error");
    }
  };

  const handleResetPassword = async (id) => {
    if (!window.confirm("¿Seguro que deseas blanquear la contraseña de este usuario a '123456'?")) return;
    try {
      await userService.updatePassword(id, "123456");
      showToast("Contraseña blanqueada a '123456'.");
      loadAllData();
    } catch (err) {
      showToast("Error al blanquear contraseña.", "error");
    }
  };

  const handleUpdatePasswordSubmit = async (id) => {
    if (!newPasswordVal.trim()) {
      return showToast("La nueva contraseña no puede estar vacía.", "error");
    }
    try {
      await userService.updatePassword(id, newPasswordVal.trim());
      showToast("Contraseña cambiada con éxito.");
      setEditingUserPasswordId(null);
      setNewPasswordVal("");
      loadAllData();
    } catch (err) {
      showToast("Error al actualizar contraseña.", "error");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cuenta de usuario?")) return;
    try {
      await userService.delete(id);
      showToast("Usuario eliminado con éxito.");
      loadAllData();
    } catch (err) {
      showToast(err.message || "Error al eliminar usuario.", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#04060a]">
      {/* Toast Alert */}
      {message.text && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-md px-4">
          <div className={`px-6 py-4 rounded-2xl border text-sm font-bold shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-2.5 justify-center text-center animate-fade-in ${
            message.type === "error"
              ? "bg-red-500/20 border-red-500/30 text-red-200 shadow-red-500/5"
              : "bg-green-500/20 border-green-500/30 text-green-200 shadow-green-500/5"
          }`}>
            <span>{message.type === "error" ? "⚠️" : "✨"}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <header className="sticky top-0 z-40 bg-[#080b11] border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 select-none h-[30px]">
              <img src={isotypeImg} alt="Kaxia Isotipo" className="h-[30px] w-auto object-contain mix-blend-screen" />
              <img src={logoImg} alt="Kaxia Logotipo" className="h-[16px] w-auto object-contain mix-blend-screen hidden sm:block" />
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-700/20 text-slate-400 border border-slate-700/30 font-mono select-none">
              Panel Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium select-none">
            Sesión iniciada como: <span className="font-semibold text-slate-200">{currentUser?.username}</span> ({currentUser?.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onNavigateToCatalog} className="btn-secondary py-1.5 px-4 text-xs font-semibold rounded-full cursor-pointer">
            👁️ Ver Catálogo Público
          </button>
          <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors py-1.5 px-4 rounded-full border border-red-500/20 bg-red-500/5 cursor-pointer">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal con Sidebar */}
      <div className="flex flex-grow flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-[#080b11]/60 border-r border-white/5 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible select-none">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "products" ? "bg-slate-750 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            👕 Productos
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "categories" ? "bg-slate-750 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            📁 Categorías
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "tags" ? "bg-slate-750 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            🏷️ Etiquetas
          </button>
          <button
            onClick={() => setActiveTab("colors")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "colors" ? "bg-slate-750 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            🎨 Colores Globales
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "settings" ? "bg-slate-750 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            📢 Barra de Anuncios
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "users" ? "bg-slate-750 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            👥 Gestionar Usuarios
          </button>
          {currentUser?.role === "Admin" && (
            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === "logs" ? "bg-slate-750 text-white font-extrabold shadow-lg shadow-black/25 border border-white/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              📜 Historial de Auditoría
            </button>
          )}
        </aside>

        {/* Tab Content Panels */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <div className="w-8 h-8 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-sm font-medium">Cargando información del panel...</p>
            </div>
          ) : (
            <div className="fade-in space-y-8 text-left">
              {/* Sección de Métricas (Sober y Dark) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 select-none">
                <div className="bg-[#080b11] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/25">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Productos</span>
                    <h3 className="text-2xl font-black text-slate-100 mt-1">{products.length}</h3>
                  </div>
                  <span className="text-2xl filter saturate-50 opacity-80">👕</span>
                </div>

                <div className="bg-[#080b11] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/25">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Usuarios</span>
                    <h3 className="text-2xl font-black text-slate-100 mt-1">{usersList.length}</h3>
                  </div>
                  <span className="text-2xl filter saturate-50 opacity-80">👥</span>
                </div>

                <div className="bg-[#080b11] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/25">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Auditoría</span>
                    <h3 className="text-2xl font-black text-slate-100 mt-1">{logs.length}</h3>
                  </div>
                  <span className="text-2xl filter saturate-50 opacity-80">📜</span>
                </div>

                <div className="bg-[#080b11] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/25">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Sin Stock</span>
                    <h3 className="text-2xl font-black text-slate-100 mt-1">
                      {products.filter(p => p.stock === "Sin Stock" || p.stock === 0 || p.stock === "0").length}
                    </h3>
                  </div>
                  <span className="text-2xl filter saturate-50 opacity-80">⚠️</span>
                </div>
              </div>
              {/* TAB PRODUCTOS */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">Administrar Productos</h2>
                      <p className="text-xs text-slate-400 mt-1">Crea, edita o elimina prendas del catálogo.</p>
                    </div>
                    <button
                      onClick={handleCreateProduct}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                    >
                      + Crear Producto
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0f131c]/30">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-[#0f131c]/80 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          <th className="p-4">Foto</th>
                          <th className="p-4">Nombre</th>
                          <th className="p-4">Categoría</th>
                          <th className="p-4">Precio</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4">Talles / Colores</th>
                          <th className="p-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(prod => {
                          const catName = categories.find(c => c.id === prod.categoryId)?.name || "-";
                          return (
                            <tr key={prod.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <img src={prod.image} alt={prod.name} className="w-10 h-12 object-cover rounded-lg bg-slate-800" />
                              </td>
                              <td className="p-4 font-bold text-slate-100">{prod.name}</td>
                              <td className="p-4 text-slate-400">{catName}</td>
                              <td className="p-4 font-mono text-slate-300 font-bold">${prod.price.toLocaleString("es-AR")}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  prod.stock === "Disponible" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                  {prod.stock}
                                </span>
                              </td>
                              <td className="p-4 space-y-1">
                                <div className="flex flex-wrap gap-1">
                                  {prod.sizes.map(s => <span key={s} className="px-1.5 py-0.2 bg-slate-800 rounded font-mono text-[10px]">{s}</span>)}
                                </div>
                                <div className="flex gap-0.5">
                                  {colors.filter(c => prod.colors.includes(c.id)).map(color => (
                                    <span key={color.id} style={{ backgroundColor: color.hexCode }} className="w-3.5 h-3.5 rounded-full border border-white/10" title={color.name} />
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button onClick={() => handleEditProductClick(prod)} className="text-slate-400 hover:text-white transition-colors font-semibold">
                                  Editar
                                </button>
                                <button onClick={() => handleDeleteProduct(prod.id)} className="text-slate-500 hover:text-red-400 transition-colors font-semibold">
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB CATEGORÍAS */}
              {activeTab === "categories" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Formulario */}
                  <div className="glass p-5 rounded-2xl border border-white/5 space-y-4 h-fit">
                    <h3 className="text-base font-bold text-slate-100 border-b border-white/5 pb-2">Crear Categoría</h3>
                    <form onSubmit={handleSaveCategory} className="space-y-4 text-left">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
                          <input type="text" value={newCategory.name} onChange={(e) => setNewCategory(p => ({ ...p, name: e.target.value }))} className="input-field focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20" placeholder="Ej: Buzos" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción</label>
                          <textarea value={newCategory.description} onChange={(e) => setNewCategory(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none text-xs focus:border-slate-500" />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                        >
                          Agregar Categoría
                        </button>
                      </form>
                  </div>

                  {/* Listado */}
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-100 border-b border-white/5 pb-2">Listado de Categorías</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map(cat => (
                        <div key={cat.id} className="p-4 rounded-xl border border-white/5 bg-[#0f131c]/40 flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-100">{cat.name}</h4>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">slug: {cat.slug}</p>
                            <p className="text-xs text-slate-400 mt-2">{cat.description || "Sin descripción."}</p>
                          </div>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB ETIQUETAS */}
              {activeTab === "tags" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Formulario */}
                  <div className="glass p-5 rounded-2xl border border-white/5 space-y-4 h-fit">
                    <h3 className="text-base font-bold text-slate-100 border-b border-white/5 pb-2">Crear Etiqueta</h3>
                    <form onSubmit={handleSaveTag} className="space-y-4 text-left">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
                          <input type="text" value={newTag.name} onChange={(e) => setNewTag(p => ({ ...p, name: e.target.value }))} className="input-field focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20" placeholder="Ej: Hot Sale" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Color de Fondo</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={newTag.color} onChange={(e) => setNewTag(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 border border-white/10 rounded cursor-pointer bg-transparent" />
                            <input type="text" value={newTag.color} onChange={(e) => setNewTag(p => ({ ...p, color: e.target.value }))} className="input-field text-xs uppercase focus:border-slate-500" />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                        >
                          Agregar Etiqueta
                        </button>
                      </form>
                  </div>

                  {/* Listado */}
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-100 border-b border-white/5 pb-2">Listado de Etiquetas</h2>
                    <div className="flex flex-wrap gap-3">
                      {tags.map(tag => (
                        <div key={tag.id} className="pl-4 pr-2 py-1.5 rounded-full border border-white/5 bg-[#0f131c]/50 flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                          <span className="font-bold text-xs text-slate-200">{tag.name}</span>
                          <button onClick={() => handleDeleteTag(tag.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB COLORES */}
              {activeTab === "colors" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Formulario */}
                  <div className="glass p-5 rounded-2xl border border-white/5 space-y-4 h-fit">
                    <h3 className="text-base font-bold text-slate-100 border-b border-white/5 pb-2">Crear Color Global</h3>
                    <form onSubmit={handleSaveColor} className="space-y-4 text-left">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
                          <input type="text" value={newColor.name} onChange={(e) => setNewColor(p => ({ ...p, name: e.target.value }))} className="input-field focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20" placeholder="Ej: Verde Oliva" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hexadecimal</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={newColor.hexCode} onChange={(e) => setNewColor(p => ({ ...p, hexCode: e.target.value }))} className="w-10 h-10 border border-white/10 rounded cursor-pointer bg-transparent" />
                            <input type="text" value={newColor.hexCode} onChange={(e) => setNewColor(p => ({ ...p, hexCode: e.target.value }))} className="input-field text-xs uppercase focus:border-slate-500" />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                        >
                          Agregar Color Global
                        </button>
                      </form>
                  </div>

                  {/* Listado */}
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-100 border-b border-white/5 pb-2">Listado de Colores Globales</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {colors.map(col => (
                        <div key={col.id} className="p-3 rounded-xl border border-white/5 bg-[#0f131c]/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: col.hexCode }} />
                            <div>
                              <p className="font-bold text-xs text-slate-200">{col.name}</p>
                              <p className="font-mono text-[9px] text-slate-500 uppercase">{col.hexCode}</p>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteColor(col.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB LOGS DE AUDITORÍA */}
              {activeTab === "logs" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100 border-b border-white/5 pb-2">Historial de Auditoría (Audit Log)</h2>
                    <p className="text-xs text-slate-400 mt-1">Línea de tiempo detallada con las modificaciones realizadas en el catálogo.</p>
                  </div>

                  <div className="space-y-4 max-w-4xl">
                    {logs.map(log => {
                      const formattedDate = new Date(log.createdAt).toLocaleString("es-AR");
                      return (
                        <div key={log.id} className="p-4 rounded-xl border border-white/5 bg-[#0f131c]/20 space-y-3 text-left">
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
                                <div className="text-slate-400">
                                  {JSON.stringify(log.details, null, 2)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB AJUSTES ANUNCIO */}
              {activeTab === "settings" && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-slate-100">Administrar Anuncios Superiores</h2>
                    <p className="text-xs text-slate-400 mt-1">Configura las frases informativas del carrusel superior fino.</p>
                  </div>
                  
                  <form onSubmit={handleSaveAnnouncements} className="max-w-xl space-y-4">
                    <div className="bg-[#0f131c]/45 p-5 border border-white/5 rounded-2xl space-y-3.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Textos del Carrusel
                      </label>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Ingresa una frase por línea. Al guardar, se formatearán automáticamente y se separarán por círculos en la barra superior. Puedes incluir emojis (por ejemplo: 🇦🇷).
                      </p>
                      <textarea
                        value={announcementsText}
                        onChange={(e) => setAnnouncementsText(e.target.value)}
                        rows="5"
                        placeholder="Ejemplo:&#10;Talles M — XXL&#10;Jersey 20.1&#10;Calidad de estampado&#10;Hecho en Argentina 🇦🇷"
                        className="w-full bg-[#07090e] border border-white/10 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/10 font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-700 hover:bg-slate-600 text-white py-2.5 px-6 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                    >
                      Guardar Anuncios
                    </button>
                  </form>
                </div>
              )}

              {/* TAB GESTIÓN DE USUARIOS */}
              {activeTab === "users" && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-slate-100 font-sans">Gestionar Cuentas de Usuario</h2>
                    <p className="text-xs text-slate-400 mt-1">Crea, modifica contraseñas o elimina accesos de Vendedores y Administradores.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario de Alta */}
                    <div className="bg-[#0f131c]/30 border border-white/5 p-5 rounded-2xl h-fit">
                      <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Nuevo Usuario</h3>
                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Nombre de Usuario
                          </label>
                          <input
                            type="text"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-medium"
                            placeholder="Ej: vendedor_juan"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Contraseña Inicial
                          </label>
                          <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20"
                            placeholder="Por defecto: 123456"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Rol del Usuario
                          </label>
                          <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-semibold"
                          >
                            <option value="Vendedor" className="bg-[#0f131c]">Vendedor</option>
                            <option value="Admin" className="bg-[#0f131c]">Administrador</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                        >
                          Crear Usuario
                        </button>
                      </form>
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-white/5 bg-[#0f131c]/30 h-fit">
                      <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-[#0f131c]/80 text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none">
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                          {usersList.map(user => {
                            const isSelf = currentUser && currentUser.id === user.id;
                            const isEditing = editingUserPasswordId === user.id;
                            
                            return (
                              <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 font-bold text-slate-200">
                                  <span>{user.username}</span>
                                  {isSelf && (
                                    <span className="ml-2 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      Tú
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                    user.role === "Admin" 
                                      ? "bg-[#6b21a8]/20 text-[#c084fc] border border-[#a855f7]/30" 
                                      : "bg-[#1e3a8a]/20 text-[#60a5fa] border border-[#3b82f6]/30"
                                  }`}>
                                    {user.role === "Admin" ? "Administrador" : "Vendedor"}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  {isEditing ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <input
                                        type="text"
                                        value={newPasswordVal}
                                        onChange={(e) => setNewPasswordVal(e.target.value)}
                                        className="bg-black/60 border border-white/15 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-slate-500 w-32 font-mono"
                                        placeholder="Nueva contraseña"
                                      />
                                      <button
                                        onClick={() => handleUpdatePasswordSubmit(user.id)}
                                        className="text-xs font-bold text-green-400 hover:text-green-300 cursor-pointer"
                                      >
                                        Aceptar
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingUserPasswordId(null);
                                          setNewPasswordVal("");
                                        }}
                                        className="text-xs font-bold text-slate-500 hover:text-slate-400 cursor-pointer"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end gap-3.5">
                                      <button
                                        onClick={() => {
                                          setEditingUserPasswordId(user.id);
                                          setNewPasswordVal("");
                                        }}
                                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                                      >
                                        Cambiar Clave
                                      </button>
                                      <button
                                        onClick={() => handleResetPassword(user.id)}
                                        className="text-xs font-bold text-blue-400 hover:text-blue-350 transition-colors cursor-pointer"
                                        title="Blanquear contraseña a '123456'"
                                      >
                                        Blanquear
                                      </button>
                                      <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        disabled={isSelf}
                                        className="text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-30 transition-colors cursor-pointer"
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
