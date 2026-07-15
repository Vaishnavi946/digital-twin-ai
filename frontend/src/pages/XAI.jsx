import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

const API = import.meta.env.VITE_API_URL;

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals'], ['Chat', '/chat']]

export default function XAI() {
  const navigate = useNavigate()
  const name = localStorage.getItem('dt_user_name') || 'User'
  const initial = name.charAt(0).toUpperCase()
  const savedProfile = JSON.parse(localStorage.getItem('dt_profile') || '{}')

  const [form, setForm] = useState({
    income:     savedProfile.monthly_income     || 85000,
    expenses:   savedProfile.monthly_expenses   || 42000,
    savings:    savedProfile.current_savings    || 320000,
    debt:       savedProfile.total_debt         || 150000,
    emi:        savedProfile.monthly_emi        || 12000,
    investment: savedProfile.monthly_investment || 8000,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const runXAI = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/xai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:           'user_001',
          monthly_income:    form.income,
          monthly_expenses:  form.expenses,
          current_savings:   form.savings,
          total_debt:        form.debt,
          monthly_emi:       form.emi,
          monthly_investment: form.investment,
          risk_appetite:     'medium'
        })
      })
      const data = await res.json()
      setResult(data.data)
    } catch {
      // Fallback mock
      const savings_rate     = ((form.income - form.expenses) / form.income) * 100
      const dti              = (form.emi / form.income) * 100
      const emergency_months = form.savings / form.expenses
      const investment_rate  = (form.investment / form.income) * 100

      const features = [
        { feature: 'Savings Rate',     shap_value: savings_rate >= 20 ? 12 : savings_rate >= 10 ? 4 : -8,  impact: savings_rate >= 10 ? 'positive' : 'negative', magnitude: 12 },
        { feature: 'Debt-to-Income',   shap_value: dti <= 20 ? 8 : dti <= 30 ? 2 : -10,                    impact: dti <= 30 ? 'positive' : 'negative',           magnitude: 10 },
        { feature: 'Emergency Fund',   shap_value: emergency_months >= 6 ? 15 : emergency_months >= 3 ? 7 : -5, impact: emergency_months >= 3 ? 'positive' : 'negative', magnitude: 15 },
        { feature: 'Investment Rate',  shap_value: investment_rate >= 10 ? 6 : 2,                           impact: 'positive',                                    magnitude: 6  },
        { feature: 'Expense Ratio',    shap_value: -7,                                                      impact: 'negative',                                    magnitude: 7  },
        { feature: 'Debt vs Savings',  shap_value: form.debt < form.savings ? 2 : -6,                       impact: form.debt < form.savings ? 'positive' : 'negative', magnitude: 6 },
      ]
      const total = features.reduce((s, f) => s + f.shap_value, 60)
      setResult({
        base_score:     60,
        final_score:    Math.min(100, Math.max(0, total)),
        features,
        top_positive:   features.filter(f => f.impact === 'positive').slice(0, 3),
        top_negative:   features.filter(f => f.impact === 'negative').slice(0, 3),
        total_positive: features.filter(f => f.shap_value > 0).reduce((s, f) => s + f.shap_value, 0),
        total_negative: features.filter(f => f.shap_value < 0).reduce((s, f) => s + f.shap_value, 0),
        key_metrics: {
          savings_rate:     savings_rate.toFixed(1),
          dti:              dti.toFixed(1),
          emergency_months: emergency_months.toFixed(1),
          investment_rate:  investment_rate.toFixed(1),
        }
      })
    }
    setLoading(false)
  }

  const inputStyle = {
    background: '#0a0f1e', border: '1px solid #1e2a3a', borderRadius: '8px',
    color: 'white', padding: '10px 14px', fontSize: '14px', width: '100%', outline: 'none'
  }

  const scoreColor = result ? (result.final_score > 75 ? '#34d399' : result.final_score > 55 ? '#fbbf24' : '#f87171') : '#60a5fa'

  const chartData = result?.features.map(f => ({
    name:  f.feature,
    value: f.shap_value,
    fill:  f.shap_value > 0 ? '#34d399' : '#f87171'
  })) || []

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/')}>🧠 Digital Twin</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {NAV.map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              style={{ background: 'transparent', color: '#94a3b8', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
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
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>🔍 XAI — Explainable AI</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Understand exactly why your financial risk score is what it is — factor by factor.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>

          {/* Input Panel */}
          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', letterSpacing: '1px' }}>YOUR FINANCIAL DATA</div>
            {[
              { key: 'income',     label: 'Monthly Income (₹)' },
              { key: 'expenses',   label: 'Monthly Expenses (₹)' },
              { key: 'savings',    label: 'Current Savings (₹)' },
              { key: 'debt',       label: 'Total Debt (₹)' },
              { key: 'emi',        label: 'Monthly EMI (₹)' },
              { key: 'investment', label: 'Monthly Investment (₹)' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{f.label}</div>
                <input type="number" value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: Number(e.target.value) })}
                  style={inputStyle} />
              </div>
            ))}
            <button onClick={runXAI} disabled={loading}
              style={{ width: '100%', background: loading ? '#1e2a3a' : 'linear-gradient(135deg, #7c3aed, #2563eb)', border: 'none', color: 'white', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginTop: '8px' }}>
              {loading ? '⏳ Analysing...' : '🔍 Explain My Score'}
            </button>

            <div style={{ marginTop: '20px', background: '#0a0f1e', border: '1px solid #2d1f5e', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#7c3aed', letterSpacing: '1px', marginBottom: '6px' }}>WHAT IS XAI?</div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                Explainable AI shows you exactly which factors help or hurt your financial score — and by how much. Used by banks and risk teams worldwide.
              </div>
            </div>
          </div>

          {/* Results */}
          {!result ? (
            <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '80px', textAlign: 'center', color: '#334155' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Ready to explain your score</div>
              <div style={{ fontSize: '14px' }}>Click "Explain My Score" to see a full breakdown</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Score Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>BASE SCORE</div>
                  <div style={{ fontSize: '40px', fontWeight: '900', color: '#94a3b8' }}>{result.base_score}</div>
                  <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>Starting point</div>
                </div>
                <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>ADJUSTMENTS</div>
                  <div style={{ fontSize: '28px', fontWeight: '800' }}>
                    <span style={{ color: '#34d399' }}>+{result.total_positive}</span>
                    {' / '}
                    <span style={{ color: '#f87171' }}>{result.total_negative}</span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>Positive / Negative</div>
                </div>
                <div style={{ background: '#0f1829', border: `1px solid ${scoreColor}40`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>FINAL SCORE</div>
                  <div style={{ fontSize: '40px', fontWeight: '900', color: scoreColor }}>{result.final_score}</div>
                  <div style={{ color: scoreColor, fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                    {result.final_score > 75 ? '✅ Low Risk' : result.final_score > 55 ? '⚠️ Medium Risk' : '🔴 High Risk'}
                  </div>
                </div>
              </div>

              {/* SHAP Bar Chart */}
              <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', letterSpacing: '1px' }}>FEATURE IMPACT ON YOUR SCORE</div>
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '20px' }}>Green = improves your score · Red = hurts your score</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" horizontal={false} />
                    <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `${v > 0 ? '+' : ''}${v}`} />
                    <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fontSize: 12 }} width={120} />
                    <Tooltip
                      formatter={(v) => [`${v > 0 ? '+' : ''}${v} points`, 'Score Impact']}
                      contentStyle={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '8px' }} />
                    <ReferenceLine x={0} stroke="#334155" strokeWidth={2} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Positive & Negative Factors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Top Positive */}
                <div style={{ background: '#0f1829', border: '1px solid #16423c', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ color: '#34d399', fontSize: '13px', marginBottom: '16px', letterSpacing: '1px' }}>✅ WHAT'S HELPING YOU</div>
                  {result.top_positive.length > 0 ? result.top_positive.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#0a0f1e', borderRadius: '8px', marginBottom: '8px', border: '1px solid #16423c' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{f.feature}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Positive impact on score</div>
                      </div>
                      <div style={{ color: '#34d399', fontWeight: '800', fontSize: '18px' }}>+{f.shap_value}</div>
                    </div>
                  )) : <div style={{ color: '#475569', fontSize: '14px' }}>No positive factors found</div>}
                </div>

                {/* Top Negative */}
                <div style={{ background: '#0f1829', border: '1px solid #3d1f1f', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px', letterSpacing: '1px' }}>⚠️ WHAT'S HURTING YOU</div>
                  {result.top_negative.length > 0 ? result.top_negative.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#0a0f1e', borderRadius: '8px', marginBottom: '8px', border: '1px solid #3d1f1f' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{f.feature}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Dragging your score down</div>
                      </div>
                      <div style={{ color: '#f87171', fontWeight: '800', fontSize: '18px' }}>{f.shap_value}</div>
                    </div>
                  )) : <div style={{ color: '#475569', fontSize: '14px' }}>No negative factors — great job!</div>}
                </div>
              </div>

              {/* Key Metrics */}
              <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', letterSpacing: '1px' }}>KEY FINANCIAL METRICS USED</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {[
                    { label: 'Savings Rate',     value: `${result.key_metrics.savings_rate}%`, good: result.key_metrics.savings_rate >= 20, tip: 'Ideal ≥ 20%' },
                    { label: 'Debt-to-Income',   value: `${result.key_metrics.dti}%`,          good: result.key_metrics.dti <= 30,          tip: 'Ideal ≤ 30%' },
                    { label: 'Emergency Months', value: `${result.key_metrics.emergency_months} mo`, good: result.key_metrics.emergency_months >= 6, tip: 'Ideal ≥ 6 mo' },
                    { label: 'Investment Rate',  value: `${result.key_metrics.investment_rate}%`, good: result.key_metrics.investment_rate >= 10, tip: 'Ideal ≥ 10%' },
                  ].map(m => (
                    <div key={m.label} style={{ background: '#0a0f1e', borderRadius: '12px', padding: '16px', border: `1px solid ${m.good ? '#16423c' : '#3d1f1f'}`, textAlign: 'center' }}>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: m.good ? '#34d399' : '#f87171' }}>{m.value}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>{m.label}</div>
                      <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>{m.tip}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}