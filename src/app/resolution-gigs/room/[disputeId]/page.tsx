"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import {
    Shield,
    Send,
    FileText,
    DollarSign,
    User,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowLeft
} from "lucide-react";
import { format } from "date-fns";

export default function DisputeRoom({ params }: { params: Promise<{ disputeId: string }> }) {
    const router = useRouter();
    const { user } = useAuth();
    const { disputeId } = React.use(params);

    const [dispute, setDispute] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Polling for messages
    useEffect(() => {
        fetchDispute();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [disputeId]);

    const fetchDispute = async () => {
        try {
            const res = await fetch(`/api/disputes/${disputeId}`);
            if (res.ok) {
                const data = await res.json();
                setDispute(data);
                await fetchMessages(); // Initial fetch
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/disputes/${disputeId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`/api/disputes/${disputeId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage })
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages(); // Refresh immediately
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
        } finally {
            setSending(false);
        }
    };

    const handleVerdict = async (decision: 'RELEASE' | 'REFUND') => {
        if (!confirm(`Are you sure you want to ${decision} funds? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/disputes/${disputeId}/resolve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision })
            });

            if (res.ok) {
                toast({ title: "Verdict Submitted", description: `Funds have been ${decision === 'RELEASE' ? 'released' : 'refunded'}.` });
                fetchDispute(); // Refresh status
            } else {
                const err = await res.json();
                toast({ title: "Error", description: err.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit verdict", variant: "destructive" });
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Dispute Room...</div>;
    if (!dispute) return <div className="p-8 text-center">Dispute not found</div>;

    const isArbitrator = dispute.arbitrator_id === user?.id;
    const isResolved = dispute.status === 'RESOLVED';

    return (
        <div className="container mx-auto p-4 max-w-6xl h-[calc(100vh-4rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-600" />
                            Dispute #{disputeId.substring(0, 8)}
                        </h1>
                        <p className="text-sm text-gray-500">{dispute.project?.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={isResolved ? (dispute.outcome === 'FREELANCER' ? 'default' : 'destructive') : 'secondary'}>
                        {dispute.status}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* Left: Details */}
                <Card className="w-1/4 overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="text-lg">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Amount Disputed</p>
                            <p className="text-xl font-bold flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {dispute.amount?.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Milestone</p>
                            <p className="font-medium text-sm">
                                {dispute.milestone_details?.title || `Milestone #${dispute.milestone_index + 1}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Reason</p>
                            <p className="text-sm text-gray-700">{dispute.reason}</p>
                        </div>
                        <div className="pt-4 border-t">
                            <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6"><AvatarFallback>C</AvatarFallback></Avatar>
                                <span className="text-sm">{dispute.project?.client?.name || 'Client'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6"><AvatarFallback>F</AvatarFallback></Avatar>
                                <span className="text-sm">{dispute.project?.freelancer?.name || 'Freelancer'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Center: Chat */}
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="py-3 border-b">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Shield className="h-4 w-4" /> resolution_room_chat
                        </CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((msg) => {
                                const isMe = msg.sender_id === user?.id;
                                const isSystem = msg.sender?.role === 'system'; // Future enhancement

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-100'
                                            }`}>
                                            {!isMe && (
                                                <p className="text-xs font-bold mb-1 opacity-70">
                                                    {msg.sender?.name}
                                                </p>
                                            )}
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {format(new Date(msg.created_at), "h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                    <CardFooter className="p-3 border-t">
                        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                disabled={isResolved}
                            />
                            <Button type="submit" size="icon" disabled={sending || isResolved}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>

                {/* Right: Verdict (Judge Only) */}
                {isArbitrator && (
                    <Card className="w-1/4 bg-gray-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-purple-800">Judge Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Review evidence and chat before making a decision. This action is final.
                            </p>

                            <div className="space-y-2">
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleVerdict('RELEASE')}
                                    disabled={isResolved}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Release to Freelancer
                                </Button>
                                <Button
                                    className="w-full" variant="destructive"
                                    onClick={() => handleVerdict('REFUND')}
                                    disabled={isResolved}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Refund to Client
                                </Button>
                            </div>

                            {isResolved && (
                                <div className="mt-4 p-3 bg-white rounded border text-center">
                                    <p className="text-sm font-bold">Case Closed</p>
                                    <p className="text-xs text-gray-500">
                                        Verdict: {dispute.outcome}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
