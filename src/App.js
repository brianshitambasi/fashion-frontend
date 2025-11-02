// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Components
import Home from './components/public/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ShopList from './components/public/ShopList';
import ShopDetails from './components/public/ShopDetails';
import Hairstyles from './components/public/Hairstyles';
import About from './components/public/About';
import Contact from './components/public/Contact';
import NotAuthorized from './components/public/NotAuthorized';
import PageNotFound from './components/public/PageNotFound';

// Customer Components
import CustomerDashboard from './components/customer/CustomerDashboard';
import CustomerBookings from './components/customer/CustomerBookings';
import CustomerCart from './components/customer/CustomerCart';
import CustomerProfile from './components/customer/CustomerProfile';

// Shop Owner Components
import ShopOwnerDashboard from './components/shopowner/ShopOwnerDashboard ';
import ShopOwnerShops from './components/shopowner/ShopOwnerShops ';
import CreateShop from './components/shopowner/CreateShop';
import EditShop from './components/shopowner/EditShop';
import ShopOwnerBookings from './components/shopowner/ShopOwnerBookings';
import ShopOwnerHairstyles from './components/shopowner/ShopOwnerHairstyles';
import ShopOwnerProfile from './components/shopowner/Profile';
import ShopOwnerSettings from './components/shopowner/Settings';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminShops from './components/admin/AdminShops';
import AdminBookings from './components/admin/AdminBookings';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shops" element={<ShopList />} />
              <Route path="/shops/:id" element={<ShopDetails />} />
              <Route path="/hairstyles" element={<Hairstyles />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />

              {/* Customer Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/bookings"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CustomerBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/cart"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CustomerCart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/profile"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CustomerProfile />
                  </ProtectedRoute>
                }
              />

              {/* Shop Owner Routes */}
              <Route
                path="/shopowner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <ShopOwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopowner/shops"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <ShopOwnerShops />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopowner/shops/create"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <CreateShop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopowner/shops/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <EditShop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopowner/bookings"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <ShopOwnerBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopowner/hairstyles"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <ShopOwnerHairstyles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopowner/profile"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <ShopOwnerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopowner/settings"
                element={
                  <ProtectedRoute allowedRoles={["shopowner"]}>
                    <ShopOwnerSettings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/shops"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminShops />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />

              <Route
  path="/shopowner/settings"
  element={
    <ProtectedRoute allowedRoles={["shopowner"]}>
      <ShopOwnerSettings />
    </ProtectedRoute>
  }
/>


              {/* 404 Page */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;