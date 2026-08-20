import React, { useState, useEffect, useRef } from "react";
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

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 12;

  // Modal de Selección rápida de Talle y Color
  const [quickAddProduct, setQuickAddProduct] = useState(null);


  // Modal de Tabla de Talles
  const [sizeTableProduct, setSizeTableProduct] = useState(null);

  const scrollContainerRef = useRef(null);
  const [showRightGradient, setShowRightGradient] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const canScrollRight = el.scrollWidth > el.clientWidth && el.scrollLeft + el.clientWidth < el.scrollWidth - 10;
    setShowRightGradient(canScrollRight);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  useEffect(() => {
    analyticsService.trackSession();
  }, []);

  // Carga de metadatos estáticos (Categorías, Etiquetas, Colores, Anuncios) solo al montar
  useEffect(() => {
    const fetchMetadata = async () => {
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
      } catch (err) {
        console.error("Error al cargar metadatos del catálogo:", err);
      }
    };
    fetchMetadata();
  }, []);

  // Carga inicial de productos cuando cambian los filtros
  useEffect(() => {
    let active = true;

    const fetchInitialProducts = async () => {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      try {
        const prodsRes = await productService.getAll({
          categoryId: selectedCategory,
          tagId: selectedTag,
          page: 1,
          limit: LIMIT
        });

        if (!active) return;

        // Ordenar productos: disponibles primero, sin stock al final
        const sortedProds = [...prodsRes].sort((a, b) => {
          const aOut = a.stock === "Sin Stock";
          const bOut = b.stock === "Sin Stock";
          if (aOut && !bOut) return 1;
          if (!aOut && bOut) return -1;
          return 0;
        });

        setProducts(sortedProds);
        setHasMore(prodsRes.length === LIMIT);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchInitialProducts();

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedTag]);

  // Carga de la siguiente página de productos al hacer clic en "Cargar más"
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const prodsRes = await productService.getAll({
        categoryId: selectedCategory,
        tagId: selectedTag,
        page: nextPage,
        limit: LIMIT
      });

      // Ordenar productos: disponibles primero, sin stock al final
      const sortedProds = [...prodsRes].sort((a, b) => {
        const aOut = a.stock === "Sin Stock";
        const bOut = b.stock === "Sin Stock";
        if (aOut && !bOut) return 1;
        if (!aOut && bOut) return -1;
        return 0;
      });

      setProducts(prev => {
        // Evitar duplicación por seguridad
        const existingIds = new Set(prev.map(p => p.id));
        const filteredNew = sortedProds.filter(p => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });

      setPage(nextPage);
      setHasMore(prodsRes.length === LIMIT);
    } catch (err) {
      console.error("Error al cargar más productos:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddToCartClick = (product) => {
    setQuickAddProduct(product);
  };

  const handleConfirmQuickAdd = (product, size, color, quantity) => {
    analyticsService.trackAddToCart(product.id, color.id, size, quantity);
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
      <section id="productos" className="max-w-[1220px] mx-auto w-full px-3 md:px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div className="text-left">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold mb-1">COLECCIÓN</p>
            <h2 className="text-3xl font-extrabold text-navy">Productos</h2>
          </div>
        </div>

        {/* Barra de Filtros (Categorías a la izquierda, Menú desplegable a la derecha) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 mb-8 text-slate-800">
          {/* Categorías (Izquierda) */}
          <div className="relative flex-grow overflow-hidden w-full md:w-auto">
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
            >
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
            {showRightGradient && (
              <div className="absolute right-0 top-0 bottom-2 w-14 bg-gradient-to-l from-[#f4f6fa] to-transparent pointer-events-none md:hidden transition-opacity duration-300 z-10" />
            )}
          </div>

          {/* Menú desplegable Filtrar por Etiqueta (Derecha) */}
          <div className="relative shrink-0 select-none w-full md:w-auto">
            <button
              onClick={() => setIsTagDropdownOpen(prev => !prev)}
              className="w-full md:w-auto px-4.5 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-navy hover:border-slate-400 transition-all flex items-center justify-between gap-2 cursor-pointer"
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
                <div className="absolute left-0 right-0 md:left-auto md:right-0 mt-2 md:w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 overflow-hidden py-1 fade-in text-left">
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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

        {/* Botón Cargar más */}
        {hasMore && products.length > 0 && (
          <div className="flex justify-center mt-12 mb-4">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className={`px-8 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2.5 ${
                loadingMore
                  ? "bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "btn-navy border border-navy"
              }`}
            >
              {loadingMore ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Cargando...</span>
                </>
              ) : (
                <span>Cargar más productos</span>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Modal de Selección rápida de Talle y Color */}
      <QuickAddModal
        product={quickAddProduct}
        colors={colors}
        tags={tags}
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
