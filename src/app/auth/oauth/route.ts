import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { businessQueries } from '@/lib/drizzle/queries/business-queries'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/protected/dashboard'

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if user has any businesses
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        try {
          const { businesses } = await businessQueries.getByUserId(user.id, { limit: 1, offset: 0 })
          
          // If user has no businesses, redirect to business setup
          if (businesses.length === 0) {
            redirect('/auth/businessSetup')
          }
        } catch (error) {
          console.error('Error checking user businesses:', error)
          // If there's an error checking businesses, redirect to business setup to be safe
          redirect('/auth/businessSetup')
        }
      }
      
      // If user has businesses, redirect to the intended destination
      redirect(next)
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`)
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=No authorization code`)
}