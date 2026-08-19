import React, { useState, useEffect } from "react";
import { productService, categoryService, tagService, colorService, announcementService, analyticsService } from "../services/api.js";
import Header from "../components/Header.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CartDrawer from "../components/CartDrawer.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import QuickAddModal from "../components/QuickAddModal.jsx";
import SizeTableModal from "../components/SizeTableModal.jsx";
import WhatsAppFloatingButton from "../components/WhatsAppFloatingButton.jsx";
import AnnouncementBar from "../components/AnnouncementBar.jsx";



export default function CatalogPage({ onNavigateToLogin, onNavigateToAdmin, currentUser, cart, setCart, isCartOpen, setIsCartOpen }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal de Selección rápida de Talle y Color
  const [quickAddProduct, setQuickAddProduct] = useState(null);


  // Modal de Tabla de Talles
  const [sizeTableProduct, setSizeTableProduct] = useState(null);

  useEffect(() => {
    analyticsService.trackSession();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, tagsRes, colorsRes, annonsRes] = await Promise.all([
          categoryService.getAll(),
          tagService.getAll(),
          colorService.getAll(),
          announcementService.getAll()
        ]);
        setCategories(catsRes);
        setTags(tagsRes);
        setColors(colorsRes);
        setAnnouncements(annonsRes);

        const prodsRes = await productService.getAll({
          categoryId: selectedCategory,
          tagId: selectedTag
        });
        
        // Ordenar productos: disponibles primero, sin stock al final
        const sortedProds = [...prodsRes].sort((a, b) => {
          const aOut = a.stock === "Sin Stock";
          const bOut = b.stock === "Sin Stock";
          if (aOut && !bOut) return 1;
          if (!aOut && bOut) return -1;
          return 0;
        });

        setProducts(sortedProds);
      } catch (err) {
        console.error("Error al cargar datos del catálogo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, selectedTag]);

  const handleAddToCartClick = (product) => {
    setQuickAddProduct(product);
  };

  const handleConfirmQuickAdd = (product, size, color, quantity) => {
    analyticsService.trackAddToCart(product.id);
    setCart(prev => {
      const idx = prev.findIndex(item =>
        item.product.id === product.id &&
        item.size === size &&
        item.color.id === color.id
      );

      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product,
          size,
          color,
          quantity
        }];
      }
    });

    setQuickAddProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemToUpdate, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemToUpdate);
      return;
    }
    setCart(prev => prev.map(item =>
      (item.product.id === itemToUpdate.product.id && item.size === itemToUpdate.size && item.color.id === itemToUpdate.color.id)
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  const handleRemoveItem = (itemToRemove) => {
    setCart(prev => prev.filter(item =>
      !(item.product.id === itemToRemove.product.id && item.size === itemToRemove.size && item.color.id === itemToRemove.color.id)
    ));
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-body-light">
      {/* Carrusel Informativo Superior */}
      <AnnouncementBar announcements={announcements} />

      {/* Header Reutilizable */}
      <Header
        onOpenEditor={currentUser ? onNavigateToAdmin : onNavigateToLogin}
        onOpenCart={() => setIsCartOpen(true)}
        cartItemsCount={cartItemsCount}
        currentUser={currentUser}
        onBackToPanel={currentUser ? onNavigateToAdmin : null}
      />

      {/* Componente Hero con fondo de imagen y textos superpuestos */}
      <Hero />

      {/* Título de Colección y Filtros (Fondo Gris Claro) */}
      <section id="productos" className="max-w-[1220px] mx-auto w-full px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div className="text-left">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold mb-1">COLECCIÓN</p>
            <h2 className="text-3xl font-extrabold text-navy">Productos</h2>
          </div>
        </div>

        {/* Barra de Filtros (Categorías a la izquierda, Menú desplegable a la derecha) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 mb-8 text-slate-800">
          {/* Categorías (Izquierda) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-grow">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${selectedCategory === ""
                ? "bg-navy text-white border-navy font-extrabold"
                : "bg-white text-slate-500 border-slate-200 hover:text-navy hover:border-slate-400"
                }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${selectedCategory === cat.id
                  ? "bg-navy text-white border-navy font-extrabold"
                  : "bg-white text-slate-500 border-slate-200 hover:text-navy hover:border-slate-400"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menú desplegable Filtrar por Etiqueta (Derecha) */}
          <div className="relative shrink-0 select-none max-md:self-start">
            <button
              onClick={() => setIsTagDropdownOpen(prev => !prev)}
              className="px-4.5 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-navy hover:border-slate-400 transition-all flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>Etiqueta: {selectedTag ? (tags.find(t => t.id === selectedTag)?.name) : "Todas"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {isTagDropdownOpen && (
              <>
                {/* Backdrop invisible para cerrar al hacer click afuera */}
                <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setIsTagDropdownOpen(false)} />

                {/* Menú flotante */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 overflow-hidden py-1 fade-in text-left">
                  <button
                    onClick={() => {
                      setSelectedTag("");
                      setIsTagDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-xs text-left transition-colors hover:bg-slate-50 cursor-pointer flex items-center justify-between ${selectedTag === "" ? "font-bold text-navy bg-slate-50/50" : "text-slate-600"
                      }`}
                  >
                    <span>Todas (Ninguna)</span>
                    {selectedTag === "" && <span className="w-1.5 h-1.5 rounded-full bg-navy" />}
                  </button>

                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        setSelectedTag(tag.id);
                        setIsTagDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-xs text-left transition-colors hover:bg-slate-50 cursor-pointer flex items-center justify-between ${selectedTag === tag.id ? "font-bold text-navy bg-slate-50/50" : "text-slate-600"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: tag.color }} />
                        <span>{tag.name}</span>
                      </div>
                      {selectedTag === tag.id && <span className="w-1.5 h-1.5 rounded-full bg-navy" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grid de Productos */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Cargando prendas del catálogo...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 font-semibold">No se encontraron productos</p>
            <p className="text-xs text-slate-500 mt-1">Prueba seleccionando otros filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                allColors={colors}
                allTags={tags}
                onAddToCart={handleAddToCartClick}
                onOpenSizesTable={setSizeTableProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal de Selección rápida de Talle y Color */}
      <QuickAddModal
        product={quickAddProduct}
        colors={colors}
        onClose={() => setQuickAddProduct(null)}
        onConfirm={handleConfirmQuickAdd}
      />

      {/* Modal de Tabla de Talles */}
      <SizeTableModal
        product={sizeTableProduct}
        onClose={() => setSizeTableProduct(null)}
      />

      {/* Botón Flotante de WhatsApp */}
      <WhatsAppFloatingButton />

      {/* Footer de la página */}
      <Footer categories={categories} onCategorySelect={setSelectedCategory} />

      {/* Carrito de Compras Lateral */}
      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
