import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { id: 1, title: 'Income & Expenses',   icon: '💰', desc: 'Tell us about your monthly cash flow' },
  { id: 2, title: 'Savings & Debt',      icon: '🏦', desc: 'Your current financial position' },
  { id: 3, title: 'Investments & Goals', icon: '📈', desc: 'Where you want to go' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const name = localStorage.getItem('dt_user_name') || 'User'
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    monthly_income:     '',
    monthly_expenses:   '',
    current_savings:    '',
    total_debt:         '',
    monthly_emi:        '',
    monthly_investment: '',
    risk_appetite:      'medium',
  })
  const [loading, setLoading] = useState(false)

  const update = (key, val) => setData({ ...data, [key]: val })

  const inputStyle = {
    width: '100%', background: '#0a0f1e', border: '1px solid #1e2a3a',
    borderRadius: '10px', color: 'white', padding: '13px 16px',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box'
  }

  const isStepValid = () => {
    if (step === 1) return data.monthly_income && data.monthly_expenses
    if (step === 2) return data.current_savings !== ''
    if (step === 3) return data.monthly_investment !== ''
    return true
  }

  const handleFinish = async () => {
    setLoading(true)

    const profile = {
      monthly_income:     Number(data.monthly_income),
      monthly_expenses:   Number(data.monthly_expenses),
      current_savings:    Number(data.current_savings),
      total_debt:         Number(data.total_debt) || 0,
      monthly_emi:        Number(data.monthly_emi) || 0,
      monthly_investment: Number(data.monthly_investment),
      risk_appetite:      data.risk_appetite,
    }

    // Save to localStorage so dashboard can use it
    localStorage.setItem('dt_profile', JSON.stringify(profile))

    // Try to save to backend too
    try {
      const token = localStorage.getItem('dt_token')
      if (token) {
        await fetch('http://localhost:8000/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profile)
        })
      }
    } catch {
      // Backend save failed — localStorage already saved, no problem
    }

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#60a5fa' }}>🧠 Digital Twin</div>
        <div style={{ color: '#64748b', fontSize: '14px' }}>Setting up your profile</div>
      </nav>

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '60px 20px' }}>

        {/* Welcome */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
            Welcome, {name.split(' ')[0]}!
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Let's set up your financial profile. Takes less than 2 minutes.
          </p>
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '40px' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px',
                  background: step > s.id ? '#2563eb' : step === s.id ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#0f1829',
                  border: step >= s.id ? 'none' : '1px solid #1e2a3a',
                  color: step >= s.id ? 'white' : '#475569'
                }}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <div style={{ fontSize: '11px', color: step === s.id ? '#60a5fa' : '#475569', whiteSpace: 'nowrap' }}>
                  {s.title}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: '80px', height: '2px', background: step > s.id ? '#2563eb' : '#1e2a3a', margin: '0 8px', marginBottom: '20px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Card */}
        <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '20px', padding: '40px' }}>

          {/* Step Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{STEPS[step-1].icon}</div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{STEPS[step-1].title}</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{STEPS[step-1].desc}</p>
          </div>

          {/* Step 1 — Income & Expenses */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Monthly Income (₹) <span style={{ color: '#f87171' }}>*</span></div>
                <input type="number" placeholder="e.g. 85000" value={data.monthly_income}
                  onChange={e => update('monthly_income', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Your total take-home salary per month</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Monthly Expenses (₹) <span style={{ color: '#f87171' }}>*</span></div>
                <input type="number" placeholder="e.g. 42000" value={data.monthly_expenses}
                  onChange={e => update('monthly_expenses', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Rent + food + transport + utilities + all bills</div>
              </div>

              {/* Live preview */}
              {data.monthly_income && data.monthly_expenses && (
                <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>Monthly Savings</span>
                  <span style={{ color: Number(data.monthly_income) > Number(data.monthly_expenses) ? '#34d399' : '#f87171', fontWeight: '700', fontSize: '16px' }}>
                    ₹{(Number(data.monthly_income) - Number(data.monthly_expenses)).toLocaleString()}
                    {' '}({(((Number(data.monthly_income) - Number(data.monthly_expenses)) / Number(data.monthly_income)) * 100).toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Savings & Debt */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Current Total Savings (₹) <span style={{ color: '#f87171' }}>*</span></div>
                <input type="number" placeholder="e.g. 320000" value={data.current_savings}
                  onChange={e => update('current_savings', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Bank balance + FD + savings account total</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Total Outstanding Debt (₹)</div>
                <input type="number" placeholder="e.g. 150000 (0 if none)" value={data.total_debt}
                  onChange={e => update('total_debt', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>All loans combined — home, car, personal, credit card</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Monthly EMI Payments (₹)</div>
                <input type="number" placeholder="e.g. 12000 (0 if none)" value={data.monthly_emi}
                  onChange={e => update('monthly_emi', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Total of all loan EMIs you pay each month</div>
              </div>
            </div>
          )}

          {/* Step 3 — Investment & Risk */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Monthly Investment (₹) <span style={{ color: '#f87171' }}>*</span></div>
                <input type="number" placeholder="e.g. 8000" value={data.monthly_investment}
                  onChange={e => update('monthly_investment', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#1e2a3a'} />
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>SIP + mutual funds + stocks + PPF combined</div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Risk Appetite</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { val: 'low',    label: '🛡️ Low',    desc: 'Safe, stable returns' },
                    { val: 'medium', label: '⚖️ Medium', desc: 'Balanced approach' },
                    { val: 'high',   label: '🚀 High',   desc: 'Growth oriented' },
                  ].map(r => (
                    <button key={r.val} onClick={() => update('risk_appetite', r.val)}
                      style={{ flex: 1, background: data.risk_appetite === r.val ? '#1e3a5f' : '#0a0f1e', border: `1px solid ${data.risk_appetite === r.val ? '#3b82f6' : '#1e2a3a'}`, borderRadius: '10px', padding: '14px 10px', cursor: 'pointer', color: data.risk_appetite === r.val ? '#60a5fa' : '#64748b', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{r.label}</div>
                      <div style={{ fontSize: '11px' }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Summary */}
              <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px', marginTop: '8px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', letterSpacing: '1px' }}>YOUR FINANCIAL SUMMARY</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Monthly Income',   value: `₹${Number(data.monthly_income || 0).toLocaleString()}` },
                    { label: 'Monthly Expenses', value: `₹${Number(data.monthly_expenses || 0).toLocaleString()}` },
                    { label: 'Total Savings',    value: `₹${Number(data.current_savings || 0).toLocaleString()}` },
                    { label: 'Investment/mo',    value: `₹${Number(data.monthly_investment || 0).toLocaleString()}` },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: '11px', color: '#475569' }}>{item.label}</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/auth')}
              style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
              {step === 1 ? '← Back' : '← Previous'}
            </button>

            {step < 3 ? (
              <button onClick={() => isStepValid() && setStep(step + 1)}
                style={{ background: isStepValid() ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#1e2a3a', border: 'none', color: 'white', padding: '12px 28px', borderRadius: '10px', cursor: isStepValid() ? 'pointer' : 'not-allowed', fontWeight: '700' }}>
                Next →
              </button>
            ) : (
              <button onClick={handleFinish} disabled={loading || !isStepValid()}
                style={{ background: loading || !isStepValid() ? '#1e2a3a' : 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none', color: 'white', padding: '12px 32px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                {loading ? '⏳ Saving...' : '🚀 Go to Dashboard'}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#334155', fontSize: '13px', marginTop: '20px' }}>
          You can update these details anytime from your dashboard.
        </p>
      </div>
    </div>
  )
}