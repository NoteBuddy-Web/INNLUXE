// Supabase Edge Function pour envoyer des notifications email immédiates
// Copiez ce code dans Supabase Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_VDBkqGSc_GfUSsyvDjDoytn6aZnuD9jyn'
const FROM_EMAIL = 'your-alias@jaibaba759.resend.app' // Email vérifié dans Resend (domaine Resend)
const TO_EMAIL = 'mlecroc@gmail.com' // Email de réception

// Headers CORS pour permettre les requêtes depuis le navigateur
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Vérifier que la requête a un body
    let body;
    try {
      body = await req.text();
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: 'Failed to read request body',
        message: e.message
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }
    
    if (!body || body.trim() === '') {
      return new Response(JSON.stringify({ 
        error: 'Empty request body',
        message: 'No data provided'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    // Parser le JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON',
        message: parseError.message,
        receivedBody: body.substring(0, 200) // Premiers 200 caractères pour debug
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const { table, record } = parsedBody;
    
    // Vérifier que table et record existent
    if (!table || !record) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        message: 'Both "table" and "record" are required',
        received: { table, hasRecord: !!record }
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }
    
    // Déterminer le type de formulaire
    let subject = ''
    let content = ''
    
    switch (table) {
      case 'sell_form_submissions':
        subject = '🏠 Nouvelle demande de vente - INNLUXE'
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🏠 Nouvelle demande de vente</h1>
            </div>
            <div style="padding: 20px; background: #f8f9fa;">
              <h2 style="color: #333;">Informations du client</h2>
              <p><strong>Nom:</strong> ${record.name}</p>
              <p><strong>Email:</strong> ${record.email}</p>
              <p><strong>Téléphone:</strong> ${record.phone}</p>
              <p><strong>Adresse:</strong> ${record.address}, ${record.city}</p>
              <p><strong>Méthode de contact préférée:</strong> ${record.contact_method}</p>
              ${record.best_time ? `<p><strong>Meilleur moment pour contacter:</strong> ${record.best_time}</p>` : ''}
              
              <h2 style="color: #333; margin-top: 30px;">Détails du bien</h2>
              <p><strong>Type de bien:</strong> ${record.property_type || 'Non spécifié'}</p>
              ${record.surface_area ? `<p><strong>Surface:</strong> ${record.surface_area} m²</p>` : ''}
              ${record.bedrooms ? `<p><strong>Chambres:</strong> ${record.bedrooms}</p>` : ''}
              ${record.bathrooms ? `<p><strong>Salles de bain:</strong> ${record.bathrooms}</p>` : ''}
              ${record.year_built ? `<p><strong>Année de construction:</strong> ${record.year_built}</p>` : ''}
              <p><strong>État:</strong> ${record.condition || 'Non spécifié'}</p>
              ${record.features ? `<p><strong>Caractéristiques:</strong> ${record.features}</p>` : ''}
              <p><strong>Urgence:</strong> ${record.urgency || 'Non spécifiée'}</p>
              
              <h2 style="color: #333; margin-top: 30px;">Informations financières</h2>
              <p><strong>Prix souhaité:</strong> ${record.desired_price || 'Non spécifié'}</p>
              <p><strong>Prêt en cours:</strong> ${record.mortgage || 'Non spécifié'}</p>
              <p><strong>Disponibilité pour visite:</strong> ${record.viewing_availability || 'Non spécifiée'}</p>
              ${record.additional_info ? `<p><strong>Informations supplémentaires:</strong> ${record.additional_info}</p>` : ''}
              
              <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px;">
                <p style="margin: 0; font-size: 12px; color: #666;">Date de soumission: ${new Date(record.created_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        `
        break
        
      case 'renovation_form_submissions':
        subject = '🔨 Nouvelle demande de rénovation - INNLUXE'
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🔨 Nouvelle demande de rénovation</h1>
            </div>
            <div style="padding: 20px; background: #f8f9fa;">
              <h2 style="color: #333;">Informations du client</h2>
              <p><strong>Nom:</strong> ${record.name}</p>
              <p><strong>Email:</strong> ${record.email}</p>
              <p><strong>Téléphone:</strong> ${record.phone}</p>
              <p><strong>Adresse:</strong> ${record.address}, ${record.city}</p>
              
              <h2 style="color: #333; margin-top: 30px;">Détails de la demande</h2>
              <p><strong>Type de réparation:</strong> ${record.repair_type}</p>
              <p><strong>Urgence:</strong> ${record.urgency}</p>
              <p><strong>Description:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 5px;">${record.description}</p>
              
              <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px;">
                <p style="margin: 0; font-size: 12px; color: #666;">Date de soumission: ${new Date(record.created_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        `
        break
        
      case 'contact_form_submissions':
        subject = '📞 Nouveau message de contact - INNLUXE'
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">📞 Nouveau message de contact</h1>
            </div>
            <div style="padding: 20px; background: #f8f9fa;">
              <h2 style="color: #333;">Informations du contact</h2>
              <p><strong>Nom:</strong> ${record.name}</p>
              <p><strong>Email:</strong> ${record.email}</p>
              ${record.phone ? `<p><strong>Téléphone:</strong> ${record.phone}</p>` : ''}
              
              <h2 style="color: #333; margin-top: 30px;">Message</h2>
              <p style="background: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${record.message}</p>
              
              <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px;">
                <p style="margin: 0; font-size: 12px; color: #666;">Date de soumission: ${new Date(record.created_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        `
        break
    }
    
    // Envoyer l'email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: subject,
        html: content,
      }),
    })
    
    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`)
    }
    
    const emailResult = await emailResponse.json()
    
    return new Response(JSON.stringify({ 
      success: true,
      emailId: emailResult.id,
      table: table
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    })
    
  } catch (error) {
    console.error('Error in send-notification function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    })
  }
})

