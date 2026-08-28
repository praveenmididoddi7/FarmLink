import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AIChatModal } from './components/common/AIChatModal';
import { ScrollToTop } from './components/common/ScrollToTop';
import { RoleProtectedRoute } from './components/common/RoleProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { MarketplacePage } from './pages/buyer/MarketplacePage';
import { ProductDetailsPage } from './pages/buyer/ProductDetailsPage';
import { MarketPricesPublicPage } from './pages/public/MarketPricesPublicPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { AddCropPage } from './pages/farmer/AddCropPage';
import { MyListingsPage } from './pages/farmer/MyListingsPage';
import { FarmerOrdersPage } from './pages/farmer/FarmerOrdersPage';
import { AIPredictionPage } from './pages/farmer/AIPredictionPage';
import { FarmerAnalyticsPage } from './pages/farmer/FarmerAnalyticsPage';
import { FarmerProfilePage } from './pages/farmer/FarmerProfilePage';

// Buyer Pages
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { BuyerOrdersPage } from './pages/buyer/BuyerOrdersPage';
import { BuyerProfilePage } from './pages/buyer/BuyerProfilePage';

// Transport Pages
import { TransportDashboard } from './pages/transport/TransportDashboard';
import { AvailableLoadsPage } from './pages/transport/AvailableLoadsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-transparent text-emerald-950 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-200 selection:text-emerald-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public & General Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/buyer/marketplace" element={<Navigate to="/marketplace" replace />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/market-prices" element={<MarketPricesPublicPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Farmer Protected Routes */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['farmer']}>
                      <FarmerDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/add-crop"
                  element={
                    <RoleProtectedRoute allowedRoles={['farmer']}>
                      <AddCropPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route path="/farmer/list-crop" element={<Navigate to="/farmer/add-crop" replace />} />
                <Route
                  path="/farmer/listings"
                  element={
                    <RoleProtectedRoute allowedRoles={['farmer']}>
                      <MyListingsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/orders"
                  element={
                    <RoleProtectedRoute allowedRoles={['farmer']}>
                      <FarmerOrdersPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/predictions"
                  element={
                    <RoleProtectedRoute allowedRoles={['farmer']}>
                      <AIPredictionPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/analytics"
                  element={
                    <RoleProtectedRoute allowedRoles={['farmer']}>
                      <FarmerAnalyticsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/profile"
                  element={
                    <RoleProtectedRoute allowedRoles={['farmer']}>
                      <FarmerProfilePage />
                    </RoleProtectedRoute>
                  }
                />

                {/* Buyer Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <RoleProtectedRoute allowedRoles={['buyer']}>
                      <CartPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <RoleProtectedRoute allowedRoles={['buyer']}>
                      <CheckoutPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/buyer/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['buyer']}>
                      <BuyerDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/buyer/orders"
                  element={
                    <RoleProtectedRoute allowedRoles={['buyer']}>
                      <BuyerOrdersPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/buyer/profile"
                  element={
                    <RoleProtectedRoute allowedRoles={['buyer']}>
                      <BuyerProfilePage />
                    </RoleProtectedRoute>
                  }
                />

                {/* Transporter Protected Routes */}
                <Route
                  path="/transport/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['transport']}>
                      <TransportDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route path="/transporter/dashboard" element={<Navigate to="/transport/dashboard" replace />} />
                <Route
                  path="/transport/loads"
                  element={
                    <RoleProtectedRoute allowedRoles={['transport']}>
                      <AvailableLoadsPage />
                    </RoleProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />

            {/* Global Floating AI Agri-Advisor */}
            <AIChatModal />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
