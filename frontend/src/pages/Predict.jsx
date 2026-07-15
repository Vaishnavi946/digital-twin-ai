import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const API = import.meta.env.VITE_API_URL;

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals'], ['Chat', '/chat']]

export default function Predict() {
  const navigate = useNavigate()
  const name = localStorage.getItem('dt_user_name') || 'User'
  const initial = name.charAt(0).toUpperCase()
  const savedProfile = JSON.parse(localStorage.getItem('dt_profile') || '{}')

  const [form, setForm] = useState({
    income:     savedProfile.monthly_income     || 85000,
    expenses:   savedProfile.monthly_expenses   || 42000,
    savings:    savedProfile.current_savings    || 320000,
    investment: savedProfile.monthly_investment || 8000,
    months:     36
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const runPrediction = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/predict/savings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user_001', monthly_income: form.income, monthly_expenses: form.expenses, current_savings: form.savings, total_debt: savedProfile.total_debt || 150000, monthly_emi: savedProfile.monthly_emi || 12000, monthly_investment: form.investment, risk_appetite: savedProfile.risk_appetite || 'medium' })
      })
      const data = await res.json()
      setResult(data.data)
    } catch {
      const net = form.income - form.expenses + form.investment
      const months = Array.from({ length: form.months }, (_, i) => {
        const growth = 1 + (0.008 * i)
        return {
          month: new Date(2025, i, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          predicted: Math.round(form.savings + net * i * growth),
          upper:     Math.round(form.savings + net * i * growth * 1.15),
          lower:     Math.round(form.savings + net * i * growth * 0.85),
        }
      })
      setResult({ predicted: months[months.length-1].predicted, upper: months[months.length-1].upper, lower: months[months.length-1].lower, _chart: months })
    }
    setLoading(false)
  }

  const chartData = result?._chart || result?.monthly_forecast?.map(m => ({
    month: m.month, predicted: Math.round(m.value || m.predicted),
    upper: Math.round((m.value || m.predicted) * 1.15), lower: Math.round((m.value || m.predicted) * 0.85),
  })) || []

  const growth = result ? (((result.predicted - form.savings) / form.savings) * 100).toFixed(1) : 0
  const inputStyle = { background: '#0a0f1e', border: '1px solid #1e2a3a', borderRadius: '8px', color: 'white', padding: '10px 14px', fontSize: '14px', width: '100%', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/')}>🧠 Digital Twin</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {NAV.map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              style={{ background: path === '/predict' ? '#1e3a5f' : 'transparent', color: path === '/predict' ? '#60a5fa' : '#94a3b8', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{initial}</div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>{name}</span>
          <button onClick={() => { localStorage.removeItem('dt_user_name'); localStorage.removeItem('dt_profile'); localStorage.removeItem('dt_token'); navigate('/auth') }}
            style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 48px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>📈 Savings Forecast</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Your data is pre-filled from your profile. See where your savings will be in 1, 3 or 5 years.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', letterSpacing: '1px' }}>YOUR PROFILE</div>
            {[
              { key: 'income',     label: 'Monthly Income (₹)' },
              { key: 'expenses',   label: 'Monthly Expenses (₹)' },
              { key: 'savings',    label: 'Current Savings (₹)' },
              { key: 'investment', label: 'Monthly Investment (₹)' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{f.label}</div>
                <input type="number" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: Number(e.target.value) })} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Forecast Period: {form.months} months</div>
              <input type="range" min={12} max={60} value={form.months} onChange={e => setForm({ ...form, months: Number(e.target.value) })} style={{ width: '100%', accentColor: '#7c3aed' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                <span>1 yr</span><span>3 yrs</span><span>5 yrs</span>
              </div>
            </div>
            <button onClick={runPrediction} disabled={loading}
              style={{ width: '100%', background: loading ? '#1e2a3a' : 'linear-gradient(135deg, #7c3aed, #2563eb)', border: 'none', color: 'white', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
              {loading ? '⏳ Calculating...' : '📊 Run Forecast'}
            </button>
          </div>

          {!result ? (
            <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '80px', textAlign: 'center', color: '#334155' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Ready to forecast your savings</div>
              <div style={{ fontSize: '14px' }}>Click Run Forecast to see your projection</div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Projected Savings', value: `₹${result.predicted?.toLocaleString()}`, color: '#a78bfa', icon: '🎯' },
                  { label: 'Optimistic Case',   value: `₹${result.upper?.toLocaleString()}`,     color: '#34d399', icon: '🚀' },
                  { label: 'Conservative Case', value: `₹${result.lower?.toLocaleString()}`,     color: '#60a5fa', icon: '📊' },
                ].map(c => (
                  <div key={c.label} style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: c.color }}>{c.value}</div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '6px' }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', letterSpacing: '1px' }}>SAVINGS FORECAST</div>
                  <div style={{ background: '#1e2a3a', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#a78bfa' }}>+{growth}% projected growth</div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="upperGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="lowerGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} interval={Math.floor(chartData.length / 6)} />
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                    <Tooltip formatter={v => `₹${v?.toLocaleString()}`} contentStyle={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="upper"     stroke="#34d399" fill="url(#upperGrad)" strokeWidth={1.5} name="Optimistic" />
                    <Area type="monotone" dataKey="predicted" stroke="#a78bfa" fill="url(#predGrad)"  strokeWidth={2.5} name="Projected" />
                    <Area type="monotone" dataKey="lower"     stroke="#60a5fa" fill="url(#lowerGrad)" strokeWidth={1.5} name="Conservative" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '36px' }}>📌</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#a78bfa', marginBottom: '4px' }}>Forecast Summary</div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                    Based on your profile, your savings are projected to grow by <strong style={{ color: '#a78bfa' }}>{growth}%</strong> over {form.months} months.
                    {growth > 50 ? ' You are on a strong financial trajectory.' : ' Consider increasing your monthly investment to accelerate growth.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}