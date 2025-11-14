// Supabase Edge Function pour envoyer un résumé quotidien de toutes les soumissions
// À déployer dans Supabase Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_VDBkqGSc_GfUSsyvDjDoytn6aZnuD9jyn'
const FROM_EMAIL = 'daily-digest@jaibaba759.resend.app'
const TO_EMAIL = 'mlecroc@gmail.com'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting daily digest generation...')

    // Créer un client Supabase avec la clé service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Calculer la date d'hier à minuit et aujourd'hui à minuit
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    console.log(`Fetching submissions from ${yesterday.toISOString()} to ${today.toISOString()}`)

    // Récupérer toutes les soumissions du formulaire "Sell" des dernières 24h
    const { data: sellSubmissions, error: sellError } = await supabase
      .from('sell_form_submissions')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    if (sellError) {
      console.error('Error fetching sell submissions:', sellError)
      throw sellError
    }

    // Récupérer toutes les soumissions du formulaire "Contact" des dernières 24h
    const { data: contactSubmissions, error: contactError } = await supabase
      .from('contact_form_submissions')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    if (contactError) {
      console.error('Error fetching contact submissions:', contactError)
      throw contactError
    }

    // Récupérer toutes les demandes de rénovation des dernières 24h
    const { data: renovationSubmissions, error: renovationError } = await supabase
      .from('renovation_requests')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    if (renovationError) {
      console.error('Error fetching renovation requests:', renovationError)
      throw renovationError
    }

    const totalSubmissions = 
      (sellSubmissions?.length || 0) + 
      (contactSubmissions?.length || 0) + 
      (renovationSubmissions?.length || 0)

    console.log(`Found ${totalSubmissions} total submissions`)

    // Si aucune soumission, ne pas envoyer d'email
    if (totalSubmissions === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No submissions today, email not sent' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Générer le HTML pour l'email
    const emailHtml = generateDigestEmail(sellSubmissions || [], contactSubmissions || [], renovationSubmissions || [], yesterday, today)

    // Envoyer l'email via Resend
    console.log('Sending daily digest email...')
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `📊 INNLUXE - Résumé quotidien (${totalSubmissions} soumission${totalSubmissions > 1 ? 's' : ''})`,
        html: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Resend API error:', errorText)
      throw new Error(`Resend API error: ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Daily digest sent',
      totalSubmissions,
      emailId: emailResult.id
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })

  } catch (error) {
    console.error('Error in daily digest:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})

function generateDigestEmail(
  sellSubmissions: any[], 
  contactSubmissions: any[], 
  renovationSubmissions: any[],
  startDate: Date,
  endDate: Date
): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: #333; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container { 
      background: white; 
      padding: 30px; 
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 3px solid #000;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 { 
      color: #000; 
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 300;
      letter-spacing: 2px;
    }
    .date-range {
      color: #666;
      font-size: 14px;
    }
    .summary {
      background: #f8f8f8;
      padding: 20px;
      border-radius: 6px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .summary-item {
      flex: 1;
    }
    .summary-number {
      font-size: 32px;
      font-weight: bold;
      color: #000;
    }
    .summary-label {
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .section { 
      margin: 30px 0;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    h2 { 
      color: #000; 
      font-size: 18px;
      font-weight: 400;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .submission {
      background: #fafafa;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 6px;
      border-left: 4px solid #000;
    }
    .submission-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    }
    .submission-name {
      font-weight: 600;
      color: #000;
      font-size: 16px;
    }
    .submission-time {
      color: #888;
      font-size: 12px;
    }
    .field { 
      margin: 8px 0;
      font-size: 14px;
    }
    .field-label { 
      font-weight: 600; 
      color: #555;
      display: inline-block;
      min-width: 120px;
    }
    .field-value { 
      color: #333;
    }
    .no-submissions {
      text-align: center;
      padding: 30px;
      color: #999;
      font-style: italic;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #888;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>INNLUXE</h1>
      <div class="date-range">Résumé quotidien du ${formatDate(startDate)}</div>
    </div>

    <div class="summary">
      <div class="summary-item">
        <div class="summary-number">${sellSubmissions.length}</div>
        <div class="summary-label">Ventes</div>
      </div>
      <div class="summary-item">
        <div class="summary-number">${contactSubmissions.length}</div>
        <div class="summary-label">Contacts</div>
      </div>
      <div class="summary-item">
        <div class="summary-number">${renovationSubmissions.length}</div>
        <div class="summary-label">Rénovations</div>
      </div>
      <div class="summary-item">
        <div class="summary-number">${sellSubmissions.length + contactSubmissions.length + renovationSubmissions.length}</div>
        <div class="summary-label">Total</div>
      </div>
    </div>
`

  // Section Sell Submissions
  if (sellSubmissions.length > 0) {
    html += `
    <div class="section">
      <h2>📋 Demandes de Vente (${sellSubmissions.length})</h2>
`
    sellSubmissions.forEach((sub: any) => {
      html += `
      <div class="submission">
        <div class="submission-header">
          <span class="submission-name">${sub.name || 'N/A'}</span>
          <span class="submission-time">${formatDateTime(sub.created_at)}</span>
        </div>
        <div class="field"><span class="field-label">Email:</span> <span class="field-value">${sub.email || 'N/A'}</span></div>
        <div class="field"><span class="field-label">Téléphone:</span> <span class="field-value">${sub.phone || 'N/A'}</span></div>
        <div class="field"><span class="field-label">Adresse:</span> <span class="field-value">${sub.address || 'N/A'}</span></div>
        <div class="field"><span class="field-label">Ville:</span> <span class="field-value">${sub.city || 'N/A'}</span></div>
        <div class="field"><span class="field-label">Type:</span> <span class="field-value">${sub.property_type || 'N/A'}</span></div>
        <div class="field"><span class="field-label">Surface:</span> <span class="field-value">${sub.property_size || 'N/A'} m²</span></div>
        <div class="field"><span class="field-label">Budget:</span> <span class="field-value">${sub.budget || 'N/A'}</span></div>
        ${sub.special_features ? `<div class="field"><span class="field-label">Caractéristiques:</span> <span class="field-value">${sub.special_features}</span></div>` : ''}
      </div>
`
    })
    html += `</div>`
  }

  // Section Contact Submissions
  if (contactSubmissions.length > 0) {
    html += `
    <div class="section">
      <h2>💬 Messages de Contact (${contactSubmissions.length})</h2>
`
    contactSubmissions.forEach((sub: any) => {
      html += `
      <div class="submission">
        <div class="submission-header">
          <span class="submission-name">${sub.name || 'N/A'}</span>
          <span class="submission-time">${formatDateTime(sub.created_at)}</span>
        </div>
        <div class="field"><span class="field-label">Email:</span> <span class="field-value">${sub.email || 'N/A'}</span></div>
        ${sub.phone ? `<div class="field"><span class="field-label">Téléphone:</span> <span class="field-value">${sub.phone}</span></div>` : ''}
        <div class="field"><span class="field-label">Message:</span> <span class="field-value">${sub.message || 'N/A'}</span></div>
      </div>
`
    })
    html += `</div>`
  }

  // Section Renovation Requests
  if (renovationSubmissions.length > 0) {
    html += `
    <div class="section">
      <h2>🔨 Demandes de Rénovation (${renovationSubmissions.length})</h2>
`
    renovationSubmissions.forEach((sub: any) => {
      html += `
      <div class="submission">
        <div class="submission-header">
          <span class="submission-name">${sub.name || 'N/A'}</span>
          <span class="submission-time">${formatDateTime(sub.created_at)}</span>
        </div>
        <div class="field"><span class="field-label">Email:</span> <span class="field-value">${sub.email || 'N/A'}</span></div>
        <div class="field"><span class="field-label">Téléphone:</span> <span class="field-value">${sub.phone || 'N/A'}</span></div>
        ${sub.address ? `<div class="field"><span class="field-label">Adresse:</span> <span class="field-value">${sub.address}</span></div>` : ''}
        ${sub.project_type ? `<div class="field"><span class="field-label">Type de projet:</span> <span class="field-value">${sub.project_type}</span></div>` : ''}
        ${sub.budget ? `<div class="field"><span class="field-label">Budget:</span> <span class="field-value">${sub.budget}</span></div>` : ''}
        ${sub.description ? `<div class="field"><span class="field-label">Description:</span> <span class="field-value">${sub.description}</span></div>` : ''}
      </div>
`
    })
    html += `</div>`
  }

  html += `
    <div class="footer">
      <p>INNLUXE - Résumé automatique quotidien</p>
      <p>Email généré automatiquement - Ne pas répondre</p>
    </div>
  </div>
</body>
</html>
`

  return html
}

