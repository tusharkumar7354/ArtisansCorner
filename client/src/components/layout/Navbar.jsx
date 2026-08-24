import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.roles?.includes("admin");
  const isSeller = user?.roles?.includes("seller") ?? false;
  const isActiveSeller = Boolean(user?.isSeller);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setMenuOpen(false);
      navigate("/login", { replace: true });
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-amber-100 text-amber-900 shadow-sm"
        : "text-stone-700 hover:bg-stone-100 hover:text-amber-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-15 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-5">
        {/* <div className="flex h-20 items-center justify-between"></div> */}
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center">
  <img
    src="/web-logo.png"
    alt="Artisan's Corner"
    className="h-11 w-11 object-contain"
  />
</div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 sm:text-xl">
              Artisan&apos;s Corner
            </h1>
            <p className="hidden text-xs text-stone-500 sm:block">
              Handmade with Passion
            </p>
          </div>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          {isAuthenticated && !isAdmin && (
            <>
              <NavLink to="/cart" className={linkClass}>
                <ShoppingCart size={18} />
                Cart
              </NavLink>
              <NavLink to="/my-orders" className={linkClass}>
                {isSeller ? "My Purchases" : "My Orders"}
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <User size={18} />
                Profile
              </NavLink>
            </>
          )}
          {/* Seller / Reopen Store */}
          {isSeller && !isAdmin && (
            <NavLink
              to={isActiveSeller ? "/seller/dashboard" : "/become-seller"}
              className={linkClass}
            >
              <Store size={18} />
              {isActiveSeller ? "Seller Dashboard" : "Reopen Store"}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={linkClass}>
              <LayoutDashboard size={18} />
              Admin Dashboard
            </NavLink>
          )}
        </nav>
        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-stone-300 bg-white px-6 text-sm font-semibold leading-none text-stone-800 shadow-sm transition-all duration-300 hover:bg-stone-50 hover:shadow-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-700 px-6 text-sm font-semibold leading-none text-white shadow-sm transition-all duration-300 hover:bg-amber-800 hover:shadow-md"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-800 text-sm font-bold text-white">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs text-stone-500">Signed in as</p>
                  <p className="max-w-[140px] truncate text-sm font-semibold text-stone-800">
                    {user?.name || "User"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-lg font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-300 bg-white transition hover:bg-stone-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-stone-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-5 py-5">
            <NavLink to="/" onClick={closeMenu} className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={closeMenu} className={linkClass}>
              Products
            </NavLink>
            {isAuthenticated && !isAdmin && (
              <>
                <NavLink to="/cart" onClick={closeMenu} className={linkClass}>
                  <ShoppingCart size={18} />
                  Cart
                </NavLink>
                <NavLink
                  to="/my-orders"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  {isSeller ? "My Purchases" : "My Orders"}
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  <User size={18} />
                  Profile
                </NavLink>
              </>
            )}
            {/* Seller / Reopen Store */}
            {isSeller && !isAdmin && (
              <NavLink
                to={isActiveSeller ? "/seller/dashboard" : "/become-seller"}
                onClick={closeMenu}
                className={linkClass}
              >
                <Store size={18} />
                {isActiveSeller ? "Seller Dashboard" : "Reopen Store"}
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                onClick={closeMenu}
                className={linkClass}
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </NavLink>
            )}
            <div className="my-4 border-t border-stone-200" />
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-center text-sm font-semibold text-stone-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-amber-800 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-800 font-bold text-white">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Signed in as</p>
                    <p className="font-semibold text-stone-800">{user?.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;








