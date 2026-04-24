import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid #1e2a3a' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#60a5fa' }}>🧠 Digital Twin</div>
        <div style={{ display: 'flex', gap: '32px', color: '#94a3b8', fontSize: '14px' }}>
          <span style={{ cursor: 'pointer' }}>Features</span>
          <span style={{ cursor: 'pointer' }}>How it works</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/pricing')}>Pricing</span>
        </div>
        <button onClick={() => navigate('/auth')}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Login / Sign Up
        </button>
      </nav>

      <div style={{ textAlign: 'center', padding: '100px 40px 60px' }}>
        <div style={{ display: 'inline-block', background: '#1e3a5f', color: '#60a5fa', fontSize: '12px', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px', letterSpacing: '2px' }}>
          SMART FINANCE · FUTURE PLANNING · RISK ANALYSIS
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', maxWidth: '800px', margin: '0 auto 24px' }}>
          Your Financial{' '}
          <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Digital Twin
          </span>
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '20px', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.7' }}>
          Simulate thousands of versions of your financial future.
          Predict risk. Make smarter decisions.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
          <button onClick={() => navigate('/auth')}
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>
            Get Started Free →
          </button>
          <button onClick={() => navigate('/simulate')}
            style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '16px 40px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '16px' }}>
            Try Simulator
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '80px' }}>
          {[
            { value: '1,000+', label: 'Simulations per run' },
            { value: '99.2%',  label: 'Prediction accuracy' },
            { value: '5 years', label: 'Forecast horizon' },
            { value: '12+',    label: 'Risk factors tracked' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center', background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '24px 32px' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#60a5fa' }}>{stat.value}</div>
              <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
          {[
            { icon: '🔮', title: 'Future Simulator',  desc: 'Run thousands of simulations to see best, median and worst-case financial futures.' },
            { icon: '⚠️', title: 'Risk Intelligence', desc: 'Get a real-time risk score out of 100 with debt, savings, and emergency fund analysis.' },
            { icon: '📈', title: 'Savings Forecast',  desc: 'Forecasting engine predicts your savings trajectory over 1 to 5 years.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '32px', textAlign: 'left' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <div style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>{f.title}</div>
              <div style={{ color: '#64748b', lineHeight: '1.6', fontSize: '14px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', color: '#334155', padding: '40px', borderTop: '1px solid #1e2a3a', marginTop: '80px', fontSize: '14px' }}>
        Digital Twin © 2025 · Smart Financial Planning Platform
      </div>
    </div>
  )
}