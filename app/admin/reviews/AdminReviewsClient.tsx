'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  User, 
  Mail, 
  Building, 
  Calendar,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  status: string;
  reviewer: {
    name: string;
    email: string;
    title?: string;
    organization?: string;
    relationship: string;
    linkedinUrl?: string;
    verified: boolean;
    verifiedAt?: string;
  };
  content: {
    rating: number;
    testimonial: string;
    projectAssociation?: string;
    skills?: string[];
    recommendation: boolean;
    workPeriod?: {
      start: string;
      end?: string;
    };
  };
  metadata: {
    submittedAt: string;
    ipAddress: string;
    userAgent: string;
    source: string;
  };
  admin: {
    notes: string;
    reviewedBy: string;
    reviewedAt: string | null;
    featured: boolean;
  };
}

interface AdminReviewsClientProps {
  reviews: Review[];
}

export function AdminReviewsClient({ reviews: initialReviews }: AdminReviewsClientProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reviews from Lambda API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev';
        const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || 'your-admin-token';
        
        const response = await fetch(`${API_ENDPOINT}/admin/reviews`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setReviews(result.data);
          }
        } else {
          console.error('Failed to fetch reviews:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getStatusBadge = (status: string, verified: boolean) => {
    if (!verified) {
      return <Badge variant="secondary">Pending Verification</Badge>;
    }
    
    switch (status) {
      case 'pending':
      case 'verified':
        return <Badge variant="outline">Awaiting Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'published':
        return <Badge variant="default" className="bg-blue-500">Published</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/5
        </span>
      </div>
    );
  };

  const handleStatusUpdate = async (reviewId: string, newStatus: string) => {
    setIsUpdating(true);
    
    try {
      // Use Lambda API endpoint
      const API_ENDPOINT = process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev';
      const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || 'your-admin-token';
      
      const response = await fetch(`${API_ENDPOINT}/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify({
          status: newStatus,
          notes: adminNotes,
          reviewedBy: 'Admin', // In production, use actual admin user
        }),
      });

      if (response.ok) {
        // Update local state
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { 
                ...review, 
                status: newStatus,
                admin: {
                  ...review.admin,
                  notes: adminNotes,
                  reviewedBy: 'Admin',
                  reviewedAt: new Date().toISOString()
                }
              }
            : review
        ));
        
        setSelectedReview(null);
        setAdminNotes('');
      } else {
        console.error('Failed to update review status');
      }
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingReviews = reviews.filter(r => r.reviewer.verified && ['pending', 'verified'].includes(r.status));
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');
  const unverifiedReviews = reviews.filter(r => !r.reviewer.verified);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{pendingReviews.length}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedReviews.length}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{rejectedReviews.length}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{unverifiedReviews.length}</div>
            <div className="text-sm text-muted-foreground">Unverified</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground">
                Submitted testimonials will appear here for review and approval.
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {review.reviewer.name}
                      {getStatusBadge(review.status, review.reviewer.verified)}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {review.reviewer.email}
                      </span>
                      {review.reviewer.organization && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {review.reviewer.organization}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.metadata.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {renderStars(review.content.rating)}
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {review.id}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Testimonial</h4>
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                      {review.content.testimonial}
                    </div>
                  </div>

                  {review.content.skills && review.content.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Skills Mentioned</h4>
                      <div className="flex flex-wrap gap-1">
                        {review.content.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Relationship: </span>
                      <span className="capitalize">{review.reviewer.relationship.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Recommends: </span>
                      <span className={review.content.recommendation ? 'text-green-600' : 'text-red-600'}>
                        {review.content.recommendation ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {review.reviewer.linkedinUrl && (
                    <div>
                      <a 
                        href={review.reviewer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        LinkedIn Profile
                      </a>
                    </div>
                  )}

                  {review.admin.notes && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-1">Admin Notes</h4>
                      <p className="text-sm text-blue-700">{review.admin.notes}</p>
                    </div>
                  )}

                  {review.reviewer.verified && ['pending', 'verified'].includes(review.status) && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        onClick={() => {
                          setSelectedReview(review);
                          setAdminNotes(review.admin.notes || '');
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Review
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review Testimonial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this review..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleStatusUpdate(selectedReview.id, 'approved')}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedReview.id, 'rejected')}
                  disabled={isUpdating}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setSelectedReview(null);
                    setAdminNotes('');
                  }}
                  variant="outline"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}