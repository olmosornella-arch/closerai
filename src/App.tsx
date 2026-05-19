import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import LandingPage from "@/pages/landing/LandingPage";
import { LoginPage, SignupPage } from "@/pages/auth/AuthPages";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { UpgradePage } from "@/pages/upgrade/UpgradePage";

const CRMApp   = lazy(() => import("@/pages/app/CRMApp"));
const CommsApp = lazy(() => import("@/pages/app/CommsApp"));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#07090F"}}>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-white" style={{fontFamily:"'Playfair Display',serif"}}>Closer</span>
        <span className="text-2xl font-black" style={{color:"#C9A84C",fontFamily:"'Playfair Display',serif"}}>AI</span>
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"    element={<RequireGuest><LoginPage /></RequireGuest>} />
      <Route path="/signup"   element={<RequireGuest><SignupPage /></RequireGuest>} />
      <Route path="/onboarding" element={<RequireAuth><OnboardingPage /></RequireAuth>} />
      <Route path="/app/*"    element={<RequireAuth><Suspense fallback={<Loading />}><CRMApp /></Suspense></RequireAuth>} />
      <Route path="/comms/*"  element={<RequireAuth><Suspense fallback={<Loading />}><CommsApp /></Suspense></RequireAuth>} />
      <Route path="/upgrade"  element={<RequireAuth><UpgradePage /></RequireAuth>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}
