import { supabase } from './supabase'

export async function submitWaitlist(email) {
  // 1. Save to Supabase (skipped if not yet configured)
  if (supabase) {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, created_at: new Date().toISOString() }])

    if (error && error.code !== '23505') throw error
  }

  // 2. Send welcome email via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Pepti AI <peptiapp@gmail.com>',
      to: email,
      subject: "You're on the list.",
      html: `
        <div style="background:#060810;color:#e0e8ff;font-family:'Inter',sans-serif;padding:48px 32px;max-width:480px;margin:0 auto;border-radius:16px;">
          <p style="font-size:13px;letter-spacing:0.2em;color:#4a9eff;font-family:monospace;margin-bottom:24px;">PEPTI AI</p>
          <h1 style="font-size:32px;font-weight:700;color:#ffffff;margin-bottom:16px;line-height:1.2;">You're in.</h1>
          <p style="font-size:15px;line-height:1.7;color:rgba(220,232,255,0.75);margin-bottom:16px;">
            We got your email. You're on the Pepti AI waitlist.
          </p>
          <p style="font-size:15px;line-height:1.7;color:rgba(220,232,255,0.75);margin-bottom:16px;">
            When the full app drops — personalized peptide education, your full profile, and everything we couldn't put on the web — you'll be first to know.
          </p>
          <p style="font-size:15px;line-height:1.7;color:rgba(220,232,255,0.75);margin-bottom:32px;">
            Don't overthink it. Just don't miss it.
          </p>
          <div style="height:1px;background:rgba(74,158,255,0.2);margin-bottom:32px;"></div>
          <p style="font-size:12px;color:rgba(80,105,150,0.6);line-height:1.6;">
            Pepti AI — educational research platform. This is not medical advice.
            Consult a licensed physician before using any research compound.
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('Resend error:', err)
    // Don't block the user if email fails — just log it
  }

  return true
}
