import apiClient from "./apiClient.js";

// AUTH SERVICE
export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post("/auth/login", { username, password });
    const { user, token } = response.data;
    localStorage.setItem("kaxia_token", token);
    localStorage.setItem("kaxia_current_user", JSON.stringify(user));
    return user;
  },
  logout: async () => {
    localStorage.removeItem("kaxia_token");
    localStorage.removeItem("kaxia_current_user");
    return true;
  },
  getCurrentUser: () => {
    const userJson = localStorage.getItem("kaxia_current_user");
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error("Error parsing current user", e);
      return null;
    }
  }
};

// USER SERVICE
export const userService = {
  getAll: async () => {
    const res = await apiClient.get("/users");
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post("/users", data);
    return res.data;
  },
  updatePassword: async (id, newPassword) => {
    const res = await apiClient.put(`/users/${id}/password`, { password: newPassword });
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
  restore: async (id) => {
    const res = await apiClient.put(`/users/${id}/restore`);
    return res.data;
  }
};

// CATEGORY SERVICE
export const categoryService = {
  getAll: async () => {
    const res = await apiClient.get("/categories");
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post("/categories", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  }
};

// TAG SERVICE
export const tagService = {
  getAll: async () => {
    const res = await apiClient.get("/tags");
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post("/tags", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/tags/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/tags/${id}`);
    return res.data;
  }
};

// COLOR SERVICE
export const colorService = {
  getAll: async () => {
    const res = await apiClient.get("/colors");
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post("/colors", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/colors/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/colors/${id}`);
    return res.data;
  }
};

// PRODUCT SERVICE
export const productService = {
  getAll: async (filters = {}) => {
    const res = await apiClient.get("/products", { params: filters });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post("/products", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }
};

// AUDIT LOG SERVICE
export const auditLogService = {
  getAll: async () => {
    const res = await apiClient.get("/audit-logs");
    return res.data;
  }
};

// UPLOAD SERVICE
export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await apiClient.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },
  deleteImage: async (url) => {
    const res = await apiClient.delete("/uploads", { data: { url } });
    return res.data;
  }
};

// ANNOUNCEMENT SERVICE
export const announcementService = {
  getAll: async () => {
    const res = await apiClient.get("/announcements");
    return res.data;
  },
  save: async (items) => {
    const res = await apiClient.put("/announcements", items);
    return res.data;
  }
};

// ANALYTICS SERVICE
export const analyticsService = {
  getStats: async () => {
    const res = await apiClient.get("/analytics");
    return res.data;
  },
  trackSession: async () => {
    const res = await apiClient.post("/analytics/session");
    return res.data;
  },
  trackView: async (productId) => {
    const res = await apiClient.post("/analytics/view", { productId });
    return res.data;
  },
  trackAddToCart: async (productId, colorId, size, quantity) => {
    const res = await apiClient.post("/analytics/cart", { productId, colorId, size, quantity });
    return res.data;
  },
  trackOrder: async (cartItems, total) => {
    const res = await apiClient.post("/analytics/order", { cartItems, total });
    return res.data;
  },
  trackConsultationClick: async () => {
    const res = await apiClient.post("/analytics/consultation");
    return res.data;
  },
  trackWholesalerClick: async () => {
    const res = await apiClient.post("/analytics/wholesaler");
    return res.data;
  }
};
