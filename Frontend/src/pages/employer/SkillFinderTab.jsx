import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { searchTalent } from "../../features/employerSlice";
import { SkeletonJobCard } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import CandidateProfilePreviewModal from "../../components/employer/CandidateProfilePreviewModal";
import {
  VOCATIONAL_CATEGORIES,
  PROFICIENCY_LEVELS,
  SOMALILAND_REGIONS,
  REGION_LABELS,
  AVAILABILITY_OPTIONS,
} from "../../constants/enums";

const DEFAULT_FILTERS = {
  skillName: "",
  category: "All",
  proficiency: "All",
  region: "All",
  availability: "All",
  verifiedOnly: false,
};

export default function SkillFinderTab() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { talentResults, talentPagination, talentLoading } = useSelector(
    (state) => state.employer,
  );
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    skillName: searchParams.get("skillName") || "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const runSearch = (nextFilters, page = 1) => {
    dispatch(
      searchTalent({
        ...nextFilters,
        verifiedOnly: nextFilters.verifiedOnly ? "true" : undefined,
        page,
        limit: 9,
      }),
    );
    setHasSearched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(filters, 1);
  };

  useEffect(() => {
    if (searchParams.get("skillName")) {
      runSearch({ ...DEFAULT_FILTERS, skillName: searchParams.get("skillName") }, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-text font-bold text-lg">Vocational Skill Finder</h2>
        <p className="text-xs text-text-secondary">
          Search verified local technicians by skill, proficiency, region, and availability.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
      >
        <input
          value={filters.skillName}
          onChange={(e) => setFilters({ ...filters, skillName: e.target.value })}
          placeholder="Skill keyword..."
          className="border border-border rounded-lg px-3 py-2 text-sm lg:col-span-2"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="All">All Categories</option>
          {VOCATIONAL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filters.proficiency}
          onChange={(e) => setFilters({ ...filters, proficiency: e.target.value })}
          className="border border-border rounded-lg px-3 py-2 text-sm capitalize"
        >
          <option value="All">Any Proficiency</option>
          {PROFICIENCY_LEVELS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="All">All Regions</option>
          {SOMALILAND_REGIONS.map((r) => (
            <option key={r} value={r}>
              {REGION_LABELS[r] || r}
            </option>
          ))}
        </select>
        <select
          value={filters.availability}
          onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
          className="border border-border rounded-lg px-3 py-2 text-sm capitalize"
        >
          <option value="All">Any Availability</option>
          {AVAILABILITY_OPTIONS.map((a) => (
            <option key={a} value={a}>
              {a.replace("_", " ")}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-xs font-semibold text-text lg:col-span-3">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
          />
          Verified Skill Badge Only
        </label>
        <button
          type="submit"
          disabled={talentLoading}
          className="bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-secondary text-white font-bold px-6 py-2 rounded-lg text-sm lg:col-span-3"
        >
          {talentLoading ? "Searching..." : "Search Talent"}
        </button>
      </form>

      {talentLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonJobCard key={idx} />
          ))}
        </div>
      ) : !hasSearched ? (
        <EmptyState
          icon={FaSearch}
          title="Search for vocational talent"
          description="Use the filters above to find verified technicians ready to work."
        />
      ) : talentResults.length === 0 ? (
        <EmptyState
          icon={FaSearch}
          title="No candidates found"
          description="Try widening your filters — fewer constraints show more candidates."
        />
      ) : (
        <>
          <p className="text-text-secondary text-xs mb-4">
            {talentPagination.total} candidate(s) found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {talentResults.map((candidate) => (
              <button
                key={candidate._id}
                onClick={() => setSelectedCandidate(candidate)}
                className="text-left bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={
                      candidate.profileImage ||
                      "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                    }
                    alt={candidate.username}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  <div>
                    <h3 className="font-bold text-text text-sm">{candidate.username}</h3>
                    <p className="text-xs text-text-secondary flex items-center gap-1">
                      <FaMapMarkerAlt />{" "}
                      {REGION_LABELS[candidate.seekerProfile?.region] ||
                        candidate.seekerProfile?.region}
                    </p>
                  </div>
                </div>
                {candidate.bio && (
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">{candidate.bio}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {(candidate.seekerProfile?.skills || []).slice(0, 4).map((skill) => (
                    <span
                      key={skill._id}
                      className="text-[10px] font-semibold bg-surface-alt text-primary px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      {skill.skillName}
                      {skill.certificates?.some(
                        (c) => c.verificationStatus === "verified",
                      ) && <FaCheckCircle className="text-emerald-500" />}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-text-secondary mt-3 capitalize">
                  {candidate.seekerProfile?.availability?.replace("_", " ")}
                </p>
              </button>
            ))}
          </div>

          {talentPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                disabled={talentPagination.page <= 1}
                onClick={() => runSearch(filters, talentPagination.page - 1)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-primary disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-text-secondary">
                Page {talentPagination.page} of {talentPagination.totalPages}
              </span>
              <button
                disabled={talentPagination.page >= talentPagination.totalPages}
                onClick={() => runSearch(filters, talentPagination.page + 1)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-primary disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <CandidateProfilePreviewModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
}
