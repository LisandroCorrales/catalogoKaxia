import React, { useState, useEffect } from "react";
import {
  authService,
  productService,
  categoryService,
  tagService,
  colorService,
  announcementService,
  analyticsService
} from "../services/api.js";
import ProductForm from "../components/ProductForm.jsx";
import logoImg from "../assets/logo.png";

// Importación de subcomponentes modulares del dashboard
import ProductsTab from "../components/dashboard/ProductsTab.jsx";
import CategoriesTab from "../components/dashboard/CategoriesTab.jsx";
import TagsTab from "../components/dashboard/TagsTab.jsx";
import ColorsTab from "../components/dashboard/ColorsTab.jsx";
import AnnouncementsTab from "../components/dashboard/AnnouncementsTab.jsx";
import StatsTab from "../components/dashboard/StatsTab.jsx";

export default function VendedorPage({ onLogout, onNavigateToCatalog, currentUser }) {
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Estados de datos principales
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
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
      const [prods, cats, tgs, cols, annons, analyticsData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        tagService.getAll(),
        colorService.getAll(),
        announcementService.getAll(),
        analyticsService.getStats()
      ]);
      setProducts(prods);
      setCategories(cats);
      setTags(tgs);
      setColors(cols);
      setAnnouncements(annons);
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
  const handleSaveCategory = async (name, description) => {
    try {
      const slug = name.toLowerCase().replace(/ /g, "-");
      await categoryService.create({ name, description, slug });
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
  const handleSaveTag = async (name, color) => {
    try {
      const slug = name.toLowerCase().replace(/ /g, "-");
      await tagService.create({ name, color, slug });
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
  const handleSaveColor = async (name, hexCode) => {
    try {
      await colorService.create({ name, hexCode });
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1422]">
      {/* Toast Notificación */}
      {message.text && (
        <div className={`fixed top-5 right-5 z-55 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all duration-300 transform translate-y-0 ${
          message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}>
          {message.text}
        </div>
      )}

      {/* Header Fino */}
      <header className="bg-[#07090e] border-b border-white/5 py-4 px-6 md:px-8 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="KAXIA" className="h-8 object-contain" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Panel Vendedor</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateToCatalog}
            className="text-xs font-bold text-[#CDD8E8] hover:underline cursor-pointer border-0 bg-transparent"
          >
            Ver Catálogo
          </button>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Hola, <span className="font-bold text-slate-200">{currentUser?.username}</span></span>
            <button
              onClick={handleLogout}
              className="bg-[#CDD8E8]/10 hover:bg-[#CDD8E8]/20 text-[#CDD8E8] text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer transition-colors border-0"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#07090e]/60 border-r border-white/5 p-5 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "products" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
            }`}
          >
            👕 Productos
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "categories" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
            }`}
          >
            📁 Categorías
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "tags" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
            }`}
          >
            🏷️ Etiquetas
          </button>
          <button
            onClick={() => setActiveTab("colors")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "colors" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
            }`}
          >
            🎨 Colores Globales
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "settings" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
            }`}
          >
            📢 Barra de Anuncios
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "metrics" ? "bg-[#CDD8E8] text-[#0d1222] font-extrabold shadow-md shadow-[#CDD8E8]/10" : "text-slate-400 hover:bg-[#CDD8E8]/5 hover:text-slate-100"
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
              {activeTab === "products" && (
                <ProductsTab
                  products={products}
                  categories={categories}
                  tags={tags}
                  onEditProduct={handleEditProductClick}
                  onCreateProduct={handleCreateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  isAdmin={false}
                />
              )}
              {activeTab === "categories" && (
                <CategoriesTab
                  categories={categories}
                  onSaveCategory={handleSaveCategory}
                  onDeleteCategory={handleDeleteCategory}
                  isAdmin={false}
                />
              )}
              {activeTab === "tags" && (
                <TagsTab
                  tags={tags}
                  onSaveTag={handleSaveTag}
                  onDeleteTag={handleDeleteTag}
                  isAdmin={false}
                />
              )}
              {activeTab === "colors" && (
                <ColorsTab
                  colors={colors}
                  onSaveColor={handleSaveColor}
                  onDeleteColor={handleDeleteColor}
                  isAdmin={false}
                />
              )}
              {activeTab === "settings" && (
                <AnnouncementsTab
                  announcements={announcements}
                  onRefresh={loadAllData}
                  showToast={showToast}
                  isAdmin={false}
                />
              )}
              {activeTab === "metrics" && (
                <StatsTab
                  stats={stats}
                  products={products}
                  categories={categories}
                  isAdmin={false}
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
    </div>
  );
}
