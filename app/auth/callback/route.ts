import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const next = searchParams.get('next') ?? '/dashboard';

    const supabase = await createClient();

    // ── OAuth / Magic Link flow (code exchange) ──
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single();

                if (!profile?.onboarding_completed) {
                    return NextResponse.redirect(`${origin}/onboarding`);
                }
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // ── Password Reset flow (token_hash exchange) ──
    if (token_hash && type === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'recovery',
        });

        if (!error) {
            // Session is now established — send user to set their new password
            return NextResponse.redirect(`${origin}/update-password`);
        }
    }

    // ── Email confirmation flow (token_hash, type=signup/email) ──
    if (token_hash && (type === 'signup' || type === 'email')) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'email',
        });

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Fallback — authentication failed
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate`);
}
