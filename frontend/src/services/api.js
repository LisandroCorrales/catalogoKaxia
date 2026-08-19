// Simulación de Cliente API para el Frontend de Kaxia
// Utiliza localStorage para simular persistencia y setTimeout para simular retardo de red

const LATENCY = 400; // ms de retardo simulado

// Datos Semilla Iniciales
const INITIAL_CATEGORIES = [
  { id: "cat_1", name: "Buzos", slug: "buzos", description: "Buzos de jersey peinado y friza premium" },
  { id: "cat_2", name: "Remeras", slug: "remeras", description: "Remeras manga corta y boxy fit" },
  { id: "cat_3", name: "Pantalones", slug: "pantalones", description: "Pantalones cargo, joggers y bermudas" },
  { id: "cat_4", name: "Accesorios", slug: "accesorios", description: "Medias, gorras y complementos" }
];

const INITIAL_TAGS = [
  { id: "tag_1", name: "Nuevo", slug: "nuevo", color: "#22C55E" },
  { id: "tag_2", name: "Hot Sale", slug: "hot-sale", color: "#EF4444" },
  { id: "tag_3", name: "Destacado", slug: "destacado", color: "#3B82F6" }
];

const INITIAL_COLORS = [
  { id: "col_1", name: "Negro", hexCode: "#000000" },
  { id: "col_2", name: "Blanco Crudo", hexCode: "#F5F5DC" },
  { id: "col_3", name: "Azul Zafiro", hexCode: "#0F4C81" },
  { id: "col_4", name: "Gris Melange", hexCode: "#8F8F8F" },
  { id: "col_5", name: "Verde Militar", hexCode: "#4B5320" }
];

const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    name: "Buzo Oversized Zafiro",
    price: 38000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80"
    ],
    fabric: "Friza de algodón premium",
    colors: ["col_3", "col_1"], // referencias a ID de colores
    sizes: ["M", "L", "XL"],
    print: "Bordado central tono sobre tono",
    details: "Corte oversized real con capucha doble y cordones con terminales metálicas.",
    stock: "Disponible",
    measurements: {
      "M": "Ancho: 58cm, Largo: 70cm",
      "L": "Ancho: 61cm, Largo: 72cm",
      "XL": "Ancho: 64cm, Largo: 74cm"
    },
    categoryId: "cat_1",
    tags: ["tag_3", "tag_1"]
  },
  {
    id: "prod_2",
    name: "Remera Boxy Fit Off-White",
    price: 18000,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80"
    ],
    fabric: "Jersey de algodón peinado 20/1 pesado",
    colors: ["col_2", "col_4"],
    sizes: ["S", "M", "L"],
    print: "Serigrafía al agua en la espalda",
    details: "Remera de hombros caídos y cuello rib grueso.",
    stock: "Disponible",
    measurements: {
      "S": "Ancho: 54cm, Largo: 66cm",
      "M": "Ancho: 57cm, Largo: 68cm",
      "L": "Ancho: 60cm, Largo: 70cm"
    },
    categoryId: "cat_2",
    tags: ["tag_1"]
  },
  {
    id: "prod_3",
    name: "Pantalón Cargo Black",
    price: 42000,
    image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80"
    ],
    fabric: "Gabardina esmerilada de 8 oz",
    colors: ["col_1", "col_5"],
    sizes: ["M", "L"],
    print: "Sin estampa",
    details: "Pantalón cargo multibolsillos con cordón de ajuste en botamanga.",
    stock: "Sin Stock",
    measurements: {
      "M": "Cintura: 40cm, Largo: 104cm",
      "L": "Cintura: 42cm, Largo: 106cm"
    },
    categoryId: "cat_3",
    tags: ["tag_2"]
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "log_1",
    userId: "user_1",
    username: "admin",
    action: "CREATE",
    entityType: "Product",
    entityId: "prod_1",
    details: { name: "Buzo Oversized Zafiro", price: 38000 },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "log_2",
    userId: "user_1",
    username: "admin",
    action: "UPDATE",
    entityType: "Product",
    entityId: "prod_1",
    details: {
      price: { previous: 35000, current: 38000 }
    },
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

// Funciones de inicialización y utilitarias de LocalStorage
const getStorageItem = (key, defaultValue) => {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(val);
};

const setStorageItem = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Cargar estado inicial en LocalStorage
let categories = getStorageItem("kaxia_categories", INITIAL_CATEGORIES);
let tags = getStorageItem("kaxia_tags", INITIAL_TAGS);
let colors = getStorageItem("kaxia_colors", INITIAL_COLORS);
let products = getStorageItem("kaxia_products", INITIAL_PRODUCTS);

// Migración: Sincronizar las galerías de INITIAL_PRODUCTS con el localStorage actual
let isModified = false;
products = products.map(prod => {
  const seedProd = INITIAL_PRODUCTS.find(ip => ip.id === prod.id);
  if (seedProd && (!prod.gallery || prod.gallery.length === 0) && seedProd.gallery && seedProd.gallery.length > 0) {
    prod.gallery = seedProd.gallery;
    isModified = true;
  }
  // Poblar imágenes desde seed si el producto del localStorage no tiene el arreglo
  if (seedProd && (!prod.images || prod.images.length === 0)) {
    prod.images = [seedProd.image, ...(seedProd.gallery || [])].filter(Boolean);
    isModified = true;
  }
  // Forzar que el Pantalón Cargo Black venga sin stock en los datos iniciales para la demostración
  if (prod.id === "prod_3" && prod.stock !== "Sin Stock") {
    prod.stock = "Sin Stock";
    isModified = true;
  }
  return prod;
});
if (isModified) {
  setStorageItem("kaxia_products", products);
}

let logs = getStorageItem("kaxia_audit_logs", INITIAL_AUDIT_LOGS);
let currentUser = getStorageItem("kaxia_current_user", null);

// Simulación de retraso asíncrono
const delay = (val) => new Promise((resolve) => setTimeout(() => resolve(val), LATENCY));

// Logger de auditoría simulado
const writeAuditLog = (action, entityType, entityId, details) => {
  if (!currentUser) return;
  const newLog = {
    id: "log_" + Date.now(),
    userId: currentUser.id,
    username: currentUser.username,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date().toISOString()
  };
  logs = [newLog, ...logs];
  setStorageItem("kaxia_audit_logs", logs);
};

// USUARIOS Y SEGURIDAD
const INITIAL_USERS = [
  { id: "user_1", username: "admin", role: "Admin", passwordHash: "adminpassword123" },
  { id: "user_2", username: "vendedor", role: "Vendedor", passwordHash: "vendedor123" }
];

let users = getStorageItem("kaxia_users", INITIAL_USERS);

// API EXPORTS
export const authService = {
  login: async (username, password) => {
    await delay();
    const cleanUsername = username.trim().toLowerCase();
    const found = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.passwordHash === password
    );
    if (!found) {
      throw new Error("Credenciales inválidas. Revise usuario y contraseña.");
    }
    const user = { id: found.id, username: found.username, role: found.role };
    currentUser = user;
    setStorageItem("kaxia_current_user", user);
    return user;
  },
  logout: async () => {
    await delay();
    currentUser = null;
    localStorage.removeItem("kaxia_current_user");
    return true;
  },
  getCurrentUser: () => {
    return currentUser;
  }
};

export const userService = {
  getAll: async () => {
    await delay();
    users = getStorageItem("kaxia_users", INITIAL_USERS);
    return users;
  },
  create: async (data) => {
    await delay();
    const cleanUsername = data.username.trim();
    const exists = users.some(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (exists) {
      throw new Error("El nombre de usuario ya está registrado.");
    }
    const newUser = {
      id: "user_" + Date.now(),
      username: cleanUsername,
      role: data.role,
      passwordHash: data.password || "123456"
    };
    users.push(newUser);
    setStorageItem("kaxia_users", users);
    writeAuditLog("CREATE", "User", newUser.id, { username: newUser.username, role: newUser.role });
    return newUser;
  },
  updatePassword: async (id, newPassword) => {
    await delay();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Usuario no encontrado.");
    const old = users[idx];
    users[idx].passwordHash = newPassword;
    setStorageItem("kaxia_users", users);
    writeAuditLog("UPDATE", "UserPassword", id, { username: old.username });
    return true;
  },
  delete: async (id) => {
    await delay();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Usuario no encontrado.");
    const old = users[idx];

    // Evitar autoborrado de sesión activa
    if (currentUser && currentUser.id === id) {
      throw new Error("No puedes eliminar a tu propio usuario activo.");
    }

    users = users.filter((u) => u.id !== id);
    setStorageItem("kaxia_users", users);
    writeAuditLog("DELETE", "User", id, { username: old.username });
    return true;
  }
};

export const categoryService = {
  getAll: async () => {
    await delay();
    categories = getStorageItem("kaxia_categories", INITIAL_CATEGORIES);
    return categories;
  },
  create: async (data) => {
    await delay();
    const newCat = { ...data, id: "cat_" + Date.now() };
    categories.push(newCat);
    setStorageItem("kaxia_categories", categories);
    writeAuditLog("CREATE", "Category", newCat.id, { name: newCat.name });
    return newCat;
  },
  update: async (id, data) => {
    await delay();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Categoría no encontrada.");
    const old = categories[idx];
    categories[idx] = { ...old, ...data, id };
    setStorageItem("kaxia_categories", categories);

    // Generar diff
    const diff = {};
    for (const key of Object.keys(data)) {
      if (data[key] !== old[key]) {
        diff[key] = { previous: old[key], current: data[key] };
      }
    }
    writeAuditLog("UPDATE", "Category", id, diff);
    return categories[idx];
  },
  delete: async (id) => {
    await delay();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Categoría no encontrada.");
    const old = categories[idx];
    categories = categories.filter((c) => c.id !== id);
    setStorageItem("kaxia_categories", categories);
    writeAuditLog("DELETE", "Category", id, { name: old.name });
    return true;
  }
};

export const tagService = {
  getAll: async () => {
    await delay();
    tags = getStorageItem("kaxia_tags", INITIAL_TAGS);
    return tags;
  },
  create: async (data) => {
    await delay();
    const newTag = { ...data, id: "tag_" + Date.now() };
    tags.push(newTag);
    setStorageItem("kaxia_tags", tags);
    writeAuditLog("CREATE", "Tag", newTag.id, { name: newTag.name });
    return newTag;
  },
  update: async (id, data) => {
    await delay();
    const idx = tags.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Etiqueta no encontrada.");
    const old = tags[idx];
    tags[idx] = { ...old, ...data, id };
    setStorageItem("kaxia_tags", tags);

    const diff = {};
    for (const key of Object.keys(data)) {
      if (data[key] !== old[key]) {
        diff[key] = { previous: old[key], current: data[key] };
      }
    }
    writeAuditLog("UPDATE", "Tag", id, diff);
    return tags[idx];
  },
  delete: async (id) => {
    await delay();
    const idx = tags.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Etiqueta no encontrada.");
    const old = tags[idx];
    tags = tags.filter((t) => t.id !== id);
    setStorageItem("kaxia_tags", tags);
    writeAuditLog("DELETE", "Tag", id, { name: old.name });
    return true;
  }
};

export const colorService = {
  getAll: async () => {
    await delay();
    colors = getStorageItem("kaxia_colors", INITIAL_COLORS);
    return colors;
  },
  create: async (data) => {
    await delay();
    const newCol = { ...data, id: "col_" + Date.now() };
    colors.push(newCol);
    setStorageItem("kaxia_colors", colors);
    writeAuditLog("CREATE", "Color", newCol.id, { name: newCol.name, hexCode: newCol.hexCode });
    return newCol;
  },
  update: async (id, data) => {
    await delay();
    const idx = colors.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Color no encontrado.");
    const old = colors[idx];
    colors[idx] = { ...old, ...data, id };
    setStorageItem("kaxia_colors", colors);

    const diff = {};
    for (const key of Object.keys(data)) {
      if (data[key] !== old[key]) {
        diff[key] = { previous: old[key], current: data[key] };
      }
    }
    writeAuditLog("UPDATE", "Color", id, diff);
    return colors[idx];
  },
  delete: async (id) => {
    await delay();
    const idx = colors.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Color no encontrado.");
    const old = colors[idx];
    colors = colors.filter((c) => c.id !== id);
    setStorageItem("kaxia_colors", colors);
    writeAuditLog("DELETE", "Color", id, { name: old.name });
    return true;
  }
};

export const productService = {
  getAll: async (filters = {}) => {
    await delay();
    products = getStorageItem("kaxia_products", INITIAL_PRODUCTS);

    let filtered = [...products];
    if (filters.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters.tagId) {
      filtered = filtered.filter((p) => p.tags.includes(filters.tagId));
    }
    return filtered;
  },
  getById: async (id) => {
    await delay();
    const prod = products.find((p) => p.id === id);
    if (!prod) throw new Error("Producto no encontrado.");
    return prod;
  },
  create: async (data) => {
    await delay();
    const newProd = {
      ...data,
      id: "prod_" + Date.now(),
      gallery: data.gallery || [],
      measurements: data.measurements || {}
    };
    products.push(newProd);
    setStorageItem("kaxia_products", products);
    writeAuditLog("CREATE", "Product", newProd.id, { name: newProd.name, price: newProd.price });
    return newProd;
  },
  update: async (id, data) => {
    await delay();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Producto no encontrado.");
    const old = products[idx];
    products[idx] = { ...old, ...data, id };
    setStorageItem("kaxia_products", products);

    const diff = {};
    for (const key of Object.keys(data)) {
      if (JSON.stringify(data[key]) !== JSON.stringify(old[key])) {
        diff[key] = { previous: old[key], current: data[key] };
      }
    }
    writeAuditLog("UPDATE", "Product", id, diff);
    return products[idx];
  },
  delete: async (id) => {
    await delay();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Producto no encontrado.");
    const old = products[idx];
    products = products.filter((p) => p.id !== id);
    setStorageItem("kaxia_products", products);
    writeAuditLog("DELETE", "Product", id, { name: old.name });
    return true;
  }
};

export const auditLogService = {
  getAll: async () => {
    await delay();
    logs = getStorageItem("kaxia_audit_logs", INITIAL_AUDIT_LOGS);
    return logs;
  }
};

// Subida simulada de imagen a Cloudinary
export const uploadService = {
  uploadImage: async (file) => {
    await delay();
    // Simula una subida y devuelve una imagen placeholder estética de ropa
    const images = [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80"
    ];
    const randomUrl = images[Math.floor(Math.random() * images.length)];
    return {
      url: randomUrl,
      public_id: "mock_cloudinary_" + Date.now()
    };
  }
};

export const announcementService = {
  getAll: async () => {
    await delay();
    return getStorageItem("kaxia_announcements", [
      "Talles M — XXL",
      "Jersey 20.1",
      "Calidad de estampado",
      "Hecho en Argentina 🇦🇷"
    ]);
  },
  save: async (items) => {
    await delay();
    setStorageItem("kaxia_announcements", items);
    return items;
  }
};

// Analíticas e Intención de Compra
const INITIAL_ANALYTICS = {
  sessions: 1540,
  ordersCount: 124,
  montoTotal: 1250000,
  productViews: {
    "prod_1": 420,
    "prod_2": 310,
    "prod_3": 190
  },
  productAdds: {
    "prod_1": 84,
    "prod_2": 56,
    "prod_3": 12
  },
  productOrders: {
    "prod_1": 45,
    "prod_2": 32,
    "prod_3": 8
  }
};

export const analyticsService = {
  getStats: async () => {
    await delay();
    return getStorageItem("kaxia_analytics", INITIAL_ANALYTICS);
  },
  trackSession: async () => {
    const stats = getStorageItem("kaxia_analytics", INITIAL_ANALYTICS);
    stats.sessions += 1;
    setStorageItem("kaxia_analytics", stats);
    return stats;
  },
  trackView: async (productId) => {
    const stats = getStorageItem("kaxia_analytics", INITIAL_ANALYTICS);
    if (!stats.productViews) stats.productViews = {};
    stats.productViews[productId] = (stats.productViews[productId] || 0) + 1;
    setStorageItem("kaxia_analytics", stats);
    return stats;
  },
  trackAddToCart: async (productId) => {
    const stats = getStorageItem("kaxia_analytics", INITIAL_ANALYTICS);
    if (!stats.productAdds) stats.productAdds = {};
    stats.productAdds[productId] = (stats.productAdds[productId] || 0) + 1;
    setStorageItem("kaxia_analytics", stats);
    return stats;
  },
  trackOrder: async (cartItems, total) => {
    const stats = getStorageItem("kaxia_analytics", INITIAL_ANALYTICS);
    stats.ordersCount += 1;
    stats.montoTotal += total;
    if (!stats.productOrders) stats.productOrders = {};
    cartItems.forEach(item => {
      const pid = item.product.id;
      stats.productOrders[pid] = (stats.productOrders[pid] || 0) + item.quantity;
    });
    setStorageItem("kaxia_analytics", stats);
    return stats;
  }
};
