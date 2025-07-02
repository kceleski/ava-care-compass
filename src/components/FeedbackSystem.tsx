
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Star, MessageCircle } from 'lucide-react';

const FeedbackSystem = () => {
  const feedbackRef = useRef<HTMLDivElement>(null);
  const ratingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add click event listeners for feedback buttons
    const handleFeedbackClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('[data-feedback]');
      
      if (button) {
        const feedbackType = button.getAttribute('data-feedback');
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-response animate-fade-in p-2 mt-2 rounded bg-green-100 text-green-800 text-sm';
        feedbackElement.textContent = `Thank you for your ${feedbackType} feedback!`;
        
        // Remove existing feedback responses
        const existingFeedback = button.parentElement?.querySelector('.feedback-response');
        if (existingFeedback) {
          existingFeedback.remove();
        }
        
        // Add new feedback response
        button.parentElement?.appendChild(feedbackElement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
          feedbackElement.remove();
        }, 3000);
      }
    };

    // Add hover effects for interactive elements
    const handleMouseEnter = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && typeof target.hasAttribute === 'function' && target.hasAttribute('data-interactive')) {
        target.style.transform = 'scale(1.05)';
        target.style.transition = 'transform 0.2s ease';
      }
    };

    const handleMouseLeave = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && typeof target.hasAttribute === 'function' && target.hasAttribute('data-interactive')) {
        target.style.transform = 'scale(1)';
      }
    };

    // Add star rating functionality
    const handleStarClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const star = target.closest('[data-star]');
      
      if (star) {
        const rating = parseInt(star.getAttribute('data-star') || '0');
        const starContainer = star.closest('.star-rating');
        const stars = starContainer?.querySelectorAll('[data-star]');
        
        // Update star display
        stars?.forEach((starEl, index) => {
          if (index < rating) {
            starEl.classList.add('text-yellow-400', 'fill-current');
            starEl.classList.remove('text-gray-300');
          } else {
            starEl.classList.add('text-gray-300');
            starEl.classList.remove('text-yellow-400', 'fill-current');
          }
        });

        // Show rating feedback
        const ratingFeedback = document.createElement('div');
        ratingFeedback.className = 'rating-feedback animate-fade-in p-2 mt-2 rounded bg-blue-100 text-blue-800 text-sm';
        ratingFeedback.textContent = `You rated this ${rating} star${rating !== 1 ? 's' : ''}!`;
        
        const existingRatingFeedback = starContainer?.querySelector('.rating-feedback');
        if (existingRatingFeedback) {
          existingRatingFeedback.remove();
        }
        
        starContainer?.appendChild(ratingFeedback);
        
        setTimeout(() => {
          ratingFeedback.remove();
        }, 3000);
      }
    };

    // Add event listeners to document
    document.addEventListener('click', handleFeedbackClick);
    document.addEventListener('click', handleStarClick);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleFeedbackClick);
      document.removeEventListener('click', handleStarClick);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <div className="feedback-system">
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">How are we doing?</h3>
          
          {/* Feedback Buttons */}
          <div className="flex gap-4 mb-6" ref={feedbackRef}>
            <Button
              variant="outline"
              data-feedback="positive"
              data-interactive="true"
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Helpful
            </Button>
            <Button
              variant="outline"
              data-feedback="negative"
              data-interactive="true"
              className="flex items-center gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Not Helpful
            </Button>
            <Button
              variant="outline"
              data-feedback="comment"
              data-interactive="true"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
          </div>

          {/* Star Rating */}
          <div className="star-rating flex items-center gap-1 mb-4" ref={ratingsRef}>
            <span className="text-sm font-medium mr-2">Rate our service:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-6 w-6 cursor-pointer text-gray-300 hover:text-yellow-400 transition-colors"
                data-star={star}
                data-interactive="true"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSystem;
