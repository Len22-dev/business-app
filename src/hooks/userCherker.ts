import { createClient } from "@/lib/supabase/server";
    import { redirect } from "next/navigation";

type RequiredRole = 'owner' | 'admin' | 'manager' | 'employee' | 'accountant';

export async function AuthChecker( 
    requiredRole?: RequiredRole
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('Unauthorized user');
        redirect('/auth/login');
    }

    if (user.id) {
        const { data: business } = await supabase
            .from('business_users')
            .select('role, business_id, permissions, is_active')
            .eq('user_id', user.id)
            .single();

        if (!business) {
            console.log('User lacks access to business');
            redirect('/auth/businessSetup');
            
        }

        // Check role hierarchy
        if (requiredRole) {
            const roleHierarchy = { owner: 5, admin: 4, manager: 3, accountant: 2, employee: 1 };
            const userRoleLevel = roleHierarchy[business.role as RequiredRole];
            const requiredRoleLevel = roleHierarchy[requiredRole];

            if (userRoleLevel < requiredRoleLevel) {
                console.log('Insufficient role:', business.role, 'required:', requiredRole);
                redirect('/forbidden');
            }
        }

        return { user, business};
    }

    return { user };
}