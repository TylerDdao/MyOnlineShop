import React, { useState, useMemo, useEffect } from 'react';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const HorizontalImageSlider = ({ productId, numberOfImage, width = 400 }) => {
  // Generate image URLs
  const images = useMemo(() => {
    return Array.from({ length: numberOfImage }, (_, i) =>
      `/images/products/${productId}/${i + 1}.jpg`
    );
  }, [productId, numberOfImage]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentIndex(prevIndex =>
        (prevIndex - 1 + images.length) % images.length
      );
    }
  };

  // Autoplay every 2s
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="overflow-hidden flex flex-col items-center shadow box-border" style={{ width }}>
      <div className="overflow-hidden relative" style={{ width }}>
        <div
          className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * width}px)` }}>
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              style={{ width, height: 'auto' }} // image width
              className="object-cover shrink-0 box-border"
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between w-full p-2.5">
        <button type="button" onClick={prevSlide} className="text-xl hover:bg-gray-100 px-2"><BsArrowLeft/></button>
        <button type="button" onClick={nextSlide} className="text-xl hover:bg-gray-100 px-2"><BsArrowRight/></button>
      </div>
    </div>
  );
};

export default HorizontalImageSlider;
