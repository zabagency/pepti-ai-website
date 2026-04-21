import { supabase } from './supabase'

export async function createSession(email, deviceType) {
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
    return data[0].id
  } catch (err) {
    console.error('Session tracking error:', err)
    return null
  }
}

export async function trackQuizAnswers(sessionId, answers) {
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
  } catch (err) {
    console.error('Answer tracking error:', err)
  }
}

export async function trackProtocolOutput(sessionId, email, protocol) {
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
  } catch (err) {
    console.error('Protocol tracking error:', err)
  }
}

export async function trackSolasClick(sessionId) {
  try {
    await supabase
      .from('protocol_outputs')
      .update({ solas_link_clicked: true })
      .eq('session_id', sessionId)
  } catch (err) {
    console.error('Solas click tracking error:', err)
  }
}

function getDeviceType() {
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}
