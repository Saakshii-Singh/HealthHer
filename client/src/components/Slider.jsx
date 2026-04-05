import { useState,useEffect } from "react";

const images = [
  "https://img.freepik.com/free-vector/flat-woman-mark-date-menstruation-period-menstrual-calendar_88138-958.jpg",
  "https://img.freepik.com/free-vector/menstrual-calendar-concept-illustration_52683-45603.jpg",
  "https://img.freepik.com/free-vector/menstrual-calendar-concept_23-2148653246.jpg"
];

function Slider() {
  const [current,setCurrent]=useState(0);

  useEffect(()=>{
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  },[current]);

  const nextSlide=()=>{
    setCurrent((prev)=>(prev+1)%images.length);
  };

  const prevSlide=()=>{
    setCurrent((prev)=>(prev-1+images.length)%images.length);
  }

  let startX=0;
  const handleTouchStart=(e)=>{
    startX=e.touches[0].clientX;
  };

  const handleTouchEnd=(e)=>{
    const endX=e.changedTouches[0].clientX;

    if(startX-endX>50)nextSlide();
    if(endX-startX>50)prevSlide();
  };

  return(
    <div 
    className="relative w-[320px] md:w-[420x]"
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    >
   
      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-pink-100">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={images[current]}
            alt="slider"
            className="w-full h-[250px] object-cover transition duration-500"
          />
        </div>
       
        <div className="flex justify-center mt-4 gap-2">
          {images.map((_,index)=>(
            <div
              key={index}
              onClick={()=>setCurrent(index)}
              className={`w-2 h-2 rounded-full cursor-pointer ${current===index?"bg-pink-500 scale-125":"bg-gray-300"}`}
              />
          ))}
      </div>
    </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-[-15px] transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-pink-100">
            ◀
          </button>
         
            <button
            onClick={nextSlide}
            className="absolute top-1/2 right-[-15px] transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-pink-100"
            >
              ▶
            </button>
    </div>
  );
}

export default Slider;