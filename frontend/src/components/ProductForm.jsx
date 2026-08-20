import React, { useState, useEffect, useRef } from "react";
import { uploadService } from "../services/api.js";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "38", "40", "42", "44"];

export default function ProductForm({ isOpen, product = null, categories = [], colors = [], tags = [], onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    fabric: "Jersey peinado 20.1",
    print: "Serigrafía",
    details: "",
    stock: "Disponible",
    categoryId: "",
    colors: [],
    sizes: [],
    tags: [],
    image: "",
    images: [],
    measurements: {}
  });

  const [sizeSpecs, setSizeSpecs] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [removedImages, setRemovedImages] = useState([]); // Rastrear fotos eliminadas de Cloudinary
  const [activeTab, setActiveTab] = useState("info"); // "info" | "variants" | "sizes"

  const parseMeasurements = (str) => {
    if (!str) return { width: "", length: "" };
    const widthMatch = str.match(/Ancho:\s*(\d+)/i);
    const lengthMatch = str.match(/Largo:\s*(\d+)/i);
    return {
      width: widthMatch ? widthMatch[1] : "",
      length: lengthMatch ? lengthMatch[1] : ""
    };
  };

  useEffect(() => {
    setActiveTab("info");
    if (product) {
      const initialImages = (product.images && product.images.length > 0 
        ? product.images 
        : [product.image, ...(product.gallery || [])].filter(Boolean)
      ).map(url => ({ url, isLocal: false }));

      setFormData({
        name: product.name || "",
        price: product.price || "",
        fabric: product.fabric || "Jersey peinado 20.1",
        print: product.print || "Serigrafía",
        details: product.details || "",
        stock: product.stock || "Disponible",
        categoryId: product.categoryId || "",
        colors: product.colors || [],
        sizes: product.sizes || [],
        tags: product.tags || [],
        image: product.image || "",
        images: initialImages,
        measurements: product.measurements || {}
      });

      const specs = {};
      if (product.measurements) {
        Object.keys(product.measurements).forEach(size => {
          specs[size] = parseMeasurements(product.measurements[size]);
        });
      }
      setSizeSpecs(specs);
    } else {
      setFormData({
        name: "",
        price: "",
        fabric: "Jersey peinado 20.1",
        print: "Serigrafía",
        details: "",
        stock: "Disponible",
        categoryId: categories[0]?.id || "",
        colors: [],
        sizes: [],
        tags: [],
        image: "",
        images: [],
        measurements: {}
      });
      setSizeSpecs({});
    }
    setRemovedImages([]);
    setError("");
  }, [product, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => {
      const list = prev[name];
      const updatedList = list.includes(value)
        ? list.filter(item => item !== value)
        : [...list, value];
      return { ...prev, [name]: updatedList };
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    const imgObj = formData.images[indexToRemove];
    if (imgObj.isLocal) {
      URL.revokeObjectURL(imgObj.url);
    } else {
      setRemovedImages(prev => [...prev, imgObj.url]);
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setError("");
    try {
      const newImages = files.map(file => {
        const previewUrl = URL.createObjectURL(file);
        return { url: previewUrl, isLocal: true, file };
      });
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (err) {
      setError("Error al procesar las imágenes locales.");
    }
  };

  const handleClose = () => {
    formData.images.forEach(img => {
      if (img.isLocal) {
        URL.revokeObjectURL(img.url);
      }
    });
    setRemovedImages([]);
    onClose();
  };

  const handleSpecChange = (size, key, value) => {
    setSizeSpecs(prev => {
      const updated = {
        ...prev,
        [size]: {
          ...(prev[size] || { width: "", length: "" }),
          [key]: value
        }
      };

      const widthVal = updated[size].width ? `${updated[size].width}cm` : "";
      const lengthVal = updated[size].length ? `${updated[size].length}cm` : "";

      let strVal = "";
      if (widthVal && lengthVal) {
        strVal = `Ancho: ${widthVal}, Largo: ${lengthVal}`;
      } else if (widthVal) {
        strVal = `Ancho: ${widthVal}`;
      } else if (lengthVal) {
        strVal = `Largo: ${lengthVal}`;
      }

      setFormData(f => ({
        ...f,
        measurements: {
          ...f.measurements,
          [size]: strVal
        }
      }));

      return updated;
    });
  };

  // Checks if there are any changes compared to original product
  const hasChanges = () => {
    if (!product) return true; // New product is always considered as having changes

    if (formData.name !== (product.name || "")) return true;
    if (Number(formData.price) !== Number(product.price || 0)) return true;
    if (formData.fabric !== (product.fabric || "Jersey peinado 20.1")) return true;
    if (formData.print !== (product.print || "Serigrafía")) return true;
    if (formData.details !== (product.details || "")) return true;
    if (formData.stock !== (product.stock || "Disponible")) return true;
    if (formData.categoryId !== (product.categoryId || "")) return true;

    // Compare arrays
    const formColors = [...formData.colors].sort().join(",");
    const prodColors = [...(product.colors || [])].sort().join(",");
    if (formColors !== prodColors) return true;

    const formSizes = [...formData.sizes].sort().join(",");
    const prodSizes = [...(product.sizes || [])].sort().join(",");
    if (formSizes !== prodSizes) return true;

    const formTags = [...formData.tags].sort().join(",");
    const prodTags = [...(product.tags || [])].sort().join(",");
    if (formTags !== prodTags) return true;

    const formImages = formData.images.map(img => img.url).sort().join(",");
    const prodImagesArray = product.images && product.images.length > 0 
      ? product.images 
      : [product.image, ...(product.gallery || [])].filter(Boolean);
    const prodImages = [...prodImagesArray].sort().join(",");
    if (formImages !== prodImages) return true;

    // Compare measurements
    const formMeas = JSON.stringify(formData.measurements);
    const prodMeas = JSON.stringify(product.measurements || {});
    if (formMeas !== prodMeas) return true;

    return false;
  };

  const areSizesSpecsValid = formData.sizes.every(size => {
    const specs = sizeSpecs[size];
    if (!specs) return false;
    const w = String(specs.width).trim();
    const l = String(specs.length).trim();
    return w !== "" && l !== "";
  });

  const isFormValid = formData.name.trim() && 
                      formData.price && Number(formData.price) > 0 && 
                      formData.images.length > 0 && 
                      formData.sizes.length > 0 && 
                      formData.categoryId &&
                      areSizesSpecsValid;

  const canSave = isFormValid && hasChanges() && !uploading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    setUploading(true);
    setError("");
    try {
      // 1. Subir imágenes locales de forma diferida a Cloudinary
      const finalImageUrls = [];
      for (const imgObj of formData.images) {
        if (imgObj.isLocal) {
          const result = await uploadService.uploadImage(imgObj.file);
          finalImageUrls.push(result.url);
        } else {
          finalImageUrls.push(imgObj.url);
        }
      }

      // 2. Borrar imágenes eliminadas de Cloudinary
      for (const imgUrl of removedImages) {
        try {
          await uploadService.deleteImage(imgUrl);
        } catch (delErr) {
          console.error("Error al borrar imagen en Cloudinary:", delErr);
        }
      }

      // 3. Limpiar estado y revocar blobs locales
      setRemovedImages([]);
      formData.images.forEach(img => {
        if (img.isLocal) {
          URL.revokeObjectURL(img.url);
        }
      });

      // 4. Disparar el guardado del producto
      const { images, ...rest } = formData;
      onSave({
        ...rest,
        image: finalImageUrls[0], // Primera imagen como imagen principal
        gallery: finalImageUrls.slice(1), // Las imágenes restantes como galería
        price: Number(formData.price)
      });
    } catch (err) {
      setError("Error al subir las imágenes o al guardar el producto.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Container */}
      <div className="flex min-h-screen items-start justify-center p-4 pt-10 md:pt-20">
        <div className="relative w-full max-w-3xl bg-[#131926] rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl z-10 fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-100">
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h3>
            <button type="button" onClick={handleClose} className="text-slate-400 hover:text-slate-100 transition-colors cursor-pointer bg-transparent border-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm mb-5">
              ⚠️ {error}
            </div>
          )}

          {/* Tabs Selector */}
          <div className="flex border-b border-white/10 mb-6 gap-2 select-none overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "info"
                  ? "border-[#CDD8E8] text-[#CDD8E8]"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              1. Información Básica
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("variants")}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "variants"
                  ? "border-[#CDD8E8] text-[#CDD8E8]"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              2. Variantes y Fotos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sizes")}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "sizes"
                  ? "border-[#CDD8E8] text-[#CDD8E8]"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              3. Medidas por Talle
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="h-[430px] md:h-[510px] overflow-y-auto pr-1">
              {/* Tab 1: Información Básica */}
            {activeTab === "info" && (
              <div className="space-y-4 fade-in">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre del Producto</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/10" placeholder="Ej: Buzo Oversized Zafiro" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Precio ($ ARS)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field focus:border-[#CDD8E8]" placeholder="38000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Stock</label>
                    <select name="stock" value={formData.stock} onChange={handleChange} className="input-field focus:border-[#CDD8E8]">
                      <option value="Disponible">Disponible</option>
                      <option value="Sin Stock">Sin Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Material/Tela</label>
                    <input type="text" name="fabric" value={formData.fabric} onChange={handleChange} className="input-field focus:border-[#CDD8E8]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tipo Estampa</label>
                    <input type="text" name="print" value={formData.print} onChange={handleChange} className="input-field focus:border-[#CDD8E8]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Categoría</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input-field focus:border-[#CDD8E8]">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Descripción / Detalles</label>
                  <textarea name="details" value={formData.details} onChange={handleChange} rows={4} className="input-field resize-none focus:border-[#CDD8E8]" placeholder="Especificaciones adicionales..." />
                </div>
              </div>
            )}

            {/* Tab 2: Variantes y Fotos */}
            {activeTab === "variants" && (
              <div className="space-y-5 fade-in">
                {/* Carga de Varias Imágenes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Imágenes del Producto (Subir desde tu celular o computadora)
                  </label>
                  <div className="flex flex-col gap-2.5">
                    <label className="w-full flex flex-col items-center justify-center bg-[#182032] hover:bg-[#1f293e] border border-dashed border-white/20 hover:border-[#CDD8E8]/50 rounded-2xl p-6 cursor-pointer transition-all group">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400 group-hover:text-[#CDD8E8] transition-colors mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                        {uploading ? "Subiendo archivo..." : "Seleccionar Imagen"}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">Desde tu celular o computadora</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                  
                  {/* Grid de miniaturas */}
                  {formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2.5 p-3 bg-slate-950/40 rounded-xl border border-white/5 max-h-40 overflow-y-auto font-sans">
                      {formData.images.map((imgObj, idx) => (
                        <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 group bg-slate-900">
                          <img src={imgObj.url} alt={`Vista ${idx}`} className="w-full h-full object-cover" />
                          
                          {/* Badge de Principal en la primera foto */}
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-green-500 text-white text-[8px] uppercase font-black px-1 py-0.2 rounded shadow-md z-10 select-none">
                              Portada
                            </span>
                          )}

                          {/* Botón de eliminar */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity border-0"
                            title="Eliminar imagen"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Colores */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Colores del Producto</label>
                  <div className="flex flex-wrap gap-2.5 p-3 bg-slate-950/40 rounded-xl border border-white/5 max-h-32 overflow-y-auto">
                    {colors.map(color => {
                      const isChecked = formData.colors.includes(color.id);
                      return (
                        <label key={color.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs cursor-pointer select-none transition-all ${
                          isChecked ? "border-[#CDD8E8]/50 bg-[#CDD8E8]/10 text-slate-200" : "border-slate-800 bg-slate-950/20 text-slate-400"
                        }`}>
                          <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange("colors", color.id)} className="hidden" />
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: color.hexCode }} />
                          {color.name}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Talles */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Talles Disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SIZES.map(size => {
                      const isChecked = formData.sizes.includes(size);
                      return (
                        <label key={size} className={`w-10 h-10 rounded-lg border font-mono flex items-center justify-center text-xs cursor-pointer select-none transition-all ${
                          isChecked ? "border-[#CDD8E8] bg-[#CDD8E8] text-[#0d1222] font-black" : "border-slate-800 bg-slate-950/30 text-slate-400"
                        }`}>
                          <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange("sizes", size)} className="hidden" />
                          {size}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Etiquetas */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Etiquetas (Tags)</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => {
                      const isChecked = formData.tags.includes(tag.id);
                      return (
                        <label key={tag.id} className={`px-3 py-1 rounded-full border text-xs cursor-pointer select-none transition-all ${
                          isChecked ? "text-white" : "border-slate-800 bg-slate-950/30 text-slate-400"
                        }`} style={isChecked ? { backgroundColor: tag.color, borderColor: tag.color } : {}}>
                          <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange("tags", tag.id)} className="hidden" />
                          {tag.name}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Medidas por Talle */}
            {activeTab === "sizes" && (
              <div className="space-y-4 fade-in text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Medidas de Talle (Ingresar valores numéricos en cm)
                </label>
                {formData.sizes.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 italic bg-slate-950/30 border border-dashed border-white/5 rounded-xl">
                    Por favor, selecciona primero los talles disponibles en la pestaña "2. Variantes y Fotos".
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.sizes.map(size => {
                      const specs = sizeSpecs[size] || { width: "", length: "" };
                      return (
                        <div key={size} className="p-3 bg-[#182032]/30 border border-white/5 rounded-xl space-y-2">
                          <div className="font-mono text-xs font-extrabold text-[#CDD8E8] border-b border-white/5 pb-1">
                            Talle {size}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Ancho (cm)</label>
                              <input
                                type="number"
                                value={specs.width}
                                onChange={(e) => handleSpecChange(size, "width", e.target.value)}
                                className="w-full bg-[#182032] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/10 font-mono transition-colors"
                                placeholder="Ej: 58"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Largo (cm)</label>
                              <input
                                type="number"
                                value={specs.length}
                                onChange={(e) => handleSpecChange(size, "length", e.target.value)}
                                className="w-full bg-[#182032] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CDD8E8] focus:ring-1 focus:ring-[#CDD8E8]/10 font-mono transition-colors"
                                placeholder="Ej: 70"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            </div>

            {/* Footer de Acciones */}
            <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={handleClose}
                className="bg-[#182032] border border-white/15 text-slate-200 hover:text-white hover:bg-[#1f293e] hover:border-white/30 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!canSave}
                className={`px-7 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg border-0 ${
                  canSave 
                    ? "bg-[#CDD8E8] text-[#0d1222] hover:bg-[#b9c9df] hover:scale-[1.02] active:scale-95 shadow-[#CDD8E8]/10 cursor-pointer"
                    : "bg-slate-800 text-slate-500 shadow-none cursor-not-allowed opacity-50"
                }`}
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
