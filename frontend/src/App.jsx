import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import VendedorPage from "./pages/VendedorPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { authService } from "./services/api.js";

// Componente de Enrutamiento Protegido para Administrador
function AdminRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role !== "Admin") {
    return <ErrorPage code="403" />;
  }
  return children;
}

// Componente de Enrutamiento Protegido para Vendedor o Admin
function VendedorRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes({ currentUser, setCurrentUser, cart, setCart, isCartOpen, setIsCartOpen }) {
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/vendedor");
    }
  };

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      authService.logout();
      setCurrentUser(null);
    }, 0);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <CatalogPage
            onNavigateToLogin={() => navigate("/login")}
            onNavigateToAdmin={() => {
              if (currentUser) {
                if (currentUser.role === "Admin") {
                  navigate("/admin");
                } else if (currentUser.role === "Vendedor") {
                  navigate("/vendedor");
                }
              } else {
                navigate("/login");
              }
            }}
            currentUser={currentUser}
            cart={cart}
            setCart={setCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
        }
      />
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToCatalog={() => navigate("/")}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute currentUser={currentUser}>
            <AdminPage
              currentUser={currentUser}
              onLogout={handleLogout}
              onNavigateToCatalog={() => navigate("/")}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/vendedor"
        element={
          <VendedorRoute currentUser={currentUser}>
            <VendedorPage
              currentUser={currentUser}
              onLogout={handleLogout}
              onNavigateToCatalog={() => navigate("/")}
            />
          </VendedorRoute>
        }
      />
      <Route
        path="*"
        element={
          <ErrorPage
            code="404"
            onNavigateToCatalog={() => navigate("/")}
            onNavigateToLogin={() => navigate("/login")}
          />
        }
      />
    </Routes>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado global del carrito de compras (persistencia local)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("kaxia_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Error loading cart from localStorage", e);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("kaxia_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Restaurar sesión del usuario al iniciar si existe en localStorage
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#CDD8E8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#07090e]">
        <AppRoutes
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          cart={cart}
          setCart={setCart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
