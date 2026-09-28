import { FiSearch, FiFilter } from "react-icons/fi";

function SearchFilter({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) {
  return (
    <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-md">
        <FiSearch
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-8 text-sm font-medium text-slate-600 outline-none transition hover:border-slate-300 focus:border-violet-500"
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <FiFilter
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;