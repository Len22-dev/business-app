// "use client"

// import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/components/ui/use-toast'
// import type { User } from '@supabase/supabase-js'

// // Types
// export type UserRole = 'owner' | 'admin' | 'manager' | 'employee' | 'viewer'

// export interface Business {
//   id: string
//   name: string
//   description?: string
//   email?: string
//   phone?: string
//   website?: string
//   logo?: string
//   address?: string
//   taxId?: string
//   currency: string
//   timezone: string
//   fiscalYearStart?: number
//   isActive: boolean
//   created_at: Date
//   updated_at: Date
//   deleted_at?: Date
// }

// export interface BusinessUser {
//   id: string
//   businessId: string
//   userId: string
//   role: UserRole
//   permissions?: Record<string, boolean>
//   isActive: boolean
//   created_at: Date
//   updated_at: Date
// }

// export interface BusinessWithUsers extends Business {
//   businessUsers: (BusinessUser & {
//     user: User
//   })[]
// }

// interface BusinessContextType {
//   // State
//   user: User | null
//   businesses: Business[]
//   currentBusiness: Business | null
//   userRole: UserRole | null
//   isLoading: boolean
//   error: string | null

//   // Actions
//   setCurrentBusiness: (business: Business | null) => void
//   refreshBusinesses: () => Promise<void>
//   createBusiness: (businessData: Partial<Business>) => Promise<Business | null>
//   updateBusiness: (businessId: string, businessData: Partial<Business>) => Promise<Business | null>
//   deleteBusiness: (businessId: string) => Promise<boolean>
  
//   // User management
//   inviteUser: (email: string, role: UserRole) => Promise<boolean>
//   updateUserRole: (userId: string, role: UserRole) => Promise<boolean>
//   removeUser: (userId: string) => Promise<boolean>
  
//   // Permissions
//   hasPermission: (permission: string) => boolean
//   canManageUsers: () => boolean
//   canManageSettings: () => boolean
//   canViewFinancials: () => boolean
// }

// const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

// export function useBusinessContext() {
//   const context = useContext(BusinessContext)
//   if (context === undefined) {
//     throw new Error('useBusinessContext must be used within a BusinessProvider')
//   }
//   return context
// }

// interface BusinessProviderProps {
//   children: React.ReactNode
// }

// export function BusinessProvider({ children }: BusinessProviderProps) {
//   const [user, setUser] = useState<User | null>(null)
//   const [businesses, setBusinesses] = useState<Business[]>([])
//   const [currentBusiness, setCurrentBusinessState] = useState<Business | null>(null)
//   const [userRole, setUserRole] = useState<UserRole | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const router = useRouter()
//   const { toast } = useToast()
//   const supabase = createClient()

//   const setCurrentBusiness = useCallback(async(business: Business | null) => {
//     try {
//       setCurrentBusinessState(business)
      
//       if (business) {
//         localStorage.setItem('currentBusinessId', business.id)
        
//         // Fetch user role in this business
//         if (user) {
//           const response = await fetch(`/api/businesses/${business.id}/users/${user.id}/role`)
//           if (response.ok) {
//             const roleData = await response.json()
//             setUserRole(roleData.role)
//           }
//         }
//       } else {
//         localStorage.removeItem('currentBusinessId')
//         setUserRole(null)
//       }
//     } catch (err) {
//       console.error('Error setting current business:', err)
//       toast({
//         title: "Error",
//         description: "Failed to switch business context.",
//         variant: "destructive",
//       })
//     }
//   }, [user, toast])

//   // Initialize user and businesses
//   const fetchBusinesses = useCallback(async (userId: string) => {
//    try {
//      const response = await fetch(`/api/businesses?userId=${userId}`)
     
//      if (!response.ok) {
//        throw new Error('Failed to fetch businesses')
//      }

//      const data = await response.json()
//      setBusinesses(data.businesses || [])

//      // Set current business from localStorage or first business
//      const savedBusinessId = localStorage.getItem('currentBusinessId')
//      let businessToSet: Business | null = null

//      if (savedBusinessId) {
//        businessToSet = data.businesses.find((b: Business) => b.id === savedBusinessId) || null
//      }

//      if (!businessToSet && data.businesses.length > 0) {
//        businessToSet = data.businesses[0]
//      }

//      if (businessToSet) {
//        await setCurrentBusiness(businessToSet)
//      }

//    } catch (err) {
//      console.error('Error fetching businesses:', err)
//      setError('Failed to load businesses')
//      toast({
//        title: "Error",
//        description: "Failed to load your businesses. Please try again.",
//        variant: "destructive",
//      })
//    }
//  }, [toast,setCurrentBusiness])
  
 
//  useEffect(() => {
//     async function initializeContext() {
//       try {
//         setIsLoading(true)
//         setError(null)

//         // Get current user
//         const { data: { user }, error: userError } = await supabase.auth.getUser()
        
//         if (userError) {
//           console.error('Error getting user:', userError)
//           setError('Failed to authenticate user')
//           router.push('/auth/login')
//           return
//         }

//         if (!user) {
//           router.push('/auth/login')
//           return
//         }

//         setUser(user)

//         // Fetch user's businesses
//         await fetchBusinesses(user.id)
        
//       } catch (err) {
//         console.error('Error initializing business context:', err)
//         setError('Failed to initialize application')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     initializeContext()
//   }, [router, supabase.auth, fetchBusinesses])

//   // Listen for auth changes
//   useEffect(() => {
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === 'SIGNED_OUT' || !session) {
//           setUser(null)
//           setBusinesses([])
//           setCurrentBusinessState(null)
//           setUserRole(null)
//           router.push('/auth/login')
//         } else if (event === 'SIGNED_IN' && session.user) {
//           setUser(session.user)
//           await fetchBusinesses(session.user.id)
//         }
//       }
//     )

//     return () => subscription.unsubscribe()
//   }, [router, supabase.auth, fetchBusinesses])

//   // Fetch businesses for user

//   // Set current business and fetch user role
  
//   // Refresh businesses
//   async function refreshBusinesses() {
//     if (user) {
//       await fetchBusinesses(user.id)
//     }
//   }

//   // Create new business
//   async function createBusiness(businessData: Partial<Business>): Promise<Business | null> {
//     try {
//       const response = await fetch('/api/businesses', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(businessData),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to create business')
//       }

//       const newBusiness = await response.json()
//       await refreshBusinesses()
      
//       toast({
//         title: "Success",
//         description: "Business created successfully!",
//       })

//       return newBusiness
//     } catch (err) {
//       console.error('Error creating business:', err)
//       toast({
//         title: "Error",
//         description: "Failed to create business. Please try again.",
//         variant: "destructive",
//       })
//       return null
//     }
//   }

//   // Update business
//   async function updateBusiness(businessId: string, businessData: Partial<Business>): Promise<Business | null> {
//     try {
//       const response = await fetch(`/api/businesses/${businessId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(businessData),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update business')
//       }

//       const updatedBusiness = await response.json()
//       await refreshBusinesses()
      
//       // Update current business if it's the one being updated
//       if (currentBusiness?.id === businessId) {
//         setCurrentBusinessState(updatedBusiness)
//       }

//       toast({
//         title: "Success",
//         description: "Business updated successfully!",
//       })

//       return updatedBusiness
//     } catch (err) {
//       console.error('Error updating business:', err)
//       toast({
//         title: "Error",
//         description: "Failed to update business. Please try again.",
//         variant: "destructive",
//       })
//       return null
//     }
//   }

//   // Delete business
//   async function deleteBusiness(businessId: string): Promise<boolean> {
//     try {
//       const response = await fetch(`/api/businesses/${businessId}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         throw new Error('Failed to delete business')
//       }

//       await refreshBusinesses()
      
//       // Clear current business if it's the one being deleted
//       if (currentBusiness?.id === businessId) {
//         setCurrentBusiness(null)
//       }

//       toast({
//         title: "Success",
//         description: "Business deleted successfully!",
//       })

//       return true
//     } catch (err) {
//       console.error('Error deleting business:', err)
//       toast({
//         title: "Error",
//         description: "Failed to delete business. Please try again.",
//         variant: "destructive",
//       })
//       return false
//     }
//   }

//   // Invite user to business
//   async function inviteUser(email: string, role: UserRole): Promise<boolean> {
//     try {
//       if (!currentBusiness) {
//         throw new Error('No business selected')
//       }

//       const response = await fetch(`/api/businesses/${currentBusiness.id}/users/invite`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, role }),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to invite user')
//       }

//       toast({
//         title: "Success",
//         description: "User invitation sent successfully!",
//       })

//       return true
//     } catch (err) {
//       console.error('Error inviting user:', err)
//       toast({
//         title: "Error",
//         description: "Failed to invite user. Please try again.",
//         variant: "destructive",
//       })
//       return false
//     }
//   }

//   // Update user role
//   async function updateUserRole(userId: string, role: UserRole): Promise<boolean> {
//     try {
//       if (!currentBusiness) {
//         throw new Error('No business selected')
//       }

//       const response = await fetch(`/api/businesses/${currentBusiness.id}/users/${userId}/role`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ role }),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update user role')
//       }

//       toast({
//         title: "Success",
//         description: "User role updated successfully!",
//       })

//       return true
//     } catch (err) {
//       console.error('Error updating user role:', err)
//       toast({
//         title: "Error",
//         description: "Failed to update user role. Please try again.",
//         variant: "destructive",
//       })
//       return false
//     }
//   }

//   // Remove user from business
//   async function removeUser(userId: string): Promise<boolean> {
//     try {
//       if (!currentBusiness) {
//         throw new Error('No business selected')
//       }

//       const response = await fetch(`/api/businesses/${currentBusiness.id}/users/${userId}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         throw new Error('Failed to remove user')
//       }

//       toast({
//         title: "Success",
//         description: "User removed successfully!",
//       })

//       return true
//     } catch (err) {
//       console.error('Error removing user:', err)
//       toast({
//         title: "Error",
//         description: "Failed to remove user. Please try again.",
//         variant: "destructive",
//       })
//       return false
//     }
//   }

//   // Permission helpers
//   function hasPermission(permission: string): boolean {
//     if (!userRole) return false
    
//     // Owners and admins have all permissions
//     if (userRole === 'owner' || userRole === 'admin') return true
    
//     // Add specific permission logic here based on your requirements
//     switch (permission) {
//       case 'manage_users':
//         return userRole === 'manager'
//       case 'view_financials':
//         return ['manager', 'employee'].includes(userRole)
//       case 'manage_settings':
//         return userRole === 'manager'
//       default:
//         return false
//     }
//   }

//   function canManageUsers(): boolean {
//     return hasPermission('manage_users')
//   }

//   function canManageSettings(): boolean {
//     return hasPermission('manage_settings')
//   }

//   function canViewFinancials(): boolean {
//     return hasPermission('view_financials')
//   }

//   const contextValue: BusinessContextType = {
//     // State
//     user,
//     businesses,
//     currentBusiness,
//     userRole,
//     isLoading,
//     error,

//     // Actions
//     setCurrentBusiness,
//     refreshBusinesses,
//     createBusiness,
//     updateBusiness,
//     deleteBusiness,

//     // User management
//     inviteUser,
//     updateUserRole,
//     removeUser,

//     // Permissions
//     hasPermission,
//     canManageUsers,
//     canManageSettings,
//     canViewFinancials,
//   }

//   return (
//     <BusinessContext.Provider value={contextValue}>
//       {children}
//     </BusinessContext.Provider>
//   )
// }