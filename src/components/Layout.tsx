import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Sparkles, History, Github } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const navItems = [
    { to: '/generate', label: 'Generate', icon: Sparkles },
    { to: '/history', label: 'History', icon: History },
  ]

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-neutral-900 text-white">
        <div className="px-6 py-6 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">ContentForge</h1>
              <p className="text-xs text-neutral-400">AI Content Generator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive || location.pathname.startsWith(to + '/')
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 leading-relaxed">
            Built for automated content creation.
            <br />
            Powered by Balaram varma
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">ContentForge</span>
        </div>
        <nav className="flex gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 md:pt-0 pt-14 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
          <Outlet />
        </div>
        {/* Footer credit */}
        <footer className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 text-center">
          <p className="text-xs text-neutral-500">
            Built for automated content creation. Powered by Balaram varma
          </p>
        </footer>
      </main>
    </div>
  )
}
