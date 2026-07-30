import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicStats } from "../features/statsSlice";
import JobSearchWidget from "../components/JobSearchWidget";
import { SkeletonLine } from "../components/Skeleton";
import useCountUp from "../hooks/useCountUp";

function StatItem({ value, label }) {
  const animated = useCountUp(value);
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl text-[#00236F] font-extrabold tracking-tight">
        {animated.toLocaleString()}+
      </h2>
      <p className="text-[#64748B] text-xs md:text-sm font-medium mt-1 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

const DEFAULT_FILTERS = { q: "", region: "All", category: "All" };

export default function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { totalActiveJobs, verifiedSeekers, verifiedEmployers, loading } = useSelector(
    (state) => state.stats,
  );

  useEffect(() => {
    dispatch(fetchPublicStats());
  }, [dispatch]);

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.region !== "All") params.set("region", filters.region);
    if (filters.category !== "All") params.set("category", filters.category);
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white px-4 pt-16 pb-12 flex flex-col items-center text-center">
      {/* ambient glass accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#10B981]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#00236F]/10 blur-3xl" />

      {/* TRUST BADGE */}
      <div className="mb-8 bg-white/70 backdrop-blur-md border border-[#10B981]/30 py-1.5 px-4 text-[#006C49] font-semibold rounded-full text-sm shadow-sm">
        <span>✔️ Trusted by verified vocational talent across Somaliland</span>
      </div>

      {/* HERO HEADINGS */}
      <div className="mb-6 flex flex-col gap-2 max-w-3xl relative">
        <h1 className="text-4xl md:text-6xl text-[#00236F] font-extrabold tracking-tight">
          Somaliland's Skilled Workforce,
        </h1>
        <h1 className="text-4xl md:text-6xl text-[#10B981] font-extrabold tracking-tight">
          One Search Away.
        </h1>
      </div>

      <p className="text-[#64748B] text-base md:text-lg max-w-2xl leading-relaxed mb-10 relative">
        Connecting certified electricians, plumbers, tailors, and technicians with
        employers across Hargeisa, Burao, Berbera, Borama, Erigavo, and Las Anod —
        verified skills, real opportunities.
      </p>

      {/* SEARCH ENGINE BAR */}
      <div className="relative w-full flex justify-center mb-12">
        <JobSearchWidget
          filters={filters}
          onChange={setFilters}
          onSubmit={handleSearchSubmit}
          loading={false}
        />
      </div>

      {/* CALL TO ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center mb-16 relative">
        <Link
          className="bg-[#00236F] hover:bg-[#1E3A8A] text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-center"
          to="/jobs"
        >
          Find a Job 📢
        </Link>
        <Link
          className="bg-white/80 backdrop-blur-md border-2 border-[#00236F] text-[#00236F] hover:bg-[#F2F4F6] font-bold py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 text-center"
          to="/Register"
        >
          Post a Job ➕
        </Link>
      </div>

      {/* LIVE STATISTICAL COUNTERS */}
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md border border-[#F2F4F6] rounded-2xl shadow-sm py-8 px-6 grid grid-cols-3 gap-4 relative">
        {loading ? (
          <>
            <SkeletonLine className="h-10 w-full" />
            <SkeletonLine className="h-10 w-full" />
            <SkeletonLine className="h-10 w-full" />
          </>
        ) : (
          <>
            <StatItem value={totalActiveJobs} label="Active Jobs" />
            <StatItem value={verifiedSeekers} label="Verified Technicians" />
            <StatItem value={verifiedEmployers} label="Top Employers" />
          </>
        )}
      </div>
    </section>
  );
}
