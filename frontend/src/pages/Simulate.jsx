import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals'], ['Chat', '/chat']]

export default function Simulate() {
  const navigate = useNavigate()
  const name = localStorage.getItem('dt_user_name') || 'User'
  const initial = name.charAt(0).toUpperCase()
  const savedProfile = JSON.parse(localStorage.getItem('dt_profile') || '{}')

  const [form, setForm] = useState({
    income:     savedProfile.monthly_income     || 85000,
    expenses:   savedProfile.monthly_expenses   || 42000,
    savings:    savedProfile.current_savings    || 320000,
    investment: savedProfile.monthly_investment || 8000,
    months:     60
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const runSimulation = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/simulate/run', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user_001', monthly_income: form.income, monthly_expenses: form.expenses, current_savings: form.savings, total_debt: savedProfile.total_debt || 150000, monthly_emi: savedProfile.monthly_emi || 12000, monthly_investment: form.investment, risk_appetite: savedProfile.risk_appetite || 'medium' })
      })
      const data = await res.json()
      setResult(data.data)
    } catch {
      const mock = Array.from({ length: form.months }, (_, i) => ({
        month: `M${i + 1}`,
        best:   Math.round(form.savings + (form.income - form.expenses + form.investment) * i * 1.12),
        median: Math.round(form.savings + (form.income - form.expenses + form.investment) * i * 0.95),
        worst:  Math.round(form.savings + (form.income - form.expenses + form.investment) * i * 0.72),
      }))
      setResult({
        best_case: mock[mock.length-1].best, median_case: mock[mock.length-1].median,
        worst_case: mock[mock.length-1].worst, bankruptcy_probability: 1.2,
        expected_1yr: mock[11].median, expected_3yr: mock[35]?.median,
        monthly_median: mock.map(m => m.median), _chartData: mock
      })
    }
    setLoading(false)
  }

  const chartData = result?._chartData || result?.monthly_median?.map((v, i) => ({
    month: `M${i + 1}`, median: Math.round(v), best: Math.round(v * 1.18), worst: Math.round(v * 0.75),
  })) || []

  const inputStyle = { background: '#0a0f1e', border: '1px solid #1e2a3a', borderRadius: '8px', color: 'white', padding: '10px 14px', fontSize: '14px', width: '100%', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/')}>🧠 Digital Twin</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {NAV.map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              style={{ background: path === '/simulate' ? '#1e3a5f' : 'transparent', color: path === '/simulate' ? '#60a5fa' : '#94a3b8', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
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
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>🔮 Future Simulator</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Your financial data is pre-filled from your profile. Adjust and run simulations.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', letterSpacing: '1px' }}>YOUR FINANCIAL PROFILE</div>
            {[
              { key: 'income',     label: 'Monthly Income (₹)' },
              { key: 'expenses',   label: 'Monthly Expenses (₹)' },
              { key: 'savings',    label: 'Current Savings (₹)' },
              { key: 'investment', label: 'Monthly Investment (₹)' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{f.label}</div>
                <input type="number" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: Number(e.target.value) })} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Simulation Horizon: {form.months} months</div>
              <input type="range" min={12} max={120} value={form.months} onChange={e => setForm({ ...form, months: Number(e.target.value) })} style={{ width: '100%', accentColor: '#3b82f6' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                <span>1 yr</span><span>5 yrs</span><span>10 yrs</span>
              </div>
            </div>
            <button onClick={runSimulation} disabled={loading}
              style={{ width: '100%', background: loading ? '#1e2a3a' : 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none', color: 'white', padding: '14px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px' }}>
              {loading ? '⏳ Calculating your futures...' : '🚀 Run Simulation'}
            </button>
          </div>

          <div>
            {!result ? (
              <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '80px', textAlign: 'center', color: '#334155' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Ready to simulate your future</div>
                <div style={{ fontSize: '14px' }}>Click Run Simulation to see your possible futures</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { label: 'Best Case',   value: `₹${result.best_case?.toLocaleString()}`,   color: '#34d399', icon: '🚀' },
                    { label: 'Most Likely', value: `₹${result.median_case?.toLocaleString()}`, color: '#60a5fa', icon: '📊' },
                    { label: 'Worst Case',  value: `₹${result.worst_case?.toLocaleString()}`,  color: '#f87171', icon: '⚠️' },
                  ].map(c => (
                    <div key={c.label} style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: c.color }}>{c.value}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '6px' }}>{c.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', letterSpacing: '1px' }}>SAVINGS TRAJECTORY OVER TIME</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                      <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} interval={Math.floor(chartData.length / 6)} />
                      <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={v => `₹${v?.toLocaleString()}`} contentStyle={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '8px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="best"   stroke="#34d399" strokeWidth={2} dot={false} name="Best Case" />
                      <Line type="monotone" dataKey="median" stroke="#60a5fa" strokeWidth={2} dot={false} name="Median" />
                      <Line type="monotone" dataKey="worst"  stroke="#f87171" strokeWidth={2} dot={false} name="Worst Case" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { label: 'Expected in 1 Year',  value: `₹${result.expected_1yr?.toLocaleString()}` },
                    { label: 'Expected in 3 Years', value: `₹${result.expected_3yr?.toLocaleString()}` },
                    { label: 'Bankruptcy Risk',     value: `${result.bankruptcy_probability?.toFixed(1)}%` },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#e2e8f0' }}>{s.value}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}