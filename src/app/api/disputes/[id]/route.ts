import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/disputes/[id] - Get specific dispute details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: dispute, error } = await supabase
      .from('disputes')
      .select(`
              *,
              project:projects (
                  id, 
                  title, 
                  description,
                  client:users!client_id(id, name, email),
                  freelancer:users!hired_freelancer_id(id, name, email)
              ),
              contract:contracts(id, milestones, total_amount, released_amount)
          `)
      .eq('id', id)
      .single();

    if (error || !dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    // Enrich with specific milestone details if index exists
    let milestoneDetails = null;
    if (dispute.milestone_index !== null && dispute.contract?.milestones) {
      milestoneDetails = dispute.contract.milestones[dispute.milestone_index];
    }

    return NextResponse.json({
      ...dispute,
      milestone_details: milestoneDetails
    });

  } catch (error: any) {
    console.error('Error fetching dispute:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dispute' },
      { status: 500 }
    );
  }
}