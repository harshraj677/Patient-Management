import { LayoutDashboard, Users, X, Activity } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../lib/utils'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn('fixed inset-0 z-30 bg-slate-900/40 lg:hidden', open ? 'block' : 'hidden')}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        data-sidebar-closed={!open}
        aria-label="Main navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[min(16rem,85vw)] flex-col border-r border-slate-200 bg-white shadow-xl transition-[transform,visibility] duration-200 lg:w-64 lg:shadow-none',
          'lg:visible lg:static lg:translate-x-0',
          // When closed on small screens the drawer is also removed from the tab order
          open ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-slate-900">DScribe</p>
              <p className="text-xs text-slate-500">Patient Admissions</p>
            </div>
          </div>
          <button
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4 text-xs text-slate-400">© {new Date().getFullYear()} DScribe</div>
      </aside>
    </>
  )
}
