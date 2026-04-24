import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals'], ['Chat', '/chat']]

export default function Goals() {
  const navigate = useNavigate()
  const name = localStorage.getItem('dt_user_name') || 'User'
  const initial = name.charAt(0).toUpperCase()
  const savedProfile = JSON.parse(localStorage.getItem('dt_profile') || '{}')

  const [income, setIncome] = useState(savedProfile.monthly_income || 85000)
  const totalExp = savedProfile.monthly_expenses || 42000
  const [expenses, setExpenses] = useState({
    housing:       Math.round(totalExp * 0.36),
    food:          Math.round(totalExp * 0.19),
    transport:     Math.round(totalExp * 0.10),
    entertainment: Math.round(totalExp * 0.07),
    healthcare:    Math.round(totalExp * 0.05),
    other:         Math.round(totalExp * 0.23),
  })

  const [goals, setGoals] = useState([
    { id: 1, title: 'Emergency Fund',    target: 250000, saved: 120000, icon: '🛡️', color: '#34d399', months: 12 },
    { id: 2, title: 'Buy a Car',         target: 800000, saved: 180000, icon: '🚗', color: '#60a5fa', months: 36 },
    { id: 3, title: 'Home Down Payment', target: 1500000, saved: savedProfile.current_savings || 320000, icon: '🏠', color: '#a78bfa', months: 60 },
    { id: 4, title: 'Vacation',          target: 80000,  saved: 25000,  icon: '✈️', color: '#fbbf24', months: 6 },
  ])

  const [newGoal, setNewGoal] = useState({ title: '', target: '', months: '' })
  const [showAdd, setShowAdd] = useState(false)

  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0)
  const savings = income - totalExpenses
  const savingsRate = ((savings / income) * 100).toFixed(1)

  const budgetData = Object.entries(expenses).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    amount: val,
  }))

  const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c']

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.months) return
    const colors = ['#34d399', '#60a5fa', '#a78bfa', '#fbbf24', '#f87171', '#fb923c']
    setGoals([...goals, {
      id: Date.now(), title: newGoal.title,
      target: Number(newGoal.target), saved: 0,
      icon: '🎯', color: colors[goals.length % colors.length],
      months: Number(newGoal.months)
    }])
    setNewGoal({ title: '', target: '', months: '' })
    setShowAdd(false)
  }

  const updateSaved = (id, val) => setGoals(goals.map(g => g.id === id ? { ...g, saved: Number(val) } : g))

  const inputStyle = {
    background: '#0a0f1e', border: '1px solid #1e2a3a', borderRadius: '8px',
    color: 'white', padding: '10px 14px', fontSize: '14px', outline: 'none',
    width: '100%', boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/')}>🧠 Digital Twin</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {NAV.map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              style={{ background: path === '/goals' ? '#1e3a5f' : 'transparent', color: path === '/goals' ? '#60a5fa' : '#94a3b8', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
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
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>🎯 Goals & Budget Planner</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Track your financial goals and manage your monthly budget.</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Monthly Income',  value: `₹${income.toLocaleString()}`,           color: '#34d399' },
            { label: 'Total Expenses',  value: `₹${totalExpenses.toLocaleString()}`,     color: '#f87171' },
            { label: 'Monthly Savings', value: `₹${savings.toLocaleString()}`,           color: '#60a5fa' },
            { label: 'Savings Rate',    value: `${savingsRate}%`,                        color: '#a78bfa' },
          ].map(c => (
            <div key={c.label} style={{ flex: 1, background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px' }}>
              <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{c.label}</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px', letterSpacing: '1px' }}>MONTHLY BUDGET BREAKDOWN</div>
            {Object.entries(expenses).map(([key, val], i) => (
              <div key={key} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'capitalize' }}>{key}</span>
                  <span style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>₹{val.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, background: '#0a0f1e', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(val / income) * 100}%`, background: COLORS[i], borderRadius: '4px' }} />
                  </div>
                  <input type="number" value={val}
                    onChange={e => setExpenses({ ...expenses, [key]: Number(e.target.value) })}
                    style={{ ...inputStyle, width: '100px', padding: '6px 10px', fontSize: '13px' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: '20px', padding: '14px', background: savings >= 0 ? '#0d2218' : '#1a0f0f', border: `1px solid ${savings >= 0 ? '#16423c' : '#3d1f1f'}`, borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Remaining after expenses</span>
              <span style={{ color: savings >= 0 ? '#34d399' : '#f87171', fontWeight: '700', fontSize: '16px' }}>₹{savings.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px', letterSpacing: '1px' }}>EXPENSE DISTRIBUTION</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={budgetData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" horizontal={false} />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fontSize: 12 }} width={90} />
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} contentStyle={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '8px' }} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {budgetData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Adjust Monthly Income: ₹{income.toLocaleString()}</div>
              <input type="range" min={20000} max={500000} step={5000} value={income}
                onChange={e => setIncome(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6' }} />
            </div>
          </div>
        </div>

        <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ color: '#64748b', fontSize: '13px', letterSpacing: '1px' }}>YOUR FINANCIAL GOALS</div>
            <button onClick={() => setShowAdd(!showAdd)}
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              + Add Goal
            </button>
          </div>

          {showAdd && (
            <div style={{ background: '#0a0f1e', border: '1px solid #1e2a3a', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Goal Name</div>
                <input type="text" placeholder="e.g. Buy a Laptop" value={newGoal.title}
                  onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Target Amount (₹)</div>
                <input type="number" placeholder="500000" value={newGoal.target}
                  onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Timeline (months)</div>
                <input type="number" placeholder="24" value={newGoal.months}
                  onChange={e => setNewGoal({ ...newGoal, months: e.target.value })} style={inputStyle} />
              </div>
              <button onClick={addGoal}
                style={{ background: '#2563eb', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>
                Save Goal
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {goals.map(goal => {
              const pct = Math.min(100, ((goal.saved / goal.target) * 100)).toFixed(1)
              const remaining = goal.target - goal.saved
              const monthlyNeeded = (remaining / goal.months).toFixed(0)
              const onTrack = savings >= monthlyNeeded

              return (
                <div key={goal.id} style={{ background: '#0a0f1e', border: `1px solid ${goal.color}30`, borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '28px' }}>{goal.icon}</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>{goal.title}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Target: ₹{goal.target.toLocaleString()} in {goal.months} months</div>
                      </div>
                    </div>
                    <div style={{ background: onTrack ? '#0d2218' : '#1a0f0f', border: `1px solid ${onTrack ? '#16423c' : '#3d1f1f'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: onTrack ? '#34d399' : '#f87171', fontWeight: '600' }}>
                      {onTrack ? '✅ On Track' : '⚠️ Behind'}
                    </div>
                  </div>
                  <div style={{ background: '#1e2a3a', borderRadius: '6px', height: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: goal.color, borderRadius: '6px', transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ color: goal.color, fontWeight: '700', fontSize: '14px' }}>{pct}% saved</span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>₹{remaining.toLocaleString()} remaining</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      Need <strong style={{ color: '#94a3b8' }}>₹{Number(monthlyNeeded).toLocaleString()}/mo</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Saved:</span>
                      <input type="number" value={goal.saved}
                        onChange={e => updateSaved(goal.id, e.target.value)}
                        style={{ ...inputStyle, width: '110px', padding: '6px 10px', fontSize: '13px' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}