import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')

    if (mode === 'signup') {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill in all fields.'); return
      }
      if (form.password !== form.confirm) {
        setError('Passwords do not match.'); return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.'); return
      }
    } else {
      if (!form.email || !form.password) {
        setError('Please enter your email and password.'); return
      }
    }

    setLoading(true)

    try {
      const endpoint = mode === 'signup'
        ? 'http://localhost:8000/api/auth/signup'
        : 'http://localhost:8000/api/auth/login'

      const body = mode === 'signup'
        ? { full_name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // Save token and user info
      localStorage.setItem('dt_token', data.access_token)
      localStorage.setItem('dt_user_name', data.user.full_name)
      localStorage.setItem('dt_user_email', data.user.email)
      localStorage.setItem('dt_user_id', data.user.id)

      // On login — fetch and restore saved profile from backend
      if (mode === 'login') {
        try {
          const profileRes = await fetch('http://localhost:8000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${data.access_token}` }
          })
          const profileData = await profileRes.json()
          if (profileData.monthly_income) {
            localStorage.setItem('dt_profile', JSON.stringify({
              monthly_income:     profileData.monthly_income,
              monthly_expenses:   profileData.monthly_expenses,
              current_savings:    profileData.current_savings,
              total_debt:         profileData.total_debt,
              monthly_emi:        profileData.monthly_emi,
              monthly_investment: profileData.monthly_investment,
              risk_appetite:      profileData.risk_appetite,
            }))
          }
        } catch {
          // Use whatever is in localStorage already
        }
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
      }

    } catch {
      setError('Cannot connect to server. Make sure the backend is running on port 8000.')
    }

    setLoading(false)
  }

  const handleGoogle = () => {
    localStorage.setItem('dt_user_name', 'Demo User')
    localStorage.setItem('dt_user_email', 'demo@digitaltwin.com')
    navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%', background: '#0a0f1e', border: '1px solid #1e2a3a',
    borderRadius: '10px', color: 'white', padding: '13px 16px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/')}>
          🧠 Digital Twin
        </div>
        <div style={{ color: '#64748b', fontSize: '14px' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '20px', padding: '40px' }}>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                {mode === 'login' ? '👋' : '🚀'}
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                {mode === 'login'
                  ? 'Log in to access your financial dashboard'
                  : 'Start planning your financial future today'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {mode === 'signup' && (
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Full Name</div>
                  <input type="text" placeholder="Your full name"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                </div>
              )}

              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Email Address</div>
                <input type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Password</div>
                <input type="password" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
              </div>

              {mode === 'signup' && (
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Confirm Password</div>
                  <input type="password" placeholder="••••••••"
                    value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                </div>
              )}

              {error && (
                <div style={{ background: '#1a0f0f', border: '1px solid #3d1f1f', borderRadius: '8px', padding: '10px 14px', color: '#f87171', fontSize: '13px' }}>
                  ⚠️ {error}
                </div>
              )}

              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                  <span style={{ color: '#60a5fa', fontSize: '13px', cursor: 'pointer' }}>Forgot password?</span>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading}
                style={{ width: '100%', border: 'none', color: 'white', padding: '14px', borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px', marginTop: '4px',
                  background: loading ? '#1e2a3a' : 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                {loading ? '⏳ Please wait...' : mode === 'login' ? '🔐 Log In' : '🚀 Create Account'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#1e2a3a' }} />
                <span style={{ color: '#475569', fontSize: '12px' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: '#1e2a3a' }} />
              </div>

              <button onClick={handleGoogle}
                style={{ width: '100%', background: '#0a0f1e', border: '1px solid #1e2a3a', color: '#e2e8f0', padding: '13px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#334155'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2a3a'}>
                <span style={{ fontSize: '18px' }}>G</span> Continue with Google
              </button>
            </div>

            {mode === 'signup' && (
              <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', marginTop: '20px', lineHeight: '1.6' }}>
                By signing up you agree to our Terms of Service and Privacy Policy.
              </p>
            )}
          </div>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: '14px', marginTop: '24px' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }}>
              {mode === 'login' ? 'Sign up free' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}