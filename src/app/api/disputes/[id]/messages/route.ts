import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/disputes/[id]/messages
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: messages, error } = await supabase
            .from('dispute_messages')
            .select(`
                *,
                sender:users(id, name, role)
            `)
            .eq('dispute_id', id)
            .order('created_at', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/disputes/[id]/messages
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
        const { content, attachments } = body;

        const { data: message, error } = await supabase
            .from('dispute_messages')
            .insert({
                dispute_id: id,
                sender_id: user.id,
                content,
                attachments: attachments || []
            })
            .select('*, sender:users(id, name, role)')
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(message);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
