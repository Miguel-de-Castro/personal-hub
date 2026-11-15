import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ListChecks,
  GraduationCap,
  Briefcase,
  History,
  Settings,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/learning", label: "Learning", icon: GraduationCap },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/log", label: "Log", icon: History },
]

const footerNav = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/support", label: "Support", icon: HelpCircle },
]

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 px-6 py-3 font-label text-xs tracking-wide transition-colors duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
        )
      }
    >
      {({ isActive }) =>
        isActive ? (
          <>
            <span className="absolute left-0 h-6 w-1 rounded-r bg-primary" />
            <Icon className="size-4.5" />
            <span>{label}</span>
          </>
        ) : (
          <>
            <Icon className="size-4.5" />
            <span>{label}</span>
          </>
        )
      }
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-[260px] flex-col border-r border-white/10 bg-sidebar py-6 shadow-xl backdrop-blur-xl md:flex">
      <div className="mb-10 px-6">
        <h1 className="text-xl font-semibold text-foreground">Personal Hub</h1>
        <p className="font-label text-xs uppercase tracking-widest text-muted-foreground opacity-60">
          Productivity Portal
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {mainNav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/5 pt-6">
        {footerNav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="mt-4 flex items-center gap-3 px-6">
          <Avatar className="size-8 border border-white/10">
            <AvatarImage src="" alt="You" />
            <AvatarFallback>YOU</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-label text-xs text-foreground">You</p>
            <p className="text-[10px] text-muted-foreground">Personal Hub</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
