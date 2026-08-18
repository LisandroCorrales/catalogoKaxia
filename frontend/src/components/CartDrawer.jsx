import React from "react";

export default function CartDrawer({ isOpen, cartItems = [], onClose, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "5491137639321";

    let message = "👕 ¡Hola KAXIA! Me gustaría realizar un pedido con las siguientes prendas:\n\n";

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Talle: ${item.size}\n`;
      message += `   • Color: ${item.color.name} (${item.color.hexCode})\n`;
      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Subtotal: $${(item.product.price * item.quantity).toLocaleString("es-AR")}\n\n`;
    });

    message += `💰 *Total del pedido: $${total.toLocaleString("es-AR")}*\n\n`;
    message += "Quedo a la espera para coordinar el pago y el envío. ¡Muchas gracias!";

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-800">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl fade-in">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="font-bold text-lg text-navy flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
                className="w-5.5 h-5.5 text-navy"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              Tu Carrito
            </h2>
            <div className="flex items-center gap-4">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-red-550 hover:text-red-700 text-xs font-semibold select-none cursor-pointer flex items-center gap-1.5 transition-colors border-0 bg-transparent p-1"
                  title="Vaciar todo el carrito"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Vaciar
                </button>
              )}

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-750 transition-colors cursor-pointer border-0 bg-transparent p-1 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-white">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-slate-300 mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <p className="text-slate-500 font-bold">El carrito está vacío</p>
                <p className="text-xs text-slate-400 mt-1">Explora nuestros productos y añade tus favoritos.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color.id}`}
                  className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded-lg bg-slate-200 border border-slate-100"
                  />
                  {/* Info */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Talle: <span className="font-mono text-slate-700 font-bold">{item.size}</span> | Color:{" "}
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block align-middle border border-slate-300"
                          style={{ backgroundColor: item.color.hexCode }}
                          title={item.color.name}
                        />
                      </p>
                    </div>
                    {/* Price and quantity selector */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-col text-left">
                        <span className="text-navy font-extrabold text-sm">
                          ${item.product.price.toLocaleString("es-AR")}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            Subtotal: ${(item.product.price * item.quantity).toLocaleString("es-AR")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center border border-slate-200 rounded-full bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-500 hover:text-navy hover:bg-slate-50 transition-all text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 font-mono text-xs text-slate-800 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-500 hover:text-navy hover:bg-slate-50 transition-all text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => onRemoveItem(item)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer self-start"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4.5 h-4.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total</span>
                <span className="text-navy font-black text-2xl">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>

              {/* Nota Informativa sobre WhatsApp y Stock */}
              <div className="bg-slate-100/80 border border-slate-200/50 rounded-xl p-3 flex gap-2.5 items-start text-left select-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 111.063.854l-.041.02a.75.75 0 11-1.063-.854zm0 3l.041-.02a.75.75 0 111.063.854l-.041.02a.75.75 0 11-1.063-.854zM12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-[11px] text-slate-500 leading-normal">
                  <strong className="text-slate-700 font-bold">Coordinación de Stock:</strong> El pedido se confirma definitivamente a través de WhatsApp, sujeto a la disponibilidad de stock al momento del contacto.
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-navy py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md cursor-pointer uppercase tracking-wider"
              >
                Confirmar por WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
