import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/navbar";
import { AuthProvider } from "@/context/AuthContext";
const MainLayout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
};

export default MainLayout;
