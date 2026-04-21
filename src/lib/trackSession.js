import { supabase } from './supabase'

export async function createSession(email, deviceType) {
  if (!supabase) {
    console.warn('[tracking] Supabase not configured — skipping createSession')
    return null
  }
  console.log('[tracking] createSession →', email, deviceType)
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert([{
        email,
        device_type: deviceType || getDeviceType(),
        created_at: new Date().toISOString()
      }])
      .select()
    if (error) throw error
    const sid = data[0].id
    console.log('[tracking] createSession ✓ sessionId =', sid)
    return sid
  } catch (err) {
    console.error('[tracking] createSession ✗', err)
    return null
  }
}

export async function trackQuizAnswers(sessionId, answers) {
  if (!supabase) {
    console.warn('[tracking] Supabase not configured — skipping trackQuizAnswers')
    return
  }
  if (!sessionId) {
    console.warn('[tracking] trackQuizAnswers — no sessionId, skipping')
    return
  }
  console.log('[tracking] trackQuizAnswers → sessionId:', sessionId, '| answer count:', Object.keys(answers).length)
  try {
    const rows = Object.entries(answers).map(([key, value]) => ({
      session_id: sessionId,
      question_key: key,
      question_text: key,
      answer_value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      created_at: new Date().toISOString()
    }))
    const { error } = await supabase.from('quiz_answers').insert(rows)
    if (error) throw error
    console.log('[tracking] trackQuizAnswers ✓', rows.length, 'rows inserted')
  } catch (err) {
    console.error('[tracking] trackQuizAnswers ✗', err)
  }
}

export async function trackProtocolOutput(sessionId, email, protocol) {
  if (!supabase) {
    console.warn('[tracking] Supabase not configured — skipping trackProtocolOutput')
    return
  }
  if (!sessionId) {
    console.warn('[tracking] trackProtocolOutput — no sessionId, skipping')
    return
  }
  console.log('[tracking] trackProtocolOutput → sessionId:', sessionId, '| protocol:', protocol?.protocolName)
  try {
    const { error } = await supabase
      .from('protocol_outputs')
      .insert([{
        session_id: sessionId,
        email,
        protocol_name: protocol.protocolName || null,
        primary_peptide: protocol.primaryPeptide?.name || null,
        secondary_peptide: protocol.secondaryPeptide?.name || null,
        support_peptide: protocol.supportPeptide?.name || null,
        full_protocol_json: protocol,
        solas_link_shown: !!(protocol.primaryPeptide || protocol.secondaryPeptide || protocol.supportPeptide),
        created_at: new Date().toISOString()
      }])
    if (error) throw error
    console.log('[tracking] trackProtocolOutput ✓')
  } catch (err) {
    console.error('[tracking] trackProtocolOutput ✗', err)
  }
}

export async function trackSolasClick(sessionId) {
  if (!supabase) {
    console.warn('[tracking] Supabase not configured — skipping trackSolasClick')
    return
  }
  if (!sessionId) {
    console.warn('[tracking] trackSolasClick — no sessionId, skipping')
    return
  }
  console.log('[tracking] trackSolasClick → sessionId:', sessionId)
  try {
    const { error } = await supabase
      .from('protocol_outputs')
      .update({ solas_link_clicked: true })
      .eq('session_id', sessionId)
    if (error) throw error
    console.log('[tracking] trackSolasClick ✓')
  } catch (err) {
    console.error('[tracking] trackSolasClick ✗', err)
  }
}

function getDeviceType() {
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}
