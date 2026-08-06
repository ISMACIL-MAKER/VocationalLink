import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaBriefcase, FaSearch } from "react-icons/fa";
import { searchPublicJobs } from "../features/jobSlice";
import JobSearchWidget from "../components/JobSearchWidget";
import { SkeletonJobCard } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { REGION_LABELS } from "../constants/enums";

const DEFAULT_FILTERS = { q: "", region: "All", category: "All" };

export default function JobSearch() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || DEFAULT_FILTERS.q,
    region: searchParams.get("region") || DEFAULT_FILTERS.region,
    category: searchParams.get("category") || DEFAULT_FILTERS.category,
  });
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { publicJobs, publicPagination, publicLoading, publicError } = useSelector(
    (state) => state.jobs,
  );

  const runSearch = (nextFilters, nextPage) => {
    const params = { ...nextFilters, page: nextPage, limit: 9 };
    dispatch(searchPublicJobs(params));

    const nextParams = {};
    if (nextFilters.q) nextParams.q = nextFilters.q;
    if (nextFilters.region !== "All") nextParams.region = nextFilters.region;
    if (nextFilters.category !== "All") nextParams.category = nextFilters.category;
    if (nextPage > 1) nextParams.page = String(nextPage);
    setSearchParams(nextParams);
  };

  useEffect(() => {
    runSearch(filters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    setPage(1);
    runSearch(filters, 1);
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    runSearch(filters, nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-surface-alt min-h-screen">
      <div className="bg-surface border-b border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
              Find Your Next Vocational Role
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Browse verified job openings across all Somaliland regions.
            </p>
          </div>
          <JobSearchWidget
            filters={filters}
            onChange={setFilters}
            onSubmit={handleSubmit}
            loading={publicLoading}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {publicError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-semibold text-center border border-red-100">
            ⚠️ {publicError}
          </div>
        )}

        {publicLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonJobCard key={idx} />
            ))}
          </div>
        ) : publicJobs.length === 0 ? (
          <EmptyState
            icon={FaSearch}
            title="No jobs match your search"
            description="Try a different keyword, region, or category — or check back soon as new jobs are posted daily."
          />
        ) : (
          <>
            <p className="text-text-secondary text-xs mb-4">
              {publicPagination.total} job{publicPagination.total === 1 ? "" : "s"} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publicJobs.map((job) => {
                const companyName =
                  job.employerId?.employerProfile?.companyName ||
                  job.company ||
                  job.employerId?.username ||
                  "Confidential Employer";

                return (
                  <Link
                    to={`/jobs/${job._id}`}
                    key={job._id}
                    className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-56"
                  >
                    <div>
                      <span className="inline-block bg-surface-alt text-primary text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                        {job.category}
                      </span>
                      <h3 className="text-text font-bold text-base line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-text-secondary text-xs mt-1">{companyName}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-primary" />
                        {job.region !== "Other"
                          ? REGION_LABELS[job.region] || job.region
                          : job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaBriefcase className="text-primary" />
                        {job.employmentType}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {publicPagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-primary disabled:opacity-40 hover:bg-surface-alt transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-text-secondary">
                  Page {publicPagination.page} of {publicPagination.totalPages}
                </span>
                <button
                  disabled={page >= publicPagination.totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-primary disabled:opacity-40 hover:bg-surface-alt transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
