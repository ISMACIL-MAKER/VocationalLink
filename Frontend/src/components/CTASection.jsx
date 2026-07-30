import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <div className="bg-[#00236F] text-white py-16 px-6 text-center">
      <h2 className="text-2xl md:text-4xl font-extrabold">Ready to advance your career or build your team?</h2>
      <p className="text-blue-200 text-xs md:text-sm mt-3 max-w-lg mx-auto">
        Join thousands of businesses and professionals already growing on VocationalLink.
      </p>

      <div className="flex justify-center gap-4 mt-8">
        <Link
          to="/Register"
          className="bg-white text-[#00236F] font-bold text-xs px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Get Started Today
        </Link>
        <a
          href="#footer"
          className="border border-blue-400 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors"
        >
          Talk to an Expert
        </a>
      </div>
    </div>
  );
}
