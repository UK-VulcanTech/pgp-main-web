import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  Compass,
  MessageSquare,
  Layers,
  GraduationCap,
  Rocket,
  Briefcase,
  Settings,
  LogOut,
  Inbox,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  {
    section: "Pages",
    items: [
      { to: "/home", label: "Home", icon: Home },
      { to: "/about", label: "About", icon: Info },
      { to: "/approach", label: "Approach", icon: Compass },
      { to: "/contact-page", label: "Contact", icon: MessageSquare },
      { to: "/solutions-page", label: "Solutions hub", icon: Layers },
      { to: "/training-page", label: "Training hub", icon: GraduationCap },
      { to: "/digital-fast-track", label: "Digital Fast Track", icon: Rocket },
    ],
  },
  {
    section: "Collections",
    items: [
      { to: "/solutions", label: "Solutions (sectors)", icon: Briefcase },
      { to: "/training", label: "Training programs", icon: GraduationCap },
    ],
  },
  {
    section: "System",
    items: [
      { to: "/submissions", label: "Form submissions", icon: Inbox },
      { to: "/site", label: "Site settings", icon: Settings },
    ],
  },
];

export default function Shell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex bg-paper text-ink">
      {/* sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-navy text-white flex flex-col border-r border-navy-2 transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform`}
      >
        <Link to="/" className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-semibold">
            PGP
          </div>
          <div>
            <div className="font-semibold leading-tight">PGP CMS</div>
            <div className="text-[11px] uppercase tracking-wider text-white/50">
              Content management
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV.map((sect) => (
            <div key={sect.section} className="mb-6">
              <div className="px-2 text-[10px] uppercase tracking-[0.16em] text-white/40 mb-2">
                {sect.section}
              </div>
              <div className="flex flex-col gap-0.5">
                {sect.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-white/10 text-white font-medium"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    <item.icon size={16} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1">
            Signed in as
          </div>
          <div className="text-sm font-medium truncate">{user?.username}</div>
          <button
            onClick={onLogout}
            className="mt-3 flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-10 bg-paper/85 backdrop-blur border-b border-divider px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded hover:bg-divider"
          >
            <Menu size={18} />
          </button>
          <span className="font-semibold">PGP CMS</span>
        </header>
        <main className="flex-1 min-w-0 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
