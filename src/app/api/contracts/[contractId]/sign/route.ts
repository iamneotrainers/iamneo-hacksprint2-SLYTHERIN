import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH /api/contracts/[contractId]/sign - Freelancer signs the agreement
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ contractId: string }> }
) {
    try {
        const { contractId } = await params;
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { signature } = body;

        if (!signature) {
            return NextResponse.json({ error: 'Signature is required' }, { status: 400 });
        }

        // Update contract with freelancer signature
        const { data: contract, error } = await supabase
            .from('contracts')
            .update({
                freelancer_signature: signature,
                freelancer_signed_at: new Date().toISOString()
            })
            .eq('id', contractId)
            .eq('freelancer_id', user.id) // Ensure only the freelancer can sign here
            .select()
            .single();

        if (error) {
            console.error('Error signing contract:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(contract);
    } catch (error: any) {
        console.error('Error in PATCH /api/contracts/[contractId]/sign:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
