import { FaWrench, FaBolt, FaDraftingCompass, FaFillDrip, FaArrowRight } from "react-icons/fa";

export default function CategoriesSection() {
  const categories = [
    {
      title: "Construction",
      desc: "Carpenters, masonry, and infrastructure specialists in Maroodi-Jeex & Togdheer.",
      count: "1,240 Openings",
      icon: <FaDraftingCompass />,
    },
    {
      title: "Plumbing",
      desc: "Certified master plumbers for residential and commercial systems.",
      count: "850 Openings",
      icon: <FaFillDrip />,
    },
    {
      title: "Electrician",
      desc: "Expert electrical contractors and high-voltage technicians.",
      count: "960 Openings",
      icon: <FaBolt />,
    },
    {
      title: "Welding",
      desc: "TIG, MIG, and arc welding specialists for heavy industry projects.",
      count: "430 Openings",
      icon: <FaWrench />,
    },
  ];

  return (
    <div className="bg-[#F8FAFC] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#00236F]">Explore Featured Categories</h2>
            <p className="text-xs text-[#64748B] mt-1">Find specialized talent across core vocational sectors in Somaliland.</p>
          </div>
          <a href="#" className="text-[#00236F] text-xs font-bold flex items-center gap-2 hover:underline">
            Browse all categories <FaArrowRight />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#F2F4F6] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-56">
              <div>
                <div className="p-3 bg-[#F2F4F6] text-[#00236F] rounded-xl w-fit text-lg mb-4">
                  {cat.icon}
                </div>
                <h3 className="text-[#00236F] font-bold text-base">{cat.title}</h3>
                <p className="text-[#64748B] text-xs mt-2 line-clamp-2">{cat.desc}</p>
              </div>
              <span className="text-[#10B981] font-semibold text-xs mt-4">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}