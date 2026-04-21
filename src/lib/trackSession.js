import { supabase } from './supabase'

export async function createSession(email, deviceType) {
  console.log('[tracking] createSession called', email, deviceType)
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert([{
        email: email || null,
        device_type: deviceType || 'unknown',
        created_at: new Date().toISOString()
      }])
      .select('id')
    console.log('[tracking] createSession result', data, error)
    if (error) { console.error('[tracking] createSession error', error); return null }
    return data[0].id
  } catch (err) {
    console.error('[tracking] createSession exception', err)
    return null
  }
}

export async function trackQuizAnswers(sessionId, answers) {
  console.log('[tracking] trackQuizAnswers called', sessionId, answers)
  if (!sessionId) { console.error('[tracking] no sessionId'); return }
  if (!answers || Object.keys(answers).length === 0) { console.error('[tracking] empty answers'); return }
  try {
    const rows = Object.entries(answers).map(([key, value]) => ({
      session_id: sessionId,
      question_key: key,
      question_text: key,
      answer_value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      created_at: new Date().toISOString()
    }))
    console.log('[tracking] inserting rows', rows)
    const { data, error } = await supabase.from('quiz_answers').insert(rows).select()
    console.log('[tracking] quiz_answers result', data, error)
    if (error) console.error('[tracking] quiz_answers error', error)
  } catch (err) {
    console.error('[tracking] quiz_answers exception', err)
  }
}

export async function trackProtocolOutput(sessionId, email, protocol) {
  console.log('[tracking] trackProtocolOutput called', sessionId, email, protocol)
  if (!sessionId) { console.error('[tracking] no sessionId for protocol'); return }
  try {
    const { data, error } = await supabase
      .from('protocol_outputs')
      .insert([{
        session_id: sessionId,
        email: email || null,
        protocol_name: protocol.protocolName || null,
        primary_peptide: protocol.primaryPeptide?.name || null,
        secondary_peptide: protocol.secondaryPeptide?.name || null,
        support_peptide: protocol.supportPeptide?.name || null,
        full_protocol_json: protocol,
        solas_link_shown: true,
        created_at: new Date().toISOString()
      }])
      .select()
    console.log('[tracking] protocol_outputs result', data, error)
    if (error) console.error('[tracking] protocol_outputs error', error)
  } catch (err) {
    console.error('[tracking] protocol_outputs exception', err)
  }
}

export async function trackSolasClick(sessionId) {
  if (!sessionId) return
  try {
    await supabase
      .from('protocol_outputs')
      .update({ solas_link_clicked: true })
      .eq('session_id', sessionId)
  } catch (err) {
    console.error('[tracking] solas click error', err)
  }
}

function getDeviceType() {
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}