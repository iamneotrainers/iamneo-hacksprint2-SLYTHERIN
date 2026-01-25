import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { CANCELLATION_PENALTY } from '@/lib/arbitrator';

// POST /api/arbitrator/gigs/[gigId]/cancel - Cancel gig with penalty
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ gigId: string }> }
) {
    try {
        const { gigId } = await params;
        const supabase = createClient();

        // Get gig details
        const { data: gig, error: gigError } = await supabase
            .from('arbitrator_gigs')
            .select('*')
            .eq('id', gigId)
            .single();

        if (gigError || !gig) {
            return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
        }

        // Update gig status
        await supabase
            .from('arbitrator_gigs')
            .update({ status: 'CANCELLED' })
            .eq('id', gigId);

        // Deduct penalty from arbitrator balance
        await supabase.rpc('deduct_penalty', {
            user_id: gig.arbitrator_id,
            amount: CANCELLATION_PENALTY
        });

        // Log penalty
        await supabase
            .from('transactions')
            .insert({
                user_id: gig.arbitrator_id,
                type: 'PENALTY',
                amount: -CANCELLATION_PENALTY,
                description: `Gig cancellation penalty for ${gig.date} ${gig.time_slot}`,
                status: 'COMPLETED'
            });

        return NextResponse.json({
            success: true,
            penalty: CANCELLATION_PENALTY,
            message: 'Gig cancelled and penalty deducted'
        });
    } catch (error: any) {
        console.error('Error in POST /api/arbitrator/gigs/[gigId]/cancel:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
