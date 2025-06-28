
import { useEffect } from 'react';

const InteractionStyles = () => {
  useEffect(() => {
    // Add dynamic styles for interactions
    const style = document.createElement('style');
    style.textContent = `
      .animate-fade-in {
        animation: fadeIn 0.3s ease-in-out;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .feedback-response {
        animation: slideIn 0.3s ease-out;
      }
      
      .rating-feedback {
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      [data-interactive]:hover {
        cursor: pointer;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default InteractionStyles;
