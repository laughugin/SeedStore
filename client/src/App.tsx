import React from 'react';
import { Navigate, createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Dashboard from './components/Dashboard';
import AdminLogin from './pages/AdminLogin';
import Payment from './pages/Payment';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import ProfilePage from './pages/ProfilePage';
import AboutCompany from './pages/AboutCompany';
import AIChat from './components/AIChat/AIChat';
import Orders from './pages/Orders';
import AdminOrders from './pages/AdminOrders';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PrivateRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, isAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && !user.is_superuser) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--mui-palette-background-default)' }}>
          <Header />
          <Outlet />
          <AIChat />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />
      },
      {
        path: "catalog",
        element: <Catalog />
      },
      {
        path: "product/:id",
        element: <ProductPage />
      },
      {
        path: "cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        )
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        )
      },
      {
        path: "admin",
        element: (
          <PrivateRoute isAdmin={true}>
            <AdminPanel />
          </PrivateRoute>
        )
      },
      {
        path: "admin/login",
        element: <AdminLogin />
      },
      {
        path: "payment",
        element: <Payment />
      },
      {
        path: "about",
        element: <AboutCompany />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "orders",
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        )
      },
      {
        path: "admin/orders",
        element: (
          <PrivateRoute isAdmin={true}>
            <AdminOrders />
          </PrivateRoute>
        )
      },
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ]
  }
]);

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          backgroundColor: '#4CAF50',
          color: 'white'
        }}
      />
    </>
  );
};

export default App;
