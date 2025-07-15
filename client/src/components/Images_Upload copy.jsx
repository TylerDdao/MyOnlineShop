import React, { useState } from 'react';

const HorizontalImageUploader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImages(previews);
    setCurrentIndex(0);
  };

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) =>
        (prevIndex - 1 + images.length) % images.length
      );
    }
  };

  return (
    <div className="w-[500px] overflow-hidden flex flex-col items-center shadow space-y-2 p-4 box-border">
      <div className="flex justify-between w-full">
        <button
          onClick={prevSlide}
          className="text-xl hover:bg-gray-100 px-2"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="text-xl hover:bg-gray-100 px-2"
        >
          ▶
        </button>
      </div>

      <div className="w-[500px] h-[500px] overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 500}px)` }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-[500px] h-[500px] object-cover shrink-0 box-border"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-2 w-full">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="file:px-4 file:py-2 file:bg-blue-600 file:text-white file:rounded file:cursor-pointer"
        />
        <button
          onClick={() => alert("Images uploaded!")}
          className="bg-black text-deepblue px-4 rounded w-full"
        >
          Hi
        </button>
      </div>
    </div>
  );
};

export default HorizontalImageUploader;
