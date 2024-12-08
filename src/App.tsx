import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
// import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import { Dashboard } from "./pages/(dashboard)/home";
import { Members } from "./pages/(dashboard)/members";
import { Societies } from "./pages/(dashboard)/societies";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* <Route path="/" element={<Landing />} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            {/* <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            /> */}

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route
                index
                element={<Navigate to="/dashboard/home" replace />}
              />
              <Route path="home" element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="societies" element={<Societies />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
