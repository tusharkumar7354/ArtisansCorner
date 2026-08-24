import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
      />

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-300 bg-white py-3 pl-11 pr-4 focus:border-amber-700 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;


