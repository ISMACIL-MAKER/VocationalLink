import { Link } from "react-router-dom";

{
  /*
     #1E3A8A
     #10B981
     #64748B
     #F8FAFC
     #6CF8BB
     #00236F
     #006C49
    */
}

export function Home() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
      <div className="mb-20 bg-[#6CF8BB] p-1 text-[#64748B] rounded-full">
        <p> ✔️ Trusted by 10,000+ Skilled Professionals</p>
      </div>
      <div className="mb-10 flex flex-col gap-6">
        <h1 className="text-3xl text-[#00236F] font-bold">
          Find the Right Job.
        </h1>
        <h1 className="text-3xl text-[#006C49] font-bold">
          Hire the Right Skill.
        </h1>
      </div>
      <p>
        The premium marketplace for certified vocational talent and specialized
        industrial roles.-<br />Streamlined matching for construction, manufacturing, and technical services.
      </p>

      <div className="mt-10 flex gap-10">
        <Link className="bg-[#1E3A8A] hover:bg-[#00236F] hover:py-3 hover:px-8 py-2 px-7 rounded text-white font-bold" to="/Login">Find a Job 📢</Link>
        <Link className="border border-[#1E3A8A] text-[#1E3A8A]  py-2 px-7 rounded hover:bg-[#64748B] hover:text-white hover:py-3 hover:px-8" to="/Register">Post a Job ➕</Link>
      </div>
    </section>
  );
}
