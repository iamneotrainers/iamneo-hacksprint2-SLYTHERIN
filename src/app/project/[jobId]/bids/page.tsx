// Bid detail page showing all bids for a specific project
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    ArrowLeft,
    DollarSign,
    Clock,
    Star,
    User,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface Milestone {
    title: string;
    amount: number;
    description: string;
    duration: string;
}

interface Bid {
    id: string;
    freelancer_id: string;
    amount: number;
    proposal: string;
    milestones: Milestone[];
    duration: string;
    created_at: string;
    freelancer?: {
        id: string;
        username: string;
        name: string;
        rating: number;
    };
}

interface Project {
    id: string;
    title: string;
    budget_min: number;
    budget_max: number;
}

export default function ProjectBidsPage({ params }: { params: Promise<{ jobId: string }> }) {
    const router = useRouter();
    const { user } = useAuth();
    const { jobId } = React.use(params);

    const [project, setProject] = useState<Project | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState<string | null>(null);

    useEffect(() => {
        fetchBids();
    }, [jobId]);

    const fetchBids = async () => {
        try {
            const [projectRes, bidsRes] = await Promise.all([
                fetch(`/api/jobs/${jobId}`),
                fetch(`/api/bids/${jobId}`)
            ]);

            if (projectRes.ok) {
                const projectData = await projectRes.json();
                setProject(projectData);
            }

            if (bidsRes.ok) {
                const bidsData = await bidsRes.json();
                setBids(Array.isArray(bidsData) ? bidsData : []);
            } else {
                setBids([]);
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
            setBids([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBid = async (bidId: string) => {
        if (!confirm('Accept this bid? Funds will be locked in escrow and the project will be assigned to this freelancer.')) return;

        try {
            setAccepting(bidId);
            const response = await fetch(`/api/bids/${bidId}/accept`, {
                method: 'POST'
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Failed to accept bid: ${error.error || 'Unknown error'}`);
                return;
            }

            const data = await response.json();
            alert('Bid accepted! Contract created successfully.');
            router.push(`/contracts/${data.contractId}`);
        } catch (error) {
            console.error('Error accepting bid:', error);
            alert('Failed to accept bid. Please try again.');
        } finally {
            setAccepting(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <p className="text-center text-gray-600">Loading bids...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Projects
                </Button>

                {/* Project Info */}
                {project && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>{project.title}</CardTitle>
                            <p className="text-sm text-gray-600">
                                Budget: ${project.budget_min?.toLocaleString()} - ${project.budget_max?.toLocaleString()}
                            </p>
                        </CardHeader>
                    </Card>
                )}

                {/* Bids List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Received Bids ({bids.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bids.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bids yet</h3>
                                <p className="text-gray-600">Freelancers haven't submitted any bids for this project yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bids.map((bid) => (
                                    <Card key={bid.id} className="border-2">
                                        <CardContent className="p-6">
                                            {/* Freelancer Info */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarFallback className="bg-blue-600 text-white text-lg">
                                                            {bid.freelancer?.name?.charAt(0) || 'F'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="text-lg font-semibold">{bid.freelancer?.name || 'Anonymous'}</h3>
                                                        <p className="text-sm text-gray-600">@{bid.freelancer?.username || 'user'}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                            <span className="text-sm font-medium">{bid.freelancer?.rating || 5.0}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-3xl font-bold text-green-600">${bid.amount?.toLocaleString()}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <Clock className="h-4 w-4 inline mr-1" />
                                                        {bid.duration || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Proposal */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-2">Cover Letter</h4>
                                                <p className="text-gray-700 whitespace-pre-line">{bid.proposal}</p>
                                            </div>

                                            {/* Milestones */}
                                            {bid.milestones && bid.milestones.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="font-semibold mb-3">Proposed Milestones</h4>
                                                    <div className="space-y-3">
                                                        {bid.milestones.map((milestone, idx) => (
                                                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className="font-medium">{idx + 1}. {milestone.title}</span>
                                                                    <div className="text-right">
                                                                        <span className="font-bold text-green-600">${milestone.amount?.toLocaleString()}</span>
                                                                        <p className="text-xs text-gray-600">{milestone.duration}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{milestone.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => router.push(`/freelancer/${bid.freelancer_id}`)}
                                                    className="flex-1"
                                                >
                                                    <User className="h-4 w-4 mr-2" />
                                                    View Profile
                                                </Button>
                                                <Button
                                                    onClick={() => handleAcceptBid(bid.id)}
                                                    disabled={accepting === bid.id}
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    {accepting === bid.id ? 'Accepting...' : 'Accept Bid'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
