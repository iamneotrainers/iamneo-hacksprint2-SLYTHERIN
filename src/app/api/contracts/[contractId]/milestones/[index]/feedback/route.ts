import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/contracts/[contractId]/milestones/[index]/feedback - Send improvement feedback
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

        const body = await request.json();
        const { feedback } = body;

        // Verify contract and user is client
        const { data: contract } = await supabase
            .from('contracts')
            .select('*')
            .eq('id', contractId)
            .single();

        if (!contract || contract.client_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update milestone submission with feedback
        const { data, error } = await supabase
            .from('milestone_submissions')
            .update({
                status: 'revision_requested',
                feedback,
                reviewed_at: new Date().toISOString()
            })
            .eq('contract_id', contractId)
            .eq('milestone_index', milestoneIndex)
            .select()
            .single();

        if (error) {
            console.error('Error sending feedback:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // TODO: Send notification to freelancer

        return NextResponse.json({
            success: true,
            message: 'Feedback sent to freelancer'
        });
    } catch (error: any) {
        console.error('Error sending feedback:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
