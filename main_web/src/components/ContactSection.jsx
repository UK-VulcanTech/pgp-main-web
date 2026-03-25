import { useState } from "react";
import { useContactPage, useContactSubmit } from "../hooks/usePublicApi";

export default function ContactSection() {
  const { data, isLoading, isError } = useContactPage();
  const mutation = useContactSubmit();
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setDone(false);
    try {
      await mutation.mutateAsync({
        name,
        sector,
        country,
        project_description: projectDescription,
      });
      setDone(true);
      setName("");
      setSector("");
      setCountry("");
      setProjectDescription("");
    } catch {
      /* mutation.isError */
    }
  }

  if (isLoading) {
    return (
      <section className="bg-[#F3F3F3] py-20 px-6 md:px-12">
        <p className="text-center text-gray-500 text-sm">Loading…</p>
      </section>
    );
  }
  if (isError || !data) {
    return (
      <section className="bg-[#F3F3F3] py-20 px-6 md:px-12">
        <p className="text-center text-gray-600">Contact form could not be loaded.</p>
      </section>
    );
  }

  const options = data.sector_options || [];

  return (
    <section className="bg-[#F3F3F3] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className="max-w-xl">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="text-[#E0B100] block">{data.headline_gold || ""}</span>
            <span className="text-[#1F2D3D]">{data.headline_dark || ""}</span>
          </h2>
          <p className="mt-8 text-lg text-gray-600 leading-relaxed">{data.intro || ""}</p>
        </div>

        <div className="w-full max-w-md ml-auto">
          <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name/organization/email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sector of interest</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20"
              >
                <option value="">Select your sector of interest</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Country/Region</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter your Country/Region"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description</label>
              <textarea
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Write Project description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2D3D]/20 resize-none"
              />
            </div>
            {mutation.isError && (
              <p className="text-sm text-red-600">Something went wrong. Please try again or email us directly.</p>
            )}
            {done && <p className="text-sm text-green-700">Thank you — we received your message.</p>}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-4 bg-[#1F2D3D] text-white py-4 text-sm tracking-widest font-semibold uppercase hover:opacity-90 transition disabled:opacity-60"
            >
              {mutation.isPending ? "Sending…" : data.submit_label || "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
