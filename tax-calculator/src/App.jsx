import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TaxCenter from './pages/TaxCenter'
import TaxCalculator from './pages/TaxCalculator'
import PlaceholderPage from './pages/PlaceholderPage'
import analyticsIcon from './assets/analytics-icon.png'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TaxCenter />} />
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route
            path="/reports"
            element={
              <PlaceholderPage
                title="Reports"
                icon="📈"
                description="Reporting is on the roadmap next."
              />
            }
          />
          <Route
            path="/documents"
            element={
              <PlaceholderPage
                title="Documents"
                icon="📄"
                description="Document upload and tracking will land here."
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <PlaceholderPage
                title="Analytics"
                iconImage={analyticsIcon}
                description="More detailed charts and trends are coming."
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings"
                icon="⚙️"
                description="Preferences and account settings are coming soon."
              />
            }
          />
          <Route
            path="/help"
            element={
              <PlaceholderPage
                title="Help & Support"
                icon="❓"
                description="Help docs and support links are coming soon."
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
