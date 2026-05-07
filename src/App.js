import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminUsers from "./admin/AdminUsers";
import AdminTrips from "./admin/AdminTrips";
import AdminChats from "./admin/AdminChats";
import AdminContacts from "./admin/AdminContacts";
import AdminProfile from "./admin/AdminProfile";

import ProtectedRoute from "./components/ProtectedRoute";

function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminLayout />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}