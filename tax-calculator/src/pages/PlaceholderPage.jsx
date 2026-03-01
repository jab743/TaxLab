function PlaceholderPage({ title, icon, iconImage, description }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="text-5xl">
          {iconImage ? (
            <img src={iconImage} alt={`${title} icon`} className="h-16 w-16 object-contain" />
          ) : (
            icon
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-600">{description || 'This feature is coming soon!'}</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-12 sm:p-16 shadow-lg border border-gray-200 dark:border-slate-700 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-[200px]">🚧</div>
          </div>
          <div className="relative">
            <div className="text-7xl mb-6 animate-bounce inline-block">🚧</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Under Construction
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              This section is still in progress. I left the route in place so the app structure is
              ready for future features to be added.
            </p>
            <div className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer">
              <span>📅</span>
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderPage
