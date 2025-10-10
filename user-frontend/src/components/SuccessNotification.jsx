import { useEffect } from 'react';

function SuccessNotification({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <div 
        className={`mt-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 
        animate-slide-down pointer-events-auto`}
        style={{
          fontSize: '20px',
          fontFamily: 'Kode Mono, monospace',
          fontWeight: 500,
        }}
      >
        {/* Checkmark Icon */}
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3" 
            d="M5 13l4 4L19 7" 
          />
        </svg>
        <span>{message}</span>
      </div>
      <style>
        {`
          @keyframes slide-down {
            0% {
              transform: translateY(-100px);
              opacity: 0;
            }
            10% {
              transform: translateY(0);
              opacity: 1;
            }
            90% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-100px);
              opacity: 0;
            }
          }
          
          .animate-slide-down {
            animation: slide-down 3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default SuccessNotification;

