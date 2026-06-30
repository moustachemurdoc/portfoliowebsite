import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate
}) => {
  const nextImage = () => {
    if (images.length === 0) return;
    onNavigate((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, images]);

  if (!isOpen || images.length === 0) return null;

  const currentImagePath = images[currentIndex];
  // Extract file name for caption (e.g. DSC06751.jpg)
  const imageName = currentImagePath.split('/').pop() || '';

  return (
    <div 
      className={`lightbox-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      id="lightbox"
    >
      <button 
        className="lightbox-close-btn" 
        onClick={onClose}
        aria-label="Chiudi"
        id="lightbox-close"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
        <>
          <button 
            className="lightbox-nav-btn prev" 
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Precedente"
            id="lightbox-prev"
          >
            <ChevronLeft size={40} />
          </button>
          
          <button 
            className="lightbox-nav-btn next" 
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Successivo"
            id="lightbox-next"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}

      <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
        <img 
          src={currentImagePath} 
          alt={`Visualizzazione ingrandita ${imageName}`} 
          className="lightbox-image"
          id="lightbox-active-img"
        />
      </div>
    </div>
  );
};
