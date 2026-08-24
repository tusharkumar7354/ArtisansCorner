import { NavLink } from "react-router-dom";

const Sidebar = ({ links = [], title = "Dashboard" }) => {
  return (
    <aside className="w-64 min-h-screen bg-stone-900 text-white">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <nav className="mt-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-6 py-3 transition ${
                isActive ? "bg-amber-700" : "hover:bg-stone-800"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
