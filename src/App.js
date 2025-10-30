import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧠 Context
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoutes";

// 🌍 Public Components
import HomeComponent from "./components/HomeComponent";
import AboutUs from "./components/AboutUs";
import Register from "./components/Register";
import Login from "./components/Login";
import NotAuthorized from "./components/NotAuthorized";
import PageNotFound from "./components/PageNotFound";

// 🧭 Navbar
import NavbarComponent from "./components/NavbarComponent";

// 🧑‍💼 Admin
import AdminDashboard from "./components/admin/AdminDashboard";

// 🏪 Shop Owner Components
import ShopLayout from "./components/shopowner/ShopLayout";
import ShopDashboard from "./components/shopowner/ShopDashboard";
import CreateShop from "./components/shopowner/CreateShop";
import EditShop from "./components/shopowner/EditShop";
import MyShops from "./components/shopowner/MyShops";
import Profile from "./components/shopowner/Profile";
import Settings from "./components/shopowner/Settings";

// 👩‍🦰 Customer Components
// import CustomerLayout from "./components/customer/CustomerLayout";
// import CustomerDashboard from "./components/customer/CustomerDashboard";
// import CustomerShops from "./components/customer/CustomerShops";
// import CustomerShopDetails from "./components/customer/CustomerShopDetails";
// import CustomerCart from "./components/customer/CustomerCart";
// import CustomerBookings from "./components/customer/CustomerBookings";
// import CustomerProfile from "./components/customer/CustomerProfile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          {/* 🔝 NavbarComponent - Hidden for shop owner routes */}
          <Routes>
            <Route path="/shopowner/*" element={null} />
            <Route path="*" element={<NavbarComponent />} />
          </Routes>

          {/* 🧭 App Content */}
          <main className="flex-grow-1">
            <Routes>
              {/* 🌍 Public Routes */}
              <Route path="/" element={<HomeComponent />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route path="/not-found" element={<PageNotFound />} />

              {/* 🧩 Admin Dashboard */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 🏪 Shop Owner Area - Fixed Structure */}
              <Route
                path="/shopowner/*"
                element={
                  <ProtectedRoute allowedRoles={["shop"]}>
                    <ShopLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ShopDashboard />} />
                <Route path="dashboard" element={<ShopDashboard />} />
                <Route path="shops" element={<MyShops />} />
                <Route path="create" element={<CreateShop />} />
                <Route path="edit/:id" element={<EditShop />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* 👩‍🦰 Customer Area */}
              <Route
                path="/customer/*"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    {/* <CustomerLayout /> */}
                  </ProtectedRoute>
                }
              >
                {/* <Route index element={<CustomerDashboard />} /> */}
                {/* <Route path="dashboard" element={<CustomerDashboard />} /> */}
                {/* <Route path="shops" element={<CustomerShops />} /> */}
                {/* <Route path="shops/:id" element={<CustomerShopDetails />} /> */}
                {/* <Route path="cart" element={<CustomerCart />} /> */}
                {/* <Route path="bookings" element={<CustomerBookings />} /> */}
                {/* <Route path="profile" element={<CustomerProfile />} /> */}
              </Route>

              {/* 🚫 Fallback */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>

          {/* 🦶 Footer - Hidden for shop owner routes */}
          <Routes>
            <Route path="/shopowner/*" element={null} />
            <Route path="*" element={
              <footer className="bg-light py-3 text-center mt-auto">
                <small className="text-muted">
                  © {new Date().getFullYear()} Looks Nairobi — All Rights Reserved
                </small>
              </footer>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;