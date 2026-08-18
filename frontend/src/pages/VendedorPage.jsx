import React, { useState, useEffect } from "react";
import {
  authService,
  productService,
  categoryService,
  tagService,
  colorService,
  announcementService
} from "../services/api.js";
import ProductForm from "../components/ProductForm.jsx";
import logoImg from "../assets/logo.png";
import isotypeImg from "../assets/isotipo kaxia.png";

export default function VendedorPage({ onLogout, onNavigateToCatalog, currentUser }) {
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Datos
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);

  // Estados de formularios / modales
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Inputs para creaciones simples
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6" });
  const [newColor, setNewColor] = useState({ name: "", hexCode: "#000000" });

  // Anuncios superiores
  const [announcementsText, setAnnouncementsText] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });

  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, cats, tgs, cols, annons] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        tagService.getAll(),
        colorService.getAll(),
        announcementService.getAll()
      ]);
      setProducts(prods);
      setCategories(cats);
      setTags(tgs);
      setColors(cols);
      setAnnouncementsText(annons.join("\n"));
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

  // --- ANUNCIOS SUPERIORES ---
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1422]">
      {/* Toast Alert */}
      {message.text && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-md px-4">
          <div className={`px-6 py-4 rounded-2xl border text-sm font-bold shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-2.5 justify-center text-center animate-fade-in ${message.type === "error"
              ? "bg-red-500/20 border-red-500/30 text-red-200 shadow-red-500/5"
              : "bg-green-500/20 border-green-500/30 text-green-200 shadow-green-500/5"
            }`}>
            <span>{message.type === "error" ? "⚠️" : "✨"}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <header className="sticky top-0 z-40 bg-[#182032] border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 select-none h-[30px]">
              <img src={isotypeImg} alt="Kaxia Isotipo" className="h-[30px] w-auto object-contain mix-blend-screen" />
              <img src={logoImg} alt="Kaxia Logotipo" className="h-[16px] w-auto object-contain mix-blend-screen hidden sm:block" />
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#CDD8E8]/10 text-[#CDD8E8] border border-[#CDD8E8]/20 font-mono select-none">
              Panel Vendedor
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium select-none">
            Sesión iniciada como: <span className="font-semibold text-slate-200">{currentUser?.username}</span> ({currentUser?.role})
          </p>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3.5">
          <button
            onClick={onNavigateToCatalog}
            className="w-1/2 sm:w-auto bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] font-black rounded-full px-5 py-2.5 text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#CDD8E8]/15 cursor-pointer flex items-center gap-1.5 justify-center"
          >
            👁️ Ver Catálogo
          </button>
          <button
            onClick={handleLogout}
            className="w-1/2 sm:w-auto bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 font-black rounded-full px-5 py-2.5 text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-red-500/5 cursor-pointer flex items-center gap-1.5 justify-center"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal con Sidebar */}
      <div className="flex flex-grow flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-[#182032]/60 border-r border-white/5 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible select-none">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "products" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
              }`}
          >
            👕 Productos
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "categories" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
              }`}
          >
            📁 Categorías
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "tags" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
              }`}
          >
            🏷️ Etiquetas
          </button>
          <button
            onClick={() => setActiveTab("colors")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "colors" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
              }`}
          >
            🎨 Colores Globales
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "settings" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
              }`}
          >
            📢 Barra de Anuncios
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "metrics" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
              }`}
          >
            📊 Estadísticas
          </button>
        </aside>

        {/* Tab Content Panels */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <div className="w-8 h-8 border-4 border-[#CDD8E8] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-sm font-medium">Cargando información del panel...</p>
            </div>
          ) : (
            <div className="fade-in space-y-8 text-left">
              {/* TAB ESTADÍSTICAS */}
              {activeTab === "metrics" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-100">Resumen y Estadísticas</h2>
                    <p className="text-xs text-slate-400 mt-1">Una vista general de tu inventario y el estado del catálogo.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
                    <div className="bg-[#182032]/45 border border-[#CDD8E8]/15 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-black/10">
                      <div>
                        <span className="text-[11px] uppercase font-bold tracking-widest text-[#CDD8E8]/50">Productos</span>
                        <h3 className="text-3xl font-black text-slate-100 mt-1.5">{products.length}</h3>
                      </div>
                      <span className="text-3xl bg-[#CDD8E8]/10 p-3 rounded-xl">👕</span>
                    </div>

                    <div className="bg-[#182032]/45 border border-[#CDD8E8]/15 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-black/10">
                      <div>
                        <span className="text-[11px] uppercase font-bold tracking-widest text-[#CDD8E8]/50">Sin Stock</span>
                        <h3 className="text-3xl font-black text-slate-100 mt-1.5 text-red-400">
                          {products.filter(p => p.stock === "Sin Stock" || p.stock === 0 || p.stock === "0").length}
                        </h3>
                      </div>
                      <span className="text-3xl bg-red-500/10 p-3 rounded-xl">⚠️</span>
                    </div>

                    <div className="bg-[#182032]/45 border border-[#CDD8E8]/15 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-black/10">
                      <div>
                        <span className="text-[11px] uppercase font-bold tracking-widest text-[#CDD8E8]/50">Categorías</span>
                        <h3 className="text-3xl font-black text-slate-100 mt-1.5">{categories.length}</h3>
                      </div>
                      <span className="text-3xl bg-[#CDD8E8]/10 p-3 rounded-xl">📁</span>
                    </div>

                    <div className="bg-[#182032]/45 border border-[#CDD8E8]/15 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-black/10">
                      <div>
                        <span className="text-[11px] uppercase font-bold tracking-widest text-[#CDD8E8]/50">Colores</span>
                        <h3 className="text-3xl font-black text-slate-100 mt-1.5">{colors.length}</h3>
                      </div>
                      <span className="text-3xl bg-[#CDD8E8]/10 p-3 rounded-xl">🎨</span>
                    </div>
                  </div>

                  {/* Detalle de stock crítico */}
                  <div className="bg-[#182032]/30 border border-white/5 rounded-2xl p-6 mt-8">
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
                            <div key={prod.id} className="flex items-center gap-3.5 p-3.5 bg-red-950/10 border border-red-500/10 rounded-xl">
                              <img
                                src={prod.imageUrl || prod.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
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
              )}
              {/* TAB PRODUCTOS */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 text-left">
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">Administrar Productos</h2>
                      <p className="text-xs text-slate-400 mt-1">Crea, edita o elimina prendas del catálogo.</p>
                    </div>
                    <button
                      onClick={handleCreateProduct}
                      className="bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#CDD8E8]/10 cursor-pointer"
                    >
                      + Crear Producto
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#182032]/35">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-[#182032]/85 text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none">
                          <th className="p-4">Foto</th>
                          <th className="p-4">Nombre</th>
                          <th className="p-4">Categoría</th>
                          <th className="p-4">Precio</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {products.map(prod => (
                          <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <img
                                src={prod.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
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
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${prod.stock === "Disponible" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                {prod.stock}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2.5">
                                <button
                                  onClick={() => handleEditProductClick(prod)}
                                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB CATEGORÍAS */}
              {activeTab === "categories" && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-slate-100">Administrar Categorías</h2>
                    <p className="text-xs text-slate-400 mt-1">Organiza tus productos en colecciones.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario */}
                    <div className="bg-[#182032]/40 border border-white/5 p-5 rounded-2xl h-fit">
                      <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Nueva Categoría</h3>
                      <form onSubmit={handleSaveCategory} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#CDD8E8]/50 mb-2">Nombre</label>
                          <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/20"
                            placeholder="Ej: Remeras"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#CDD8E8]/50 mb-2">Descripción</label>
                          <textarea
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/20"
                            placeholder="Descripción de la categoría..."
                            rows="3"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] py-3 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#CDD8E8]/10 cursor-pointer"
                        >
                          Agregar Categoría
                        </button>
                      </form>
                    </div>

                    {/* Lista */}
                    <div className="lg:col-span-2 space-y-3">
                      {categories.map(cat => (
                        <div key={cat.id} className="p-4 rounded-xl border border-white/5 bg-[#182032]/15 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-200 text-sm">{cat.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{cat.description || "Sin descripción."}</p>
                            <span className="inline-block text-[9px] font-mono text-slate-500 mt-1">Slug: {cat.slug}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB ETIQUETAS */}
              {activeTab === "tags" && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-slate-100">Administrar Etiquetas</h2>
                    <p className="text-xs text-slate-400 mt-1">Crea marcas visuales destacadas como "Hot Sale" o "Nuevo".</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario */}
                    <div className="bg-[#182032]/30 border border-white/5 p-5 rounded-2xl h-fit">
                      <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Nueva Etiqueta</h3>
                      <form onSubmit={handleSaveTag} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#CDD8E8]/50 mb-2">Nombre</label>
                          <input
                            type="text"
                            value={newTag.name}
                            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/20"
                            placeholder="Ej: Hot Sale"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#CDD8E8]/50 mb-2">Color identificativo</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={newTag.color}
                              onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                              className="w-12 h-10 bg-transparent border-0 cursor-pointer rounded-xl"
                            />
                            <input
                              type="text"
                              value={newTag.color}
                              onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                              className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-slate-100 uppercase focus:outline-none focus:border-[#CDD8E8]"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] py-3 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#CDD8E8]/10 cursor-pointer"
                        >
                          Crear Etiqueta
                        </button>
                      </form>
                    </div>

                    {/* Lista */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tags.map(tag => (
                        <div key={tag.id} className="p-4 rounded-xl border border-white/5 bg-[#182032]/15 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: tag.color }} />
                            <div>
                              <h4 className="font-bold text-slate-200 text-sm">{tag.name}</h4>
                              <span className="text-[10px] font-mono text-slate-500">{tag.color}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB COLORES */}
              {activeTab === "colors" && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-slate-100">Administrar Colores Globales</h2>
                    <p className="text-xs text-slate-400 mt-1">Configura la paleta de colores utilizables en las prendas.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario */}
                    <div className="bg-[#182032]/30 border border-white/5 p-5 rounded-2xl h-fit">
                      <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Nuevo Color</h3>
                      <form onSubmit={handleSaveColor} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#CDD8E8]/50 mb-2">Nombre descriptivo</label>
                          <input
                            type="text"
                            value={newColor.name}
                            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/20"
                            placeholder="Ej: Azul Marino"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#CDD8E8]/50 mb-2">Código Hexadecimal</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={newColor.hexCode}
                              onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                              className="w-12 h-10 bg-transparent border-0 cursor-pointer rounded-xl"
                            />
                            <input
                              type="text"
                              value={newColor.hexCode}
                              onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                              className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-slate-100 uppercase focus:outline-none focus:border-[#CDD8E8]"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] py-3 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#CDD8E8]/10 cursor-pointer"
                        >
                          Agregar Color
                        </button>
                      </form>
                    </div>

                    {/* Lista */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {colors.map(color => (
                        <div key={color.id} className="p-4 rounded-xl border border-white/5 bg-[#182032]/15 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: color.hexCode }} />
                            <div>
                              <h4 className="font-bold text-slate-200 text-xs">{color.name}</h4>
                              <span className="text-[9px] font-mono text-slate-500 uppercase">{color.hexCode}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteColor(color.id)}
                            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
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
                    <div className="bg-[#182032]/45 p-5 border border-white/5 rounded-2xl space-y-3.5">
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
                        className="w-full bg-[#07090e] border border-white/10 rounded-xl p-3 text-sm text-[#CDD8E8] placeholder-[#CDD8E8]/35 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/10 font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] py-3 px-6 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#CDD8E8]/10 cursor-pointer"
                    >
                      Guardar Anuncios
                    </button>
                  </form>
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
