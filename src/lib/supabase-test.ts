import { supabase } from '@/lib/supabase'

// Test function to check Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('sell_form_submissions')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection successful!')
    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

// Test function to insert test data
export const testInsertData = async () => {
  try {
    console.log('Testing data insertion...')
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      address: '123 Test St',
      city: 'Test City',
      contact_method: 'email',
      best_time: 'morning',
      property_type: 'apartment',
      surface_area: '100',
      bedrooms: '2',
      bathrooms: '1',
      year_built: '2020',
      condition: 'good',
      features: 'Test features',
      urgency: 'flexible',
      desired_price: '500000',
      mortgage: 'no',
      viewing_availability: 'Weekends',
      additional_info: 'Test submission'
    }
    
    const { data, error } = await supabase
      .from('sell_form_submissions')
      .insert([testData])
    
    if (error) {
      console.error('Insert error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Test data inserted successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: 'Unexpected error occurred' }
  }
}
