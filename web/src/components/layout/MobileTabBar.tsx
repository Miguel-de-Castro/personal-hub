import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ListChecks,
  GraduationCap,
  Briefcase,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/learning", label: "Learning", icon: GraduationCap },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/log", label: "Log", icon: History },
]

export function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-white/10 bg-sidebar backdrop-blur-xl md:hidden">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-label",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
