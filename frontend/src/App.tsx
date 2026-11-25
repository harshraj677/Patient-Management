import { Activity, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Sidebar } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const pageTitle = pathname.startsWith('/patients') ? 'Patients' : 'Dashboard'

  // Close the mobile drawer with the Escape key
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button className="-ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-600 text-white">
            <Activity className="h-4 w-4" />
          </div>
          <span className="hidden font-bold text-slate-900 min-[400px]:inline">DScribe</span>
          <span className="hidden text-slate-300 min-[400px]:inline">/</span>
          <h2 className="min-w-0 truncate text-sm font-semibold text-slate-700">{pageTitle}</h2>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  )
}
