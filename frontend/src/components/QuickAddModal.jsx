import React, { useState, useEffect } from "react";
import { analyticsService } from "../services/api.js";

export default function QuickAddModal({ product, colors = [], onClose, onConfirm }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Lógica de deslizado táctil (Swipe) para móviles
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const productImages = product.images && product.images.length > 0 ? product.images : [product.image, ...(product.gallery || [])].filter(Boolean);

    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
    }
    if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      const prodColors = colors.filter(c => product.colors.includes(c.id));
      setSelectedColor(prodColors[0] || null);
      setSelectedQuantity(1);
      setActiveImageIndex(0);
      analyticsService.trackView(product.id);
    }
  }, [product, colors]);

  if (!product) return null;

  // Obtener imágenes del producto
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image, ...(product.gallery || [])].filter(Boolean);
  const availableColors = colors.filter(c => product.colors.includes(c.id));

  const handleAddClick = () => {
    if (!selectedSize || !selectedColor) return;
    onConfirm(product, selectedSize, selectedColor, selectedQuantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[640px] bg-white border border-slate-200 rounded-2xl z-10 fade-in text-left shadow-xl overflow-hidden flex flex-col sm:flex-row text-slate-800">

        {/* Panel de Imagen (Izquierda en desktop al ras, Arriba en móvil al ras) */}
        <div className="w-full sm:w-[260px] relative shrink-0 min-h-[320px] sm:min-h-0 sm:self-stretch overflow-hidden select-none">
          {/* Imagen Principal */}
          <div
            className="absolute inset-0 w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={productImages[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradiente inferior para legibilidad de los puntitos */}
          {productImages.length > 1 && (
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
          )}

          {/* Marca Badge */}
          <span className="absolute top-3 left-3 bg-navy/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider z-10">
            KAXIA
          </span>

          {/* Indicadores de Páginas (Puntitos) */}
          {productImages.length > 1 && (
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 select-none">
              {productImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${activeImageIndex === idx ? "bg-white scale-110 w-3.5" : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          )}

          {/* Flechas de navegación para desktop (en hover/visibles) */}
          {productImages.length > 1 && (
            <>
              {/* Flecha Izquierda */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-navy rounded-full flex items-center justify-center shadow-md cursor-pointer border-0 z-10"
                title="Imagen anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Flecha Derecha */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev + 1) % productImages.length);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-navy rounded-full flex items-center justify-center shadow-md cursor-pointer border-0 z-10"
                title="Siguiente imagen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Contenido y Opciones */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-[17px] font-black text-navy leading-tight mb-0.5">{product.name}</h3>
            <p className="text-[11px] text-slate-400 mb-3.5">{product.fabric}</p>

            {/* Talles */}
            <div className="mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Talle</label>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-9 h-9 rounded-lg border font-mono flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${selectedSize === size
                        ? "border-navy bg-navy text-white font-extrabold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="mb-4.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Color</label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map(color => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${selectedColor?.id === color.id
                        ? "border-navy bg-slate-50 text-navy font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                      }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cantidad</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700 cursor-pointer select-none"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSelectedQuantity(isNaN(val) || val <= 0 ? 1 : val);
                  }}
                  className="w-12 h-8 text-center font-mono font-bold text-slate-800 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-navy [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setSelectedQuantity(q => q + 1)}
                  className="w-8 h-8 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700 cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción footer */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline-navy px-4 py-2 text-xs font-bold rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAddClick}
              className="btn-navy px-4.5 py-2 text-xs font-bold rounded-lg cursor-pointer"
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
