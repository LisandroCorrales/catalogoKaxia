import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor para inyectar el token JWT en las cabeceras de cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kaxia_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para capturar errores de respuesta y formatear el mensaje con el devuelto por el servidor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

export default apiClient;
