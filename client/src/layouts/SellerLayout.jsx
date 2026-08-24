import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

const SellerLayout = () => {
  return (
    <>
      <Navbar />

      <main className="mx-auto flex min-h-screen max-w-7xl gap-8 px-4 py-8">
        <aside className="hidden w-72 lg:block">
          <Sidebar
            title="Dashboard"
            links={[
              {
                label: "Dashboard",
                path: "/seller/dashboard",
              },
              {
                label: "My Products",
                path: "/seller/products",
              },
              {
                label: "Create Product",
                path: "/seller/create-product",
              },
              {
                label: "Customer Orders",
                path: "/seller/orders",
              },
              {
                label: "Sales History",
                path: "/seller/sales",
              },
              {
                label: "Store Settings",
                path: "/seller/settings",
              },
            ]}
          />
        </aside>

        <section className="flex-1">
          <Outlet />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SellerLayout;
