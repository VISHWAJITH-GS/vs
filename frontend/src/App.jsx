import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import DashboardLayout from './layouts/DashboardLayout'
import Landing from './pages/Landing'
import Overview from './pages/Overview'
import Insights from './pages/Insights'
import Opportunities from './pages/Opportunities'
import Vault from './pages/Vault'
import Coach from './pages/Coach'
import { CareerProvider } from './context/CareerContext'

function App() {
  return (
    <BrowserRouter>
      <CareerProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="insights" element={<Insights />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="vault" element={<Vault />} />
            <Route path="coach" element={<Coach />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CareerProvider>
    </BrowserRouter>
  )
}

export default App
