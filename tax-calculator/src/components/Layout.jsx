import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import analyticsIcon from '../assets/analytics-icon.png'
import taxCenterIcon from '../assets/tax-center.png'
import taxCalculatorIcon from '../assets/tax-calculator.png'
import headerTaxIcon from '../assets/header-tax.png'

function Layout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const savedTheme = window.localStorage.getItem('taxlab-theme')
    const prefersDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    return savedTheme ? savedTheme === 'dark' : prefersDark
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    window.localStorage.setItem('taxlab-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const navItems = [
    { path: '/', label: 'Tax Center', iconImage: taxCenterIcon },
    { path: '/tax-calculator', label: 'Tax Calculator', iconImage: taxCalculatorIcon },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/analytics', label: 'Analytics', iconImage: analyticsIcon },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl sticky top-0 z-50 border-b border-blue-800">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <img src={headerTaxIcon} alt="TaxLab icon" className="h-9 w-9 object-contain" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">TaxLab Portal</h1>
                <p className="text-xs text-blue-100 hidden sm:block">Financial Tax Calculator</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium transition-colors"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-sm font-medium">Demo User</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-semibold text-sm backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
              DU
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 overflow-y-auto
          transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        `}
        >
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 -z-10"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <nav className="py-4">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider px-3">
                Navigation
              </p>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-6 py-3 mx-2 rounded-lg
                  transition-all duration-200 group relative overflow-hidden
                  ${
                    location.pathname === item.path
                      ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                      : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-300'
                  }
                `}
              >
                {location.pathname === item.path && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                )}
                <span className="text-xl transition-transform group-hover:scale-110">
                  {item.iconImage ? (
                    <img
                      src={item.iconImage}
                      alt={`${item.label} icon`}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    item.icon
                  )}
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700 bg-gradient-to-t from-gray-50 dark:from-slate-800">
            <div className="text-xs text-gray-500 dark:text-slate-400 text-center">
              <p className="font-semibold text-gray-700 dark:text-slate-200">Version 1.0.0</p>
              <p className="mt-1">© 2026 TaxLab Portal</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
