import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/contracts/[contractId]/milestones/[index]/release - Release milestone funds
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ contractId: string; index: string }> }
) {
    try {
        const { contractId, index } = await params;
        const milestoneIndex = parseInt(index);
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify contract and user is client
        const { data: contract } = await supabase
            .from('contracts')
            .select('*')
            .eq('id', contractId)
            .single();

        if (!contract || contract.client_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: Only client can release funds' }, { status: 403 });
        }

        // Get milestone amount
        const milestones = contract.milestones || [];
        if (milestoneIndex >= milestones.length) {
            return NextResponse.json({ error: 'Invalid milestone index' }, { status: 400 });
        }

        const milestone = milestones[milestoneIndex];
        const releaseAmount = parseFloat(milestone.amount);

        // Update milestone submission status
        await supabase
            .from('milestone_submissions')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString()
            })
            .eq('contract_id', contractId)
            .eq('milestone_index', milestoneIndex);

        // Update contract locked amount
        const newLockedAmount = contract.locked_amount - releaseAmount;
        await supabase
            .from('contracts')
            .update({ locked_amount: newLockedAmount })
            .eq('id', contractId);

        // TODO: Call smart contract to release funds
        // await releaseEscrowFunds(contract.smart_contract_address, milestoneIndex);

        return NextResponse.json({
            success: true,
            released_amount: releaseAmount,
            remaining_locked: newLockedAmount,
            message: `$${releaseAmount} released to freelancer`
        });
    } catch (error: any) {
        console.error('Error releasing funds:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
