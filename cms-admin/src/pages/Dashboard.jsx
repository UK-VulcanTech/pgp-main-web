import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Home as HomeIcon,
  Info,
  Compass,
  MessageSquare,
  Layers,
  GraduationCap,
  Rocket,
  Briefcase,
  Inbox,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cms } from "../api/client";

const TILES = [
  { to: "/home", label: "Home page", icon: HomeIcon, color: "bg-blue-50 text-blue-700" },
  { to: "/about", label: "About", icon: Info, color: "bg-purple-50 text-purple-700" },
  { to: "/approach", label: "Approach", icon: Compass, color: "bg-emerald-50 text-emerald-700" },
  { to: "/contact-page", label: "Contact", icon: MessageSquare, color: "bg-amber-50 text-amber-700" },
  { to: "/solutions-page", label: "Solutions hub", icon: Layers, color: "bg-rose-50 text-rose-700" },
  { to: "/training-page", label: "Training hub", icon: GraduationCap, color: "bg-indigo-50 text-indigo-700" },
  { to: "/digital-fast-track", label: "Digital Fast Track", icon: Rocket, color: "bg-cyan-50 text-cyan-700" },
  { to: "/site", label: "Site settings", icon: Settings, color: "bg-stone-100 text-stone-700" },
];

export default function Dashboard() {
  const { data: solutions = [] } = useQuery({
    queryKey: ["manage", "/solutions/"],
    queryFn: () => cms.get("/solutions/").then((r) => r.data),
  });
  const { data: trainings = [] } = useQuery({
    queryKey: ["manage", "/training-areas/"],
    queryFn: () => cms.get("/training-areas/").then((r) => r.data),
  });
  const { data: submissions = [] } = useQuery({
    queryKey: ["manage", "/submissions/"],
    queryFn: () => cms.get("/submissions/").then((r) => r.data),
  });

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <header className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">
          Dashboard
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">What would you like to edit?</h1>
        <p className="text-sm text-ink-soft mt-1.5 max-w-prose">
          Pages here drive{" "}
          <a
            href="https://staging.peakglobalpartners.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary inline-flex items-center gap-1 hover:underline"
          >
            staging.peakglobalpartners.com <ExternalLink size={12} />
          </a>
          . Saves are live as soon as you hit save.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-ink-muted mb-3">
          Pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="bg-white rounded-xl border border-divider shadow-sm hover:shadow-md hover:border-border transition p-4"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.color}`}>
                <t.icon size={18} />
              </div>
              <div className="mt-3 font-medium">{t.label}</div>
              <div className="text-xs text-ink-muted mt-1">Edit content</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-10">
        <SummaryCard
          to="/solutions"
          icon={Briefcase}
          label="Solutions"
          value={solutions.length}
          unit="sectors"
        />
        <SummaryCard
          to="/training"
          icon={GraduationCap}
          label="Training programs"
          value={trainings.length}
          unit="programs"
        />
        <SummaryCard
          to="/submissions"
          icon={Inbox}
          label="Form submissions"
          value={submissions.length}
          unit="received"
          accent="bg-blue-50 text-blue-700"
        />
      </section>
    </div>
  );
}

function SummaryCard({ to, icon: Icon, label, value, unit, accent = "bg-stone-100 text-stone-700" }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl border border-divider shadow-sm hover:shadow-md hover:border-border transition p-5 flex items-center gap-4"
    >
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accent}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider text-ink-muted">{label}</div>
        <div className="font-semibold text-2xl">
          {value}{" "}
          <span className="text-sm font-normal text-ink-muted">{unit}</span>
        </div>
      </div>
    </Link>
  );
}
