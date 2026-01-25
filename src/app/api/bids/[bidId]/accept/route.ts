import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/bids/[bidId]/accept - Accept bid and create contract
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ bidId: string }> }
) {
    try {
        const { bidId } = await params;
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get proposal (bid) details with project info
        const { data: proposal, error: proposalError } = await supabase
            .from('proposals')
            .select(`
                *,
                project:projects(*)
            `)
            .eq('id', bidId)
            .single();

        if (proposalError || !proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        // Verify user is the project owner
        if (proposal.project.client_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: Only project owner can accept bids' }, { status: 403 });
        }

        // Verify project is still open
        if (proposal.project.status !== 'open') {
            return NextResponse.json({ error: 'Project is no longer accepting bids' }, { status: 400 });
        }

        // Start transaction-like operations
        // 1. Update proposal status to accepted
        await supabase
            .from('proposals')
            .update({ status: 'accepted' })
            .eq('id', bidId);

        // 2. Reject all other proposals for this project
        await supabase
            .from('proposals')
            .update({ status: 'rejected' })
            .eq('project_id', proposal.project_id)
            .neq('id', bidId);

        // 3. Update project status to assigned and set freelancer
        await supabase
            .from('projects')
            .update({
                status: 'assigned',
                freelancer_id: proposal.freelancer_id
            })
            .eq('id', proposal.project_id);

        // 4. Create contract
        const { data: contract, error: contractError } = await supabase
            .from('contracts')
            .insert({
                project_id: proposal.project_id,
                proposal_id: proposal.id,
                client_id: user.id,
                freelancer_id: proposal.freelancer_id,
                total_amount: proposal.proposed_budget,
                locked_amount: proposal.proposed_budget, // Full amount locked initially
                status: 'active',
                milestones: proposal.milestones || [],
                smart_contract_address: null // Will be set after blockchain deployment
            })
            .select()
            .single();

        if (contractError) {
            console.error('Error creating contract:', contractError);
            return NextResponse.json({ error: contractError.message }, { status: 500 });
        }

        // TODO: Deploy smart contract to blockchain and lock funds
        // const contractAddress = await deployEscrowContract({
        //     amount: proposal.proposed_budget,
        //     client: user.id,
        //     freelancer: proposal.freelancer_id,
        //     milestones: proposal.milestones
        // });

        // TODO: Update contract with smart_contract_address

        // TODO: Create notifications for freelancer

        return NextResponse.json({
            success: true,
            contractId: contract.id,
            message: 'Bid accepted and contract created successfully'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error in POST /api/bids/[bidId]/accept:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
