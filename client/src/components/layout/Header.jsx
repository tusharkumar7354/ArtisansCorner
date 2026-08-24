import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Store } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Artisan's Corner"
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-amber-800">
              Artisan's Corner
            </h1>
            <p className="text-xs text-stone-500">Handmade Marketplace</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-amber-700"
                : "text-stone-700 transition hover:text-amber-700"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-amber-700"
                : "text-stone-700 transition hover:text-amber-700"
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/seller"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-amber-700"
                : "text-stone-700 transition hover:text-amber-700"
            }
          >
            Seller
          </NavLink>
        </nav>

        {/* Search */}
        <div className="hidden w-full max-w-md lg:block">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Search handmade products..."
              className="w-full rounded-full border border-stone-300 bg-stone-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-amber-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <Link to="/cart" className="relative">
            <ShoppingCart size={25} className="text-stone-700" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 transition hover:border-amber-700"
              >
                <User size={18} />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="rounded-full bg-amber-700 px-5 py-2 text-white transition hover:bg-amber-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/login"
                className="rounded-full border border-stone-300 px-5 py-2 transition hover:border-amber-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-amber-700 px-5 py-2 text-white transition hover:bg-amber-800"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile */}
          <button onClick={toggleMenu} className="lg:hidden">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-white lg:hidden">
          <div className="space-y-3 p-5">
            <Link to="/" onClick={toggleMenu} className="block">
              Home
            </Link>
            <Link to="/products" onClick={toggleMenu} className="block">
              Products
            </Link>
            <Link
              to="/seller"
              onClick={toggleMenu}
              className="flex items-center gap-2"
            >
              <Store size={18} />
              Seller
            </Link>
            <Link to="/cart" onClick={toggleMenu} className="block">
              Cart
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={toggleMenu} className="block">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full rounded-lg bg-amber-700 py-3 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className="block">
                  Login
                </Link>
                <Link to="/register" onClick={toggleMenu} className="block">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;




