import { useNavigate } from 'react-router-dom'
import analyticsIcon from '../assets/analytics-icon.png'
import calculationsIcon from '../assets/tax-calculations.png'
import taxBandIcon from '../assets/tax-band.png'
import taxCalculatorIcon from '../assets/tax-calculator.png'

function TaxCenter() {
  const navigate = useNavigate()

  const tiles = [
    {
      id: 1,
      title: 'Tax Calculator',
      description: 'Calculate income tax based on salary and tax bands',
      iconImage: taxCalculatorIcon,
      gradient: 'from-blue-500 to-blue-600',
      path: '/tax-calculator',
      stats: 'Most Used',
      statsColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      title: 'Reports',
      description: 'View and generate financial reports',
      icon: '📈',
      gradient: 'from-emerald-500 to-emerald-600',
      path: '/reports',
      stats: 'Coming Soon',
      statsColor: 'bg-gray-100 text-gray-600',
    },
    {
      id: 3,
      title: 'Documents',
      description: 'Manage tax documents and files',
      icon: '📄',
      gradient: 'from-amber-500 to-amber-600',
      path: '/documents',
      stats: 'Coming Soon',
      statsColor: 'bg-gray-100 text-gray-600',
    },
    {
      id: 4,
      title: 'Analytics',
      description: 'View detailed financial analytics',
      iconImage: analyticsIcon,
      gradient: 'from-purple-500 to-purple-600',
      path: '/analytics',
      stats: 'Coming Soon',
      statsColor: 'bg-gray-100 text-gray-600',
    },
    {
      id: 5,
      title: 'Settings',
      description: 'Configure your portal preferences',
      icon: '⚙️',
      gradient: 'from-slate-500 to-slate-600',
      path: '/settings',
      stats: 'Coming Soon',
      statsColor: 'bg-gray-100 text-gray-600',
    },
    {
      id: 6,
      title: 'Help & Support',
      description: 'Get help and access documentation',
      icon: '❓',
      gradient: 'from-pink-500 to-rose-600',
      path: '/help',
      stats: 'Coming Soon',
      statsColor: 'bg-gray-100 text-gray-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Tax Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            Your home base for tax tools, insights, and upcoming features.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            iconImage: calculationsIcon,
            value: '0',
            label: 'Calculations Today',
            color: 'emerald',
          },
          { icon: '📋', value: '0', label: 'Reports Generated', color: 'purple' },
          {
            iconImage: taxBandIcon,
            value: '4',
            label: 'Tax Bands Loaded',
            color: 'amber',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stat.value}</p>
              </div>
              {stat.iconImage ? (
                <img
                  src={stat.iconImage}
                  alt={`${stat.label} icon`}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <div className="text-3xl opacity-80">{stat.icon}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tiles Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              onClick={() => navigate(tile.path)}
              className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-slate-500 cursor-pointer transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tile.gradient} flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {tile.iconImage ? (
                      <img
                        src={tile.iconImage}
                        alt={`${tile.title} icon`}
                        className="h-9 w-9 object-contain"
                      />
                    ) : (
                      tile.icon
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${tile.statsColor}`}
                  >
                    {tile.stats}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {tile.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                  {tile.description}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-300 font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Open</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaxCenter
