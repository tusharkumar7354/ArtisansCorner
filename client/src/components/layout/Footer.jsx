import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  const roles = user?.roles || [];
  const isAdmin = roles.includes("admin");
  const isSeller = roles.includes("seller");
  const isBuyer = roles.includes("buyer");

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-300">
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-14">
        <div className="py-14">
          {/* Top Section */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
            {/* Brand */}
            <div className="pr-4">
              <div className="flex items-center gap-4">
  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-1">
    <img
      src="/web-logo.png"
      alt="Artisan's Corner"
      className="h-full w-full object-contain"
    />
  </div>

  <div>
    <h2 className="text-xl font-bold text-white">
      Artisan&apos;s Corner
    </h2>
    <p className="mt-1 text-sm text-stone-500">
      Handmade with Passion
    </p>
  </div>
</div>
              <p className="mt-6 max-w-sm leading-8 text-stone-400">
                An e-commerce platform for handmade goods. Discover unique
                creations made with skill, creativity and passion by independent
                artisans.
              </p>
            </div>

            {/* Marketplace */}
            <div>
              <h3 className="mb-6 text-lg font-bold tracking-wide text-amber-500">
                Marketplace
              </h3>
              <div className="flex flex-col gap-4 text-[16px]">
                <Link to="/" className="transition hover:text-amber-400">
                  Home
                </Link>
                <Link
                  to="/products"
                  className="transition hover:text-amber-400"
                >
                  Browse Products
                </Link>
                {isAuthenticated && !isAdmin && (
                  <>
                    <Link
                      to="/cart"
                      className="transition hover:text-amber-400"
                    >
                      Shopping Cart
                    </Link>
                    <Link
                      to="/my-orders"
                      className="transition hover:text-amber-400"
                    >
                      My Orders
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Role Based Section */}
            <div>
              <h3 className="mb-6 text-lg font-bold tracking-wide text-amber-500">
                {isAdmin
                  ? "Administration"
                  : isSeller
                    ? "For Artisans"
                    : "For Artisans"}
              </h3>
              <div className="flex flex-col gap-4 text-[16px]">
                {/* Admin */}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="transition hover:text-amber-400"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="transition hover:text-amber-400"
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/sellers"
                      className="transition hover:text-amber-400"
                    >
                      Manage Sellers
                    </Link>
                    <Link
                      to="/admin/products"
                      className="transition hover:text-amber-400"
                    >
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/categories"
                      className="transition hover:text-amber-400"
                    >
                      Manage Categories
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="transition hover:text-amber-400"
                    >
                      Manage Orders
                    </Link>
                  </>
                )}

                {/* Seller */}
                {!isAdmin && isSeller && (
                  <>
                    <Link
                      to="/seller/dashboard"
                      className="transition hover:text-amber-400"
                    >
                      Seller Dashboard
                    </Link>
                    <Link
                      to="/seller/products"
                      className="transition hover:text-amber-400"
                    >
                      Manage Products
                    </Link>
                    <Link
                      to="/seller/orders"
                      className="transition hover:text-amber-400"
                    >
                      Customer Orders
                    </Link>
                    <Link
                      to="/seller/sales-history"
                      className="transition hover:text-amber-400"
                    >
                      Sales History
                    </Link>
                  </>
                )}

                {/* Buyer */}
                {!isAdmin && !isSeller && isBuyer && (
                  <Link
                    to="/become-seller"
                    className="transition hover:text-amber-400"
                  >
                    Become a Seller
                  </Link>
                )}

                {/* Guest */}
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="transition hover:text-amber-400"
                  >
                    Become a Seller
                  </Link>
                )}
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="mb-6 text-lg font-bold tracking-wide text-amber-500">
                Account
              </h3>
              <div className="flex flex-col gap-4 text-[16px]">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="transition hover:text-amber-400"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="transition hover:text-amber-400"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="transition hover:text-amber-400"
                    >
                      My Profile
                    </Link>
                    {isSeller && !isAdmin && (
                      <Link
                        to="/seller/settings"
                        className="transition hover:text-amber-400"
                      >
                        Seller Settings
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Stay Connected */}
            <div>
              <h3 className="mb-6 text-lg font-bold tracking-wide text-amber-500">
                Stay Connected
              </h3>
              <p className="max-w-sm leading-8 text-stone-400">
                Discover new handmade products, independent artisans and unique
                creations from Artisan&apos;s Corner.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-14 border-t border-stone-800 pt-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium text-stone-300">
                © {new Date().getFullYear()} Artisan&apos;s Corner. All rights
                reserved.
              </p>
              <p className="text-sm tracking-wide text-stone-500">
                Handmade goods • Independent artisans • Unique creations
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


