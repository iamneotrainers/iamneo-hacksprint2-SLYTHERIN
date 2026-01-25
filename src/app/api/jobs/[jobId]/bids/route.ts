import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/jobs/[jobId]/bids - Get bids for a specific job
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user is the job owner
        const { data: job } = await supabase
            .from('projects')
            .select('client_id')
            .eq('id', jobId)
            .single();

        if (!job || job.client_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get bids (proposals)
        const { data: bids, error } = await supabase
            .from('proposals')
            .select(`
        *,
        freelancer:users!proposals_freelancer_id_fkey(
          id,
          username,
          name,
          rating
        )
      `)
            .eq('project_id', jobId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bids:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Map to expected frontend format
        const formattedBids = (bids || []).map(bid => ({
            id: bid.id,
            freelancer_id: bid.freelancer_id,
            amount: bid.proposed_budget,
            proposal: bid.cover_letter,
            milestones: bid.milestones || [],
            created_at: bid.created_at,
            freelancer: bid.freelancer
        }));

        return NextResponse.json(formattedBids);
    } catch (error: any) {
        console.error('Error in GET /api/jobs/[jobId]/bids:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
