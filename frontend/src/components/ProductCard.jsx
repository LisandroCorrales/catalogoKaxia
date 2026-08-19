import React, { useState } from "react";

export default function ProductCard({ product, allColors = [], allTags = [], onAddToCart, onOpenSizesTable }) {
  // Obtener colores del producto
  const productColors = allColors.filter(c => product.colors.includes(c.id));

  // Obtener etiquetas (tags) del producto
  const productTags = allTags.filter(t => product.tags && product.tags.includes(t.id));

  // Obtener array de fotos de la simulación del backend
  const productImages = [product.image, ...(product.gallery || [])];

  // Estado local para la imagen activa de la tarjeta
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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

    if (isLeftSwipe) {
      // Siguiente imagen
      setCurrentImgIndex((prev) => (prev + 1) % productImages.length);
    }
    if (isRightSwipe) {
      // Imagen anterior
      setCurrentImgIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const isOutOfStock = product.stock === "Sin Stock";

  return (
    <div className={`bg-white rounded-[24px] border border-slate-200/80 flex flex-col shadow-xs group text-slate-800 transition-all ${isOutOfStock ? "opacity-60" : ""}`}>
      {/* Imagen del Producto (Carrusel e indicadores al ras del borde superior) */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 select-none rounded-t-[23px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Contenedor deslizable flex */}
        <div 
          className="flex w-full h-full"
          style={{
            transform: `translateX(-${currentImgIndex * 100}%)`,
            transitionProperty: "transform",
            transitionDuration: "250ms",
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          }}
        >
          {productImages.map((imgUrl, idx) => (
            <div key={idx} className="w-full h-full shrink-0">
              <img
                src={imgUrl}
                alt={`${product.name} - ${idx}`}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Marca Badge */}
        <span className="absolute top-3 left-3 bg-navy/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider select-none z-10">
          KAXIA
        </span>

        {/* Sin Stock Badge */}
        {isOutOfStock && (
          <span className="absolute top-3 right-3 bg-red-700 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider select-none z-10 shadow-sm">
            SIN STOCK
          </span>
        )}

        {/* Indicadores de Páginas (Puntitos en móviles y compus) */}
        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 select-none">
            {productImages.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentImgIndex === idx ? "bg-white scale-110 w-3.5" : "bg-white/40"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Flechas pequeñas para pantallas grandes (Desktop) */}
        {productImages.length > 1 && (
          <>
            {/* Flecha Izquierda */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImgIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-navy rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hidden md:flex z-10 border-0"
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
                setCurrentImgIndex((prev) => (prev + 1) % productImages.length);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-navy rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hidden md:flex z-10 border-0"
              title="Siguiente imagen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Contenido (Padding adaptativo) */}
      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
        {/* Etiquetas (Tags) del producto */}
        {productTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 select-none">
            {productTags.map(tag => (
              <span
                key={tag.id}
                className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Nombre y Precio */}
        <div className="flex justify-between items-start mb-2.5">
          <h3 className="font-bold text-sm md:text-[16px] text-navy leading-tight text-left">{product.name}</h3>
          <span className="font-extrabold text-sm md:text-[15px] text-navy shrink-0 ml-1">${product.price.toLocaleString("es-AR")}</span>
        </div>

        {/* Detalles Técnicos */}
        <div className="text-left space-y-1 text-[11px] text-slate-500 mb-2.5">
          <p>Tela: <span className="text-slate-700 font-medium">{product.fabric}</span></p>
          <p>Estampado: <span className="text-slate-700 font-medium">{product.print}</span></p>
          <p>Talles: <span className="text-slate-700 font-medium">{product.sizes.join(" - ")}</span></p>
        </div>

        {/* Círculos de Colores */}
        {productColors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3.5 select-none">
            {productColors.map(color => (
              <span
                key={color.id}
                className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-xs relative group/color cursor-help"
                style={{ backgroundColor: color.hexCode }}
              >
                {/* Tooltip con nombre de color en Hover */}
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 pointer-events-none shadow-sm z-20">
                  {color.name}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-1.5 pt-1 w-full">
          <button
            onClick={() => onOpenSizesTable(product)}
            className="w-full sm:flex-1 btn-outline-navy py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer text-center"
            title="Ver Tabla de Talles"
          >
            VER TALLES
          </button>
          {isOutOfStock ? (
            <button
              disabled
              className="w-full sm:flex-1 bg-slate-200 text-slate-400 py-2.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider cursor-not-allowed text-center border-0"
              title="Producto sin stock disponible"
            >
              SIN STOCK
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full sm:flex-1 btn-navy py-2.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider cursor-pointer text-center"
              title="Añadir al carrito"
            >
              AGREGAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
