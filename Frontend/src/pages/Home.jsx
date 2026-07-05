import { Link } from "react-router-dom";

export function Home() {
  return (
    <section className="min-h-[calc(100vh-73px)] bg-[#F8FAFC] flex flex-col justify-center items-center px-4 text-center">
      
      {/* TRUST BADGE */}
      <div className="mb-8 bg-[#6CF8BB]/20 border border-[#10B981]/30 py-1.5 px-4 text-[#006C49] font-semibold rounded-full text-sm animate-fade-in shadow-sm">
        <span>✔️ Trusted by 10,000+ Skilled Professionals</span>
      </div>

      {/* HERO HEADINGS */}
      <div className="mb-6 flex flex-col gap-2 max-w-3xl">
        <h1 className="text-4xl md:text-6xl text-[#00236F] font-extrabold tracking-tight">
          Find the Right Job.
        </h1>
        <h1 className="text-4xl md:text-6xl text-[#10B981] font-extrabold tracking-tight">
          Hire the Right Skill.
        </h1>
      </div>

      {/* HERO DESCRIPTION */}
      <p className="text-[#64748B] text-base md:text-lg max-w-2xl leading-relaxed mb-10">
        The premium marketplace for certified vocational talent and specialized
        industrial roles. Streamlined matching for construction, manufacturing, 
        and technical services.
      </p>

      {/* CALL TO ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center">
        <Link 
          className="bg-[#00236F] hover:bg-[#1E3A8A] text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-center" 
          to="/Login"
        >
          Find a Job 📢
        </Link>
        <Link 
          className="bg-white border-2 border-[#00236F] text-[#00236F] hover:bg-[#F2F4F6] font-bold py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 text-center" 
          to="/Register"
        >
          Post a Job ➕
        </Link>
      </div>

    </section>
  );
}