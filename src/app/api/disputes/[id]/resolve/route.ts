import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/disputes/[id]/resolve
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { decision } = body; // 'RELEASE' or 'REFUND'

        // 1. Verify Arbitrator
        const { data: dispute } = await supabase
            .from('disputes')
            .select('*')
            .eq('id', id)
            .single();

        if (!dispute || dispute.arbitrator_id !== user.id) {
            return NextResponse.json({ error: 'Only the assigned arbitrator can resolve this.' }, { status: 403 });
        }

        if (dispute.status === 'RESOLVED') {
            return NextResponse.json({ error: 'Dispute already resolved.' }, { status: 400 });
        }

        // 2. Update Dispute Status
        const { error: updateError } = await supabase
            .from('disputes')
            .update({
                status: 'RESOLVED',
                outcome: decision === 'RELEASE' ? 'FREELANCER' : 'CLIENT',
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateError) throw updateError;

        // 3. Execute Funds Transfer (Mock Logic for MVP)
        // In a real system, this would trigger a blockchain transaction or update wallet balances
        if (decision === 'RELEASE') {
            await supabase.rpc('release_escrow_to_freelancer', { project_id: dispute.project_id, amount: dispute.amount });
        } else {
            await supabase.rpc('refund_escrow_to_client', { project_id: dispute.project_id, amount: dispute.amount });
        }

        // 4. Update Arbitrator Stats (Increment completed arbitrations)
        // Note: This would typically be a trigger or separate update

        return NextResponse.json({ success: true, decision });

    } catch (error: any) {
        console.error('Resolution error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
