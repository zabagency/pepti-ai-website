import { useState } from 'react'
import { submitWaitlist } from '../lib/submitWaitlist'

export default function WaitlistGate({ onUnlock }) {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Enter a valid email.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      await submitWaitlist(email)
      setStatus('success')
      setTimeout(() => onUnlock(email), 1800)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg('Something went wrong. Try again.')
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.topLine} />

        {status === 'success' ? (
          <div style={s.successWrap}>
            <div style={s.checkCircle}>✓</div>
            <p style={s.successTitle}>You&apos;re in.</p>
            <p style={s.successSub}>Unlocking your results...</p>
          </div>
        ) : (
          <>
            <p style={s.eyebrow}>ONE LAST STEP</p>
            <h2 style={s.heading}>Get your results.</h2>
            <p style={s.body}>
              Drop your email and we&apos;ll send your compound overview plus notify you
              the second the full Pepti AI app launches.
            </p>

            <input
              style={s.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              disabled={status === 'loading'}
              autoFocus
            />

            {errorMsg && <p style={s.error}>{errorMsg}</p>}

            <button
              style={{
                ...s.btn,
                opacity: status === 'loading' ? 0.6 : 1,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              }}
              onClick={handleSubmit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'SENDING...' : 'UNLOCK MY RESULTS →'}
            </button>

            <p style={s.fine}>
              No spam. No selling your data. Just early access.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  page: {
    position: 'fixed', inset: 0,
    background: '#060810',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: "'Inter', sans-serif",
    zIndex: 200,
  },
  card: {
    background: '#0b0e1a',
    border: '1px solid rgba(74,158,255,.2)',
    borderRadius: 20,
    padding: '36px 28px',
    maxWidth: 400,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  topLine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    background: 'linear-gradient(90deg,transparent,rgba(74,158,255,.5),transparent)',
  },
  eyebrow: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9, letterSpacing: '.22em',
    color: '#4a9eff', marginBottom: 12,
  },
  heading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 42, lineHeight: 1,
    color: '#fff', marginBottom: 14, letterSpacing: '.03em',
  },
  body: {
    fontSize: 14, lineHeight: 1.72,
    color: 'rgba(220,232,255,.65)',
    fontWeight: 300, marginBottom: 24,
  },
  input: {
    width: '100%', padding: '14px 16px',
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(74,158,255,.2)',
    borderRadius: 10, color: '#e0e8ff',
    fontSize: 14, fontFamily: "'Inter', sans-serif",
    outline: 'none', marginBottom: 12,
    boxSizing: 'border-box',
    transition: 'border-color 0.25s ease',
  },
  btn: {
    width: '100%', padding: '15px',
    background: '#4a9eff',
    border: 'none', borderRadius: 10,
    color: '#060810',
    fontFamily: "'Space Mono', monospace",
    fontSize: 11, letterSpacing: '.16em',
    fontWeight: 700, marginBottom: 14,
    transition: 'opacity 0.2s ease',
  },
  error: {
    fontSize: 12, color: '#ff6b6b',
    marginBottom: 10,
    fontFamily: "'Space Mono', monospace",
    letterSpacing: '.06em',
  },
  fine: {
    fontSize: 11, color: 'rgba(80,105,150,.5)',
    textAlign: 'center', fontFamily: "'Space Mono', monospace",
    letterSpacing: '.08em',
  },
  successWrap: {
    textAlign: 'center', padding: '16px 0',
  },
  checkCircle: {
    width: 52, height: 52, borderRadius: '50%',
    border: '1px solid rgba(74,158,255,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: '#4a9eff',
    margin: '0 auto 20px',
  },
  successTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 38, color: '#fff',
    letterSpacing: '.04em', marginBottom: 8,
  },
  successSub: {
    color: 'rgba(140,165,210,.6)',
    fontFamily: "'Space Mono', monospace",
    fontSize: 10, letterSpacing: '.14em',
  },
}
