import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals']]

export default function Pricing() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const name = localStorage.getItem('dt_user_name') || null
  const initial = name ? name.charAt(0).toUpperCase() : null

  const plans = [
    {
      name: 'Free',
      icon: '🌱',
      price: { monthly: 0, yearly: 0 },
      desc: 'Perfect to get started with basic financial planning.',
      color: '#64748b',
      border: '#1e2a3a',
      features: [
        { text: 'Financial Dashboard', ok: true },
        { text: 'Basic Risk Score', ok: true },
        { text: '3 Goal Trackers', ok: true },
        { text: 'Future Simulator (10 runs/mo)', ok: true },
        { text: 'Savings Forecast', ok: false },
        { text: 'Unlimited Simulations', ok: false },
        { text: 'PDF Report Export', ok: false },
        { text: 'AI Advisor Chat', ok: false },
        { text: 'Priority Support', ok: false },
      ],
      cta: 'Get Started Free',
      ctaBg: 'transparent',
      ctaBorder: '1px solid #334155',
      ctaColor: '#94a3b8',
    },
    {
      name: 'Pro',
      icon: '⚡',
      price: { monthly: 499, yearly: 399 },
      desc: 'For serious planners who want full AI-powered insights.',
      color: '#60a5fa',
      border: '#2563eb',
      badge: 'Most Popular',
      features: [
        { text: 'Financial Dashboard', ok: true },
        { text: 'Advanced Risk Score', ok: true },
        { text: 'Unlimited Goal Trackers', ok: true },
        { text: 'Unlimited Simulations', ok: true },
        { text: 'Savings Forecast (5 yrs)', ok: true },
        { text: 'Budget Planner', ok: true },
        { text: 'PDF Report Export', ok: true },
        { text: 'AI Advisor Chat', ok: false },
        { text: 'Priority Support', ok: false },
      ],
      cta: 'Start Pro Plan',
      ctaBg: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      ctaBorder: 'none',
      ctaColor: 'white',
    },
    {
      name: 'Elite',
      icon: '👑',
      price: { monthly: 999, yearly: 799 },
      desc: 'Everything you need for complete financial mastery.',
      color: '#a78bfa',
      border: '#7c3aed',
      features: [
        { text: 'Financial Dashboard', ok: true },
        { text: 'Advanced Risk Score', ok: true },
        { text: 'Unlimited Goal Trackers', ok: true },
        { text: 'Unlimited Simulations', ok: true },
        { text: 'Savings Forecast (10 yrs)', ok: true },
        { text: 'Budget Planner', ok: true },
        { text: 'PDF Report Export', ok: true },
        { text: 'AI Advisor Chat', ok: true },
        { text: 'Priority Support', ok: true },
      ],
      cta: 'Start Elite Plan',
      ctaBg: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
      ctaBorder: 'none',
      ctaColor: 'white',
    },
    {
      name: 'Business API',
      icon: '🏢',
      price: { monthly: null, yearly: null },
      desc: 'Integrate Digital Twin into your product or platform.',
      color: '#fbbf24',
      border: '#d97706',
      features: [
        { text: 'Full REST API Access', ok: true },
        { text: 'White-label Dashboard', ok: true },
        { text: 'Custom Simulation Models', ok: true },
        { text: 'Bulk User Management', ok: true },
        { text: 'SLA Guarantee (99.9%)', ok: true },
        { text: 'Dedicated Account Manager', ok: true },
        { text: 'Custom Integrations', ok: true },
        { text: 'On-premise Deployment', ok: true },
        { text: '24/7 Priority Support', ok: true },
      ],
      cta: 'Contact Sales',
      ctaBg: 'linear-gradient(135deg, #d97706, #f59e0b)',
      ctaBorder: 'none',
      ctaColor: 'white',
    },
  ]

  const faqs = [
    { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.' },
    { q: 'Is there a free trial for Pro?', a: 'Yes! Pro and Elite plans come with a 14-day free trial. No credit card required to start.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets.' },
    { q: 'How does the Business API work?', a: 'You get a dedicated API key with full access to our simulation and risk engine. Documentation and sandbox access provided on signup.' },
    { q: 'Is my financial data secure?', a: 'All data is encrypted at rest and in transit. We never sell or share your financial data with any third party.' },
  ]

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
          {name ? (
            <>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{initial}</div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>{name}</span>
              <button onClick={() => { localStorage.removeItem('dt_user_name'); navigate('/auth') }}
                style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8' }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/auth')}
              style={{ background: '#2563eb', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      <div style={{ padding: '60px 48px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', background: '#1e3a5f', color: '#60a5fa', fontSize: '12px', padding: '6px 16px', borderRadius: '20px', marginBottom: '16px', letterSpacing: '2px' }}>
            SIMPLE PRICING
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: '800', marginBottom: '12px' }}>
            Choose your plan
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto 32px' }}>
            Start free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '12px', padding: '4px', gap: '4px' }}>
            {['monthly', 'yearly'].map(b => (
              <button key={b} onClick={() => setBilling(b)}
                style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: billing === b ? '#2563eb' : 'transparent', color: billing === b ? 'white' : '#64748b' }}>
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
                {b === 'yearly' && <span style={{ marginLeft: '6px', background: '#16423c', color: '#34d399', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>-20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1200px', margin: '0 auto 80px' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ background: '#0f1829', border: `1px solid ${plan.border}`, borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', position: 'relative' }}>

              {plan.badge && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{plan.icon}</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: plan.color, marginBottom: '6px' }}>{plan.name}</div>
              <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>{plan.desc}</div>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                {plan.price.monthly === null ? (
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>Custom</div>
                ) : plan.price.monthly === 0 ? (
                  <div style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>Free</div>
                ) : (
                  <div>
                    <span style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>
                      ₹{billing === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>/mo</span>
                    {billing === 'yearly' && (
                      <div style={{ color: '#34d399', fontSize: '12px', marginTop: '4px' }}>Billed yearly · Save ₹{(plan.price.monthly - plan.price.yearly) * 12}/yr</div>
                    )}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate(plan.name === 'Free' ? '/auth' : plan.name === 'Business API' ? '/auth' : '/auth')}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: plan.ctaBorder, background: plan.ctaBg, color: plan.ctaColor, fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginBottom: '24px' }}>
                {plan.cta}
              </button>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', color: f.ok ? '#34d399' : '#334155' }}>{f.ok ? '✓' : '✗'}</span>
                    <span style={{ fontSize: '13px', color: f.ok ? '#cbd5e1' : '#475569' }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Banner */}
        <div style={{ maxWidth: '900px', margin: '0 auto 80px', background: 'linear-gradient(135deg, #1e3a5f, #2d1f5e)', border: '1px solid #2563eb', borderRadius: '20px', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Not sure which plan to pick?</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Start with Free — no credit card needed. Upgrade anytime in one click.</div>
          </div>
          <button onClick={() => navigate('/auth')}
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none', color: 'white', padding: '14px 32px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap' }}>
            Start for Free →
          </button>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', marginBottom: '32px' }}>Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <FAQ key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: '#334155', padding: '40px', borderTop: '1px solid #1e2a3a', marginTop: '40px', fontSize: '14px' }}>
        Digital Twin © 2025 · Smart Financial Planning Platform
      </div>
    </div>
  )
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'transparent', border: 'none', padding: '18px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
        <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{q}</span>
        <span style={{ color: '#60a5fa', fontSize: '20px', transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 18px', color: '#94a3b8', fontSize: '14px', lineHeight: '1.7' }}>
          {a}
        </div>
      )}
    </div>
  )
}