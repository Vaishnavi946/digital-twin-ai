import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const StatCard = ({ label, value, sub, color }) => (
  <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px', flex: 1 }}>
    <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{label}</div>
    <div style={{ fontSize: '28px', fontWeight: '800', color: color || '#f1f5f9' }}>{value}</div>
    <div style={{ color: '#475569', fontSize: '12px', marginTop: '6px' }}>{sub}</div>
  </div>
)

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals'], ['Chat', '/chat'], ['XAI', '/xai']]

export default function Dashboard() {
  const navigate = useNavigate()
  const savedProfile = JSON.parse(localStorage.getItem('dt_profile') || '{}')

  const [profile] = useState({
    name:       localStorage.getItem('dt_user_name') || 'User',
    income:     savedProfile.monthly_income     || 85000,
    expenses:   savedProfile.monthly_expenses   || 42000,
    savings:    savedProfile.current_savings    || 320000,
    debt:       savedProfile.total_debt         || 150000,
    emi:        savedProfile.monthly_emi        || 12000,
    investment: savedProfile.monthly_investment || 8000,
  })

  const savingsRate    = (((profile.income - profile.expenses) / profile.income) * 100).toFixed(1)
  const dti            = ((profile.emi / profile.income) * 100).toFixed(1)
  const emergencyMonths = (profile.savings / profile.expenses).toFixed(1)
  const riskScore      = dti > 40 ? 45 : dti > 25 ? 65 : 82
  const initial        = profile.name.charAt(0).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/')}>🧠 Digital Twin</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {NAV.map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              style={{ background: window.location.pathname === path ? '#1e3a5f' : 'transparent', color: window.location.pathname === path ? '#60a5fa' : '#94a3b8', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>{initial}</div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>{profile.name}</span>
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
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>Good morning, {profile.name} 👋</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Here's your complete financial overview.</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
          <StatCard label="Monthly Income"     value={`₹${profile.income.toLocaleString()}`}     sub="Active salary"                               color="#34d399" />
          <StatCard label="Monthly Expenses"   value={`₹${profile.expenses.toLocaleString()}`}   sub={`${savingsRate}% savings rate`}              color="#f87171" />
          <StatCard label="Total Savings"      value={`₹${profile.savings.toLocaleString()}`}    sub={`${emergencyMonths} months emergency cover`} color="#60a5fa" />
          <StatCard label="Monthly Investment" value={`₹${profile.investment.toLocaleString()}`} sub="SIP + mutual funds"                          color="#a78bfa" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>FINANCIAL RISK SCORE</div>
            <div style={{ fontSize: '72px', fontWeight: '900', color: riskScore > 75 ? '#34d399' : riskScore > 55 ? '#fbbf24' : '#f87171', lineHeight: 1 }}>{riskScore}</div>
            <div style={{ color: riskScore > 75 ? '#34d399' : riskScore > 55 ? '#fbbf24' : '#f87171', fontWeight: '600', marginTop: '8px', fontSize: '14px' }}>
              {riskScore > 75 ? '✅ Low Risk' : riskScore > 55 ? '⚠️ Medium Risk' : '🔴 High Risk'}
            </div>
            <div style={{ marginTop: '20px', background: '#0a0f1e', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${riskScore}%`, background: riskScore > 75 ? '#34d399' : riskScore > 55 ? '#fbbf24' : '#f87171', borderRadius: '8px' }} />
            </div>
            <button onClick={() => navigate('/risk')} style={{ marginTop: '20px', background: '#1e2a3a', border: 'none', color: '#94a3b8', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', width: '100%' }}>
              View Full Risk Report →
            </button>
          </div>

          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '32px' }}>
            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>FINANCIAL SNAPSHOT</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Debt-to-Income Ratio', value: `${dti}%`,                           good: dti < 30,                       tip: 'Ideal < 30%' },
                { label: 'Savings Rate',         value: `${savingsRate}%`,                   good: savingsRate > 20,               tip: 'Ideal > 20%' },
                { label: 'Emergency Fund',       value: `${emergencyMonths} months`,          good: emergencyMonths >= 6,           tip: 'Ideal 6 months' },
                { label: 'Total Debt',           value: `₹${profile.debt.toLocaleString()}`, good: profile.debt < profile.savings, tip: 'Debt vs savings' },
              ].map(item => (
                <div key={item.label} style={{ background: '#0a0f1e', borderRadius: '12px', padding: '16px', border: `1px solid ${item.good ? '#16423c' : '#3d1f1f'}` }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: item.good ? '#34d399' : '#f87171' }}>{item.value}</div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{item.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
          {[
            { icon: '🔮', title: 'Future Simulation', desc: 'Simulate thousands of financial futures',    path: '/simulate', color: '#2563eb' },
            { icon: '⚠️', title: 'Risk Intelligence', desc: 'Deep risk analysis & smart alerts',         path: '/risk',     color: '#d97706' },
            { icon: '📈', title: 'Savings Forecast',  desc: 'See where your savings will be in 5 years', path: '/predict',  color: '#7c3aed' },
            { icon: '🎯', title: 'Goals & Budget',    desc: 'Track goals and plan your monthly budget',  path: '/goals',    color: '#34d399' },
            { icon: '🤖', title: 'AI Advisor Chat',   desc: 'Ask anything about your finances',          path: '/chat',     color: '#06b6d4' },
            { icon: '🔍', title: 'XAI Explainer',     desc: 'Why is your score what it is?',             path: '/xai',      color: '#a78bfa' },
          ].map(item => (
            <button key={item.title} onClick={() => navigate(item.path)}
              style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '20px', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = item.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2a3a'}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}