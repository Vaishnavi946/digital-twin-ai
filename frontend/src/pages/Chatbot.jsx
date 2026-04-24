import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV = [['Dashboard', '/dashboard'], ['Simulator', '/simulate'], ['Risk', '/risk'], ['Predict', '/predict'], ['Goals', '/goals']]

const SUGGESTED = [
  'Can I afford to buy a car worth ₹8 lakhs?',
  'How much should I save each month for retirement?',
  'Is my debt-to-income ratio good?',
  'How can I build a 6-month emergency fund?',
  'Should I invest in SIP or FD right now?',
  'How do I improve my financial risk score?',
]

const SYSTEM_PROMPT = `You are a smart, friendly financial advisor for Digital Twin — a personal finance platform. 
You help users with budgeting, savings, investments, debt management, risk analysis, and financial planning.
Keep responses concise, practical, and easy to understand. Use Indian financial context (₹, SIP, FD, EMI, etc).
Never give stock tips or specific investment advice. Always recommend consulting a certified advisor for major decisions.
Format responses clearly. Use bullet points where helpful. Keep tone warm and professional.`

export default function Chatbot() {
  const navigate = useNavigate()
  const name = localStorage.getItem('dt_user_name') || 'User'
  const initial = name.charAt(0).toUpperCase()

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${name}! 👋 I'm your Digital Twin financial advisor. I can help you with budgeting, savings, investments, EMI planning, and more.\n\nWhat's on your mind today?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Sorry, I could not process that. Please try again.'
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch {
      // Fallback smart responses if API unavailable
      const fallbacks = {
        'afford':     `Based on general financial principles:\n\n• Your EMI should not exceed **40% of monthly income**\n• For an ₹8 lakh car, expect EMI of ₹14,000–18,000/mo over 5 years\n• Ensure you have 6 months emergency fund before taking a loan\n• A down payment of 20–30% reduces interest significantly`,
        'save':       `Here's a solid savings framework:\n\n• **50/30/20 Rule** — 50% needs, 30% wants, 20% savings\n• For retirement, aim to save at least 15% of income from age 25\n• Start a SIP in index funds for long-term wealth building\n• Increase savings by 10% every year as income grows`,
        'debt':       `A healthy debt-to-income ratio is:\n\n• **Below 30%** — Excellent, you're in great shape\n• **30–40%** — Manageable, try to reduce\n• **Above 40%** — High risk, prioritize debt repayment\n• Focus on highest interest debt first (avalanche method)`,
        'emergency':  `Building a 6-month emergency fund:\n\n• Calculate monthly expenses × 6 for your target\n• Open a separate high-interest savings account\n• Set up auto-transfer on salary day\n• Treat it as non-negotiable — don't touch it for non-emergencies`,
        'sip':        `SIP vs FD comparison:\n\n• **SIP** — Higher returns (10–14% historical), market risk, good for 5+ year goals\n• **FD** — Guaranteed returns (6–7%), safe, good for short-term goals\n• Recommended: SIP for long-term wealth, FD for emergency fund or <2 year goals`,
        'risk':       `To improve your financial risk score:\n\n• Reduce EMI to below 30% of income\n• Build emergency fund to cover 6 months expenses\n• Maintain savings rate above 20%\n• Pay off high-interest debt first\n• Avoid taking new loans unless necessary`,
      }
      const key = Object.keys(fallbacks).find(k => userMsg.toLowerCase().includes(k))
      const reply = key ? fallbacks[key] : `Great question! Here's my advice:\n\n• Focus on maintaining a savings rate of at least 20%\n• Keep your EMI below 30% of monthly income\n• Build an emergency fund of 6 months expenses\n• Invest consistently in index funds via SIP for long-term goals\n\nWould you like me to go deeper on any of these points?`
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <p key={i} style={{ margin: '2px 0', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: bold }} />
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #1e2a3a', flexShrink: 0 }}>
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
          <button onClick={() => { localStorage.removeItem('dt_user_name'); navigate('/auth') }}
            style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{ width: '280px', borderRight: '1px solid #1e2a3a', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
          <div style={{ fontSize: '13px', color: '#64748b', letterSpacing: '1px', marginBottom: '4px' }}>SUGGESTED QUESTIONS</div>
          {SUGGESTED.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '10px', padding: '12px 14px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', textAlign: 'left', lineHeight: '1.5' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#60a5fa' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2a3a'; e.currentTarget.style.color = '#94a3b8' }}>
              {q}
            </button>
          ))}

          <div style={{ marginTop: 'auto', background: '#0f1829', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#3b82f6', letterSpacing: '1px', marginBottom: '6px' }}>NOTE</div>
            <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
              This advisor provides general guidance only. Always consult a certified financial planner for major decisions.
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Chat Header */}
          <div style={{ padding: '16px 28px', borderBottom: '1px solid #1e2a3a', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🧠</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Digital Twin Advisor</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399' }} />
                <span style={{ color: '#34d399', fontSize: '12px' }}>Online</span>
              </div>
            </div>
            <button onClick={() => setMessages([{ role: 'assistant', content: `Hi ${name}! 👋 I'm your Digital Twin financial advisor. How can I help you today?` }])}
              style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #334155', color: '#64748b', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
              Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>

                {msg.role === 'assistant' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, marginTop: '4px' }}>🧠</div>
                )}

                <div style={{
                  maxWidth: '70%', padding: '14px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#0f1829',
                  border: msg.role === 'user' ? 'none' : '1px solid #1e2a3a',
                  color: msg.role === 'user' ? 'white' : '#cbd5e1', fontSize: '14px'
                }}>
                  {formatMessage(msg.content)}
                </div>

                {msg.role === 'user' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0, marginTop: '4px' }}>{initial}</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🧠</div>
                <div style={{ background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '16px 16px 16px 4px', padding: '14px 18px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', animation: `bounce 1.2s ${j * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 28px', borderTop: '1px solid #1e2a3a' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything about your finances..."
                rows={1}
                style={{
                  flex: 1, background: '#0f1829', border: '1px solid #1e2a3a', borderRadius: '12px',
                  color: 'white', padding: '14px 16px', fontSize: '14px', outline: 'none',
                  resize: 'none', fontFamily: 'Inter, sans-serif', lineHeight: '1.5',
                  maxHeight: '120px', overflowY: 'auto'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#1e2a3a'}
              />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() ? '#1e2a3a' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  border: 'none', color: 'white', padding: '14px 20px', borderRadius: '12px',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '18px'
                }}>
                ➤
              </button>
            </div>
            <div style={{ color: '#334155', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>
              Press Enter to send · Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}