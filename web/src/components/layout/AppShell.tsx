import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { MobileTabBar } from "./MobileTabBar"
import { Topbar } from "./Topbar"

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="relative md:ml-[260px]">
        <div className="pointer-events-none absolute right-0 top-0 -z-10 size-[600px] rounded-full bg-primary/5 blur-[120px]" />

        <Topbar />

        <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-8 md:px-10 md:pb-12 md:pt-10">
          <Outlet />
        </main>
      </div>

      <MobileTabBar />
    </div>
  )
}
