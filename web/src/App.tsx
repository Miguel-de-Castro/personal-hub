import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { Dashboard } from "@/pages/Dashboard"
import { Tasks } from "@/pages/Tasks"
import { Learning } from "@/pages/Learning"
import { Jobs } from "@/pages/Jobs"
import { Log } from "@/pages/Log"
import { Settings } from "@/pages/Settings"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="learning" element={<Learning />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="log" element={<Log />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
