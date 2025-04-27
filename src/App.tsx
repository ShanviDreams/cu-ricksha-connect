
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import socketService from "./services/socket";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRole, 
  redirectPath = "/login" 
}: { 
  children: JSX.Element, 
  allowedRole?: 'teacher' | 'driver', 
  redirectPath?: string 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  console.log("ProtectedRoute check:", { isAuthenticated, userRole: user?.role, allowedRole, loading });
  
  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Not authenticated
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }
  
  // Check role if specified
  if (allowedRole && user?.role !== allowedRole) {
    console.log("Role mismatch, redirecting based on user role");
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    }
    if (user?.role === 'driver') {
      return <Navigate to="/driver-dashboard" replace />;
    }
    // Fallback to login
    return <Navigate to={redirectPath} replace />;
  }
  
  // All checks passed, render the protected component
  console.log("Access granted to protected route");
  return children;
};

// Login route component to redirect if already logged in
const LoginRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  console.log("LoginRoute check:", { isAuthenticated, userRole: user?.role, loading });
  
  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    console.log("Already authenticated, redirecting to dashboard");
    if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    }
    if (user.role === 'driver') {
      return <Navigate to="/driver-dashboard" replace />;
    }
  }
  
  // User not authenticated, show login page
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Log route state on every render
  console.log("AppRoutes render - Auth state:", { isAuthenticated, userRole: user?.role });
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={
        <LoginRoute>
          <Login />
        </LoginRoute>
      } />
      <Route path="/signup" element={
        <LoginRoute>
          <Signup />
        </LoginRoute>
      } />
      <Route path="/teacher-dashboard" element={
        <ProtectedRoute allowedRole="teacher">
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      <Route path="/driver-dashboard" element={
        <ProtectedRoute allowedRole="driver">
          <DriverDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Initialize socket connection
  useEffect(() => {
    socketService.init();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
