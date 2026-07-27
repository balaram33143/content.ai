import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/generate" replace />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Route>
    </Routes>
  )
}
