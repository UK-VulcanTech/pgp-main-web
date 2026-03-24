const ContactSection = () => {
  return (
    <section className="bg-[#F3F3F3] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* LEFT CONTENT */}
        <div className="max-w-xl">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="text-[#E0B100] block">Let’s Build</span>
            <span className="text-[#1F2D3D]">What lasts.</span>
          </h2>

          <p className="mt-8 text-lg text-gray-600 leading-relaxed">
            Whether you’re structuring a partnership, delivering an
            infrastructure program, or modernizing operations with technology,
            PGP can help bring clarity, governance, and execution to your
            initiative.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full max-w-md ml-auto">
          <form className="flex flex-col gap-6">
            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name/organization/email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20"
              />
            </div>

            {/* SECTOR */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sector of interest
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20">
                <option>Select your sector of interest</option>
                <option>Infrastructure</option>
                <option>Technology</option>
                <option>Energy</option>
              </select>
            </div>

            {/* COUNTRY */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country/Region
              </label>
              <input
                type="text"
                placeholder="Enter your Country/Region"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                rows="4"
                placeholder="Write Project description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20 resize-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="mt-4 bg-[#1F2D3D] text-white py-4 text-sm tracking-widest font-semibold uppercase hover:opacity-90 transition"
            >
              Request a Consultation
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
