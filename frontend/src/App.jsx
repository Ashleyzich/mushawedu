import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar             from './components/Navbar'
import Footer             from './components/Footer'
import HomePage           from './pages/HomePage'
import ArtisansPage       from './pages/ArtisansPage'
import SuppliersPage      from './pages/SuppliersPage'
import ProjectsPage       from './pages/ProjectsPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import DashboardPage      from './pages/DashboardPage'
import PostProjectPage    from './pages/PostProjectPage'
import ArtisanProfilePage from './pages/ArtisanProfilePage'
import AddListingPage     from './pages/AddListingPage'
import MessagesPage       from './pages/MessagesPage'
import QuotationPage      from './pages/QuotationPage'
import PaymentPage        from './pages/PaymentPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgray">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/images/mushawedu-logo.png"
            alt="MushaWedu Logo"
            className="w-14 h-14 object-contain animate-pulse"
          />

          <div className="w-10 h-10 border-4 border-bgray border-t-orange rounded-full animate-spin" />

          <p className="text-sm text-gray-500 font-medium">
            Loading MushaWedu...
          </p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/artisans"  element={<ArtisansPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/projects"  element={<ProjectsPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-project"
            element={
              <ProtectedRoute>
                <PostProjectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/artisan-profile"
            element={
              <ProtectedRoute>
                <ArtisanProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-listing"
            element={
              <ProtectedRoute>
                <AddListingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quotation"
            element={
              <ProtectedRoute>
                <QuotationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/return"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}