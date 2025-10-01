import React, { useEffect, useState } from 'react';

const OrderConfirmationPopup = ({ isVisible, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Trigger animation after component mounts
      setTimeout(() => setShowAnimation(true), 100);
      
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setShowAnimation(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl transform transition-all duration-300 ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Green circle with tick animation */}
        <div className="relative mb-6">
          <div className={`w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${
            showAnimation ? 'scale-100' : 'scale-75'
          }`}>
            <div className={`transform transition-all duration-700 delay-200 ${
              showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}>
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{
                  strokeDasharray: '30',
                  strokeDashoffset: showAnimation ? '0' : '30',
                  transition: 'stroke-dashoffset 0.6s ease-in-out 0.3s'
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          
          {/* Ripple effect */}
          <div className={`absolute inset-0 w-20 h-20 mx-auto bg-green-400 rounded-full transform transition-all duration-700 ${
            showAnimation ? 'scale-150 opacity-0' : 'scale-100 opacity-30'
          }`}></div>
        </div>

        {/* Success message */}
        <h2 className={`text-2xl font-bold text-gray-800 mb-3 transform transition-all duration-500 delay-300 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          Thank you for your order!
        </h2>

        {/* Subtext */}
        <p className={`text-gray-600 text-sm leading-relaxed transform transition-all duration-500 delay-500 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          Your order has been placed successfully. We'll notify you when it's on the way!
        </p>

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center">
          <div className={`w-32 h-1 bg-gray-200 rounded-full overflow-hidden transform transition-all duration-1000 delay-700 ${
            showAnimation ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPopup;
