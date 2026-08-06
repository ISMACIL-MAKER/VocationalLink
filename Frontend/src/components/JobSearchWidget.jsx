import { FaSearch } from "react-icons/fa";
import { SOMALILAND_REGIONS, REGION_LABELS, VOCATIONAL_CATEGORIES } from "../constants/enums";

export default function JobSearchWidget({ filters, onChange, onSubmit, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl bg-surface rounded-2xl shadow-lg border border-border p-3 flex flex-col md:flex-row gap-3"
    >
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
          <FaSearch />
        </span>
        <input
          type="text"
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
          placeholder="Search by job title or keyword..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <select
        value={filters.region}
        onChange={(e) => onChange({ ...filters, region: e.target.value })}
        className="px-4 py-2.5 rounded-xl border border-border text-sm text-text bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="All">All Regions</option>
        {SOMALILAND_REGIONS.map((region) => (
          <option key={region} value={region}>
            {REGION_LABELS[region] || region}
          </option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="px-4 py-2.5 rounded-xl border border-border text-sm text-text bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="All">All Categories</option>
        {VOCATIONAL_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary hover:bg-primary-dark disabled:bg-border text-white font-bold px-6 py-2.5 rounded-xl transition-all whitespace-nowrap"
      >
        {loading ? "Searching..." : "Search Jobs"}
      </button>
    </form>
  );
}
