import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals'], ['Chat', '/chat']]

export default function Risk() {
  const navigate = useNavigate()
  const name = localStorage.getItem('dt_user_name') || 'User'
  const initial = name.charAt(0).toUpperCase()
  const savedProfile = JSON.parse(localStorage.getItem('dt_profile') || '{}')

  const [form, setForm] = useState({
    income:   savedProfile.monthly_income   || 85000,
    expenses: savedProfile.monthly_expenses || 42000,
    savings:  savedProfile.current_savings  || 320000,
    debt:     savedProfile.total_debt       || 150000,
    emi:      savedProfile.monthly_emi      || 12000,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const runRisk = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/finance/risk-score', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user_001', monthly_income: form.income, monthly_expenses: form.expenses, current_savings: form.savings, total_debt: form.debt, monthly_emi: form.emi, monthly_investment: savedProfile.monthly_investment || 8000, risk_appetite: savedProfile.risk_appetite || 'medium' })
      })
      const data = await res.json()
      setResult(data.data)
    } catch {
      const dti = ((form.emi / form.income) * 100)
      const savingsRate = (((form.income - form.expenses) / form.income) * 100)
      const emergencyMonths = form.savings / form.expenses
      let score = 100
      if (dti > 50) score -= 30; else if (dti > 30) score -= 15
      if (savingsRate < 0) score -= 40; else if (savingsRate < 10) score -= 20; else if (savingsRate < 20) score -= 10
      if (emergencyMonths < 1) score -= 20; else if (emergencyMonths < 3) score -= 10; else if (emergencyMonths < 6) score -= 5
      const flags = []
      if (dti > 40) flags.push('High debt load — EMIs consuming too much income')
      if (savingsRate < 10) flags.push('Low savings rate — review monthly expenses')
      if (emergencyMonths < 3) flags.push('Emergency fund critically low')
      setResult({ risk_score: Math.max(0, score), risk_level: score < 40 ? 'critical' : score < 60 ? 'high' : score < 80 ? 'medium' : 'low', debt_to_income_ratio: dti.toFixed(1), savings_rate: savingsRate.toFixed(1), emergency_months: emergencyMonths.toFixed(1), flags })
    }
    setLoading(false)
  }

  const score = result?.risk_score || 0
  const scoreColor = score > 75 ? '#34d399' : score > 55 ? '#fbbf24' : '#f87171'
  const radarData = result ? [
    { metric: 'Savings Rate',     value: Math.min(100, result.savings_rate * 2) },
    { metric: 'Debt Control',     value: Math.max(0, 100 - result.debt_to_income_ratio * 2) },
    { metric: 'Emergency Fund',   value: Math.min(100, (result.emergency_months / 6) * 100) },
    { metric: 'Income Stability', value: 75 },
    { metric: 'Investment Rate',  value: 60 },
  ] : []

  const inputStyle = { background: '#0a0f1e', border: '1px solid #1e2a3a', borderRadius: '8px', color: 'white', padding: '10px 14px', fontSize: '14px', width: '100%', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/')}>🧠 Digital Twin</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {NAV.map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              style={{ background: path === '/risk' ? '#1e3a5f' : 'transparent', color: path === '/risk' ? '#60a5fa' : '#94a3b8', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
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
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>⚠️ Risk Intelligence</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Your data is pre-filled from your profile. Adjust and analyse your risk.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', letterSpacing: '1px' }}>FINANCIAL DATA</div>
            {[
              { key: 'income',   label: 'Monthly Income (₹)' },
              { key: 'expenses', label: 'Monthly Expenses (₹)' },
              { key: 'savings',  label: 'Current Savings (₹)' },
              { key: 'debt',     label: 'Total Debt (₹)' },
              { key: 'emi',      label: 'Monthly EMI (₹)' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{f.label}</div>
                <input type="number" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: Number(e.target.value) })} style={inputStyle} />
              </div>
            ))}
            <button onClick={runRisk} disabled={loading}
              style={{ width: '100%', background: loading ? '#1e2a3a' : 'linear-gradient(135deg, #d97706, #ef4444)', border: 'none', color: 'white', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginTop: '8px' }}>
              {loading ? '⏳ Analysing...' : '🔍 Analyse Risk'}
            </button>
          </div>

          {!result ? (
            <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '80px', textAlign: 'center', color: '#334155' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Ready to analyse your risk</div>
              <div style={{ fontSize: '14px' }}>Click Analyse Risk to get your score</div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: '#0f1829', border: `1px solid ${scoreColor}40`, borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px', letterSpacing: '1px' }}>RISK SCORE</div>
                  <div style={{ fontSize: '80px', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>{score}</div>
                  <div style={{ color: scoreColor, fontWeight: '700', fontSize: '16px', marginTop: '8px' }}>
                    {result.risk_level === 'low' ? '✅ Low Risk' : result.risk_level === 'medium' ? '⚠️ Medium Risk' : result.risk_level === 'high' ? '🔶 High Risk' : '🔴 Critical'}
                  </div>
                  <div style={{ marginTop: '16px', background: '#0a0f1e', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, background: `linear-gradient(90deg, #f87171, ${scoreColor})`, borderRadius: '8px', transition: 'width 1.2s' }} />
                  </div>
                </div>
                <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>RISK PROFILE RADAR</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1e2a3a" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Radar dataKey="value" stroke={scoreColor} fill={scoreColor} fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                {[
                  { label: 'Debt-to-Income', value: `${result.debt_to_income_ratio}%`, good: result.debt_to_income_ratio < 30, tip: 'Ideal < 30%' },
                  { label: 'Savings Rate',   value: `${result.savings_rate}%`,          good: result.savings_rate > 20,         tip: 'Ideal > 20%' },
                  { label: 'Emergency Fund', value: `${result.emergency_months} mo`,    good: result.emergency_months >= 6,     tip: 'Ideal 6 months' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#0f1829', border: `1px solid ${m.good ? '#16423c' : '#3d1f1f'}`, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '26px', fontWeight: '800', color: m.good ? '#34d399' : '#f87171' }}>{m.value}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>{m.label}</div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '4px' }}>{m.tip}</div>
                  </div>
                ))}
              </div>
              {result.flags?.length > 0 && (
                <div style={{ background: '#0f1829', border: '1px solid #3d1f1f', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px', letterSpacing: '1px' }}>🚨 RISK ALERTS</div>
                  {result.flags.map((flag, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#1a0f0f', borderRadius: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#f87171' }}>⚠</span>
                      <span style={{ color: '#fca5a5', fontSize: '14px' }}>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}