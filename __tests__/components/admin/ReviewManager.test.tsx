/**
 * ReviewManager Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReviewManager } from '@/components/admin/ReviewManager';
import type { Review } from '@/lib/types/review';

// Mock fetch
global.fetch = jest.fn();

const mockReview: Review = {
  id: 'test-review-1',
  status: 'verified',
  reviewer: {
    name: 'John Doe',
    email: 'john@example.com',
    title: 'Software Engineer',
    organization: 'Tech Corp',
    relationship: 'colleague',
    verified: true
  },
  content: {
    rating: 5,
    testimonial: 'Great work on the project! Really impressed with the technical skills and collaboration.',
    recommendation: true
  },
  metadata: {
    submittedAt: '2024-01-15T10:00:00Z',
    verifiedAt: '2024-01-15T10:30:00Z',
    ipAddress: '127.0.0.1',
    userAgent: 'test',
    source: 'direct',
    language: 'en',
    timezone: 'UTC'
  },
  admin: {
    featured: false,
    notes: 'Initial review notes',
    tags: ['test']
  }
};

describe('ReviewManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: {} })
    });
  });

  it('renders review details correctly', () => {
    render(<ReviewManager review={mockReview} />);
    
    expect(screen.getByText('Review Management')).toBeInTheDocument();
    expect(screen.getAllByText('John Doe')).toHaveLength(2); // Appears in both reviewer info and review card
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Tech Corp')).toHaveLength(2); // Appears in both reviewer info and review card
    expect(screen.getByText(/Great work on the project/)).toBeInTheDocument();
  });

  it('displays empty state when no review selected', () => {
    render(<ReviewManager />);
    
    expect(screen.getByText('Select a review to manage')).toBeInTheDocument();
  });

  it('handles review approval', async () => {
    const mockOnActionComplete = jest.fn();
    render(
      <ReviewManager 
        review={mockReview} 
        onActionComplete={mockOnActionComplete}
      />
    );
    
    const approveButton = screen.getByRole('button', { name: /approve review/i });
    fireEvent.click(approveButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/reviews/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-dev-token'
        },
        body: JSON.stringify({
          reviewId: 'test-review-1',
          action: 'approve',
          notes: 'Initial review notes',
          featured: false,
          displayOrder: undefined
        })
      });
    });
  });

  it('handles review rejection with reason', async () => {
    const mockOnActionComplete = jest.fn();
    render(
      <ReviewManager 
        review={mockReview} 
        onActionComplete={mockOnActionComplete}
      />
    );
    
    // Add rejection reason
    const rejectionTextarea = screen.getByPlaceholderText('Explain why this review is being rejected...');
    fireEvent.change(rejectionTextarea, { 
      target: { value: 'Does not meet quality standards' } 
    });
    
    const rejectButton = screen.getByRole('button', { name: /reject review/i });
    fireEvent.click(rejectButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/reviews/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-dev-token'
        },
        body: JSON.stringify({
          reviewId: 'test-review-1',
          action: 'reject',
          notes: 'Does not meet quality standards'
        })
      });
    });
  });

  it('prevents rejection without reason', () => {
    render(<ReviewManager review={mockReview} />);
    
    const rejectButton = screen.getByRole('button', { name: /reject review/i });
    expect(rejectButton).toBeDisabled();
  });

  it('enables rejection when reason is provided', () => {
    render(<ReviewManager review={mockReview} />);
    
    const rejectionTextarea = screen.getByPlaceholderText('Explain why this review is being rejected...');
    fireEvent.change(rejectionTextarea, { 
      target: { value: 'Test reason' } 
    });
    
    const rejectButton = screen.getByRole('button', { name: /reject review/i });
    expect(rejectButton).not.toBeDisabled();
  });

  it('handles featured checkbox toggle', () => {
    render(<ReviewManager review={mockReview} />);
    
    const featuredCheckbox = screen.getByLabelText('Feature this review');
    expect(featuredCheckbox).not.toBeChecked();
    
    fireEvent.click(featuredCheckbox);
    expect(featuredCheckbox).toBeChecked();
    
    // Display order input should appear
    expect(screen.getByPlaceholderText('1')).toBeInTheDocument();
  });

  it('updates admin notes', () => {
    render(<ReviewManager review={mockReview} />);
    
    const notesTextarea = screen.getByPlaceholderText('Add internal notes about this review...');
    expect(notesTextarea).toHaveValue('Initial review notes');
    
    fireEvent.change(notesTextarea, { 
      target: { value: 'Updated notes' } 
    });
    
    expect(notesTextarea).toHaveValue('Updated notes');
  });

  it('displays loading state during submission', async () => {
    // Mock a delayed response
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }), 100))
    );
    
    render(<ReviewManager review={mockReview} />);
    
    const approveButton = screen.getByRole('button', { name: /approve review/i });
    fireEvent.click(approveButton);
    
    expect(screen.getByText('Approving...')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        success: false, 
        error: 'Network error' 
      })
    });
    
    render(<ReviewManager review={mockReview} />);
    
    const approveButton = screen.getByRole('button', { name: /approve review/i });
    fireEvent.click(approveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('displays success message on successful action', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        success: true,
        message: 'Review approved successfully'
      })
    });
    
    render(<ReviewManager review={mockReview} />);
    
    const approveButton = screen.getByRole('button', { name: /approve review/i });
    fireEvent.click(approveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Review approved successfully')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<ReviewManager review={mockReview} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close review manager/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});