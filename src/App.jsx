import { Routes, Route, Navigate } from 'react-router-dom'
import { StudentProvider } from './context/StudentContext'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AppLayout from './components/AppLayout'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  return <StudentProvider><Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route element={<AppLayout/>}>
      <Route path="/dashboard" element={<DashboardPage/>}/>
      {['careers','assessment','skill-gaps','roadmap','passport','compare','projects','progress','settings'].map(path=><Route key={path} path={`/${path}`} element={<PlaceholderPage/>}/>)}
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></StudentProvider>
}
export default App