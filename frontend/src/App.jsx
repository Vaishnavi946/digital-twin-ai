import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing    from './pages/Landing'
import Dashboard  from './pages/Dashboard'
import Simulate   from './pages/Simulate'
import Risk       from './pages/Risk'
import Predict    from './pages/Predict'
import Auth       from './pages/Auth'
import Goals      from './pages/Goals'
import Pricing    from './pages/Pricing'
import Chatbot    from './pages/Chatbot'
import Onboarding from './pages/Onboarding'
import XAI from './pages/XAI'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/auth"        element={<Auth />} />
        <Route path="/onboarding"  element={<Onboarding />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/simulate"    element={<Simulate />} />
        <Route path="/risk"        element={<Risk />} />
        <Route path="/predict"     element={<Predict />} />
        <Route path="/goals"       element={<Goals />} />
        <Route path="/pricing"     element={<Pricing />} />
        <Route path="/chat"        element={<Chatbot />} />
        <Route path="/xai" element={<XAI />} />
      </Routes>
    </BrowserRouter>
  )
}