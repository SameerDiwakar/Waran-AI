import React, { useRef, useState } from 'react';

/**
 * MagnifierImage - shows a magnifying glass effect on hover.
 * Props:
 *   src: image URL
 *   alt: alt text
 *   className: additional classes for the image
 *   magnifierSize: diameter of the magnifier in px (default: 120)
 *   zoom: magnification factor (default: 2)
 */
const MagnifierImage = ({ src, alt, className = '', magnifierSize = 120, zoom = 2 }) => {
  const imgRef = useRef(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top } = imgRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMagnifierPos({ x, y });
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-2xl shadow-xl"
        draggable={false}
      />
      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            top: magnifierPos.y - magnifierSize / 2,
            left: magnifierPos.x - magnifierSize / 2,
            width: magnifierSize,
            height: magnifierSize,
            borderRadius: '50%',
            boxShadow: '0 2px 12px 0 rgba(80,80,120,0.18)',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgRef.current?.width * zoom}px ${imgRef.current?.height * zoom}px`,
            backgroundPosition: `-${magnifierPos.x * zoom - magnifierSize / 2}px -${magnifierPos.y * zoom - magnifierSize / 2}px`,
            zIndex: 10,
            transition: 'box-shadow 0.2s',
          }}
        />
      )}
    </div>
  );
};

export default MagnifierImage; 