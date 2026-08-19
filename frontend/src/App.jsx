import React, { useState, useEffect } from "react";
import CatalogPage from "./pages/CatalogPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import VendedorPage from "./pages/VendedorPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { authService } from "./services/api.js";

function App() {
  const [page, setPage] = useState("catalog"); // 'catalog' | 'login' | 'admin' | 'vendedor'
  const [currentUser, setCurrentUser] = useState(null);
  
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
      if (savedUser.role === "Admin") {
        setPage("admin");
      } else if (savedUser.role === "Vendedor") {
        setPage("vendedor");
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === "Admin") {
      setPage("admin");
    } else {
      setPage("vendedor");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("catalog");
  };

  return (
    <div className="min-h-screen bg-[#07090e]">
      {page === "catalog" && (
        <CatalogPage
          onNavigateToLogin={() => setPage("login")}
          onNavigateToAdmin={() => {
            if (currentUser && currentUser.role === "Vendedor") {
              setPage("vendedor");
            } else {
              setPage("admin");
            }
          }}
          currentUser={currentUser}
          cart={cart}
          setCart={setCart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      )}

      {page === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToCatalog={() => setPage("catalog")}
        />
      )}

      {page === "admin" && (
        !currentUser ? (
          <ErrorPage
            code="401"
            onNavigateToCatalog={() => setPage("catalog")}
            onNavigateToLogin={() => setPage("login")}
          />
        ) : currentUser.role !== "Admin" ? (
          <ErrorPage
            code="403"
            onNavigateToCatalog={() => setPage("catalog")}
            onNavigateToLogin={() => setPage("login")}
          />
        ) : (
          <AdminPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigateToCatalog={() => setPage("catalog")}
          />
        )
      )}

      {page === "vendedor" && (
        !currentUser ? (
          <ErrorPage
            code="401"
            onNavigateToCatalog={() => setPage("catalog")}
            onNavigateToLogin={() => setPage("login")}
          />
        ) : (
          <VendedorPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigateToCatalog={() => setPage("catalog")}
          />
        )
      )}

      {/* Fallback de 404 para cualquier estado no válido */}
      {!["catalog", "login", "admin", "vendedor"].includes(page) && (
        <ErrorPage
          code="404"
          onNavigateToCatalog={() => setPage("catalog")}
          onNavigateToLogin={() => setPage("login")}
        />
      )}
    </div>
  );
}

export default App;
