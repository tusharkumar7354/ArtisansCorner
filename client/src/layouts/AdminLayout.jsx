import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

const adminLinks = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Users",
    path: "/admin/users",
  },
  {
    label: "Sellers",
    path: "/admin/sellers",
  },
  {
    label: "Products",
    path: "/admin/products",
  },
  {
    label: "Categories",
    path: "/admin/categories",
  },
  {
    label: "Orders",
    path: "/admin/orders",
  },
];

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-7xl gap-8 px-4 py-8">
        <aside className="hidden w-72 lg:block">
          <Sidebar title="Admin Panel" links={adminLinks} />
        </aside>
        <section className="flex-1">
          <Outlet />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AdminLayout;


