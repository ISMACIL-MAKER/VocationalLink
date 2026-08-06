import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBolt,
  FaTint,
  FaTshirt,
  FaLaptopCode,
  FaHammer,
  FaCarSide,
  FaTools,
  FaFireAlt,
  FaTruck,
  FaEllipsisH,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { fetchPublicStats } from "../features/statsSlice";

const CATEGORY_ICONS = {
  Electrician: FaBolt,
  Plumber: FaTint,
  Tailor: FaTshirt,
  "IT Technician": FaLaptopCode,
  Carpenter: FaHammer,
  Mechanic: FaCarSide,
  Mason: FaTools,
  Welder: FaFireAlt,
  Driver: FaTruck,
  Other: FaEllipsisH,
};

export default function CategoriesSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { categoryCounts, loading } = useSelector((state) => state.stats);

  useEffect(() => {
    if (!categoryCounts.length) {
      dispatch(fetchPublicStats());
    }
  }, [dispatch, categoryCounts.length]);

  const scrollBy = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const goToCategory = (category) => {
    navigate(`/jobs?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="bg-surface-alt py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">Explore Vocational Categories</h2>
            <p className="text-xs text-text-secondary mt-1">
              Find specialized talent across core vocational sectors in Somaliland.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-320)}
              className="p-2 rounded-full border border-border text-primary hover:bg-surface-alt transition-colors"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(320)}
              className="p-2 rounded-full border border-border text-primary hover:bg-surface-alt transition-colors"
            >
              <FaChevronRight />
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="text-primary text-xs font-bold flex items-center gap-2 hover:underline"
            >
              Browse all jobs <FaArrowRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {(loading ? Array.from({ length: 4 }) : categoryCounts).map((entry, idx) => {
            const category = entry?.category;
            const Icon = CATEGORY_ICONS[category] || FaEllipsisH;

            return (
              <button
                key={category || idx}
                onClick={() => category && goToCategory(category)}
                disabled={loading}
                className="snap-start shrink-0 w-56 bg-surface p-6 rounded-2xl border border-border shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-48 text-left"
              >
                {loading ? (
                  <div className="animate-pulse flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-surface-alt" />
                    <div className="h-4 w-2/3 bg-surface-alt rounded" />
                    <div className="h-3 w-1/2 bg-surface-alt rounded" />
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="p-3 bg-surface-alt text-primary rounded-xl w-fit text-lg mb-4">
                        <Icon />
                      </div>
                      <h3 className="text-primary font-bold text-base">{category}</h3>
                    </div>
                    <span className="text-success font-semibold text-xs mt-4">
                      {entry.count} Open Position{entry.count === 1 ? "" : "s"}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
