// src/components/home/horizontal-carousel.tsx 
"use client"

import React, { useState, useEffect } from 'react'

export function HorizontalCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 轮播卡片数据
  const slides = [
    { 
      id: 1, 
      title: "Arctica", 
      content: "one-stop portal to ship and preserve your fanworks onchain.", 
      image: "/1.png"      
    },
    { 
      id: 2, 
      title: "Arctica", 
      content: "one-stop portal to ship and preserve your fanworks onchain.", 
      image: "/2.png"      
    },
    { 
      id: 3, 
      title: "Arctica", 
      content: "one-stop portal to ship and preserve your fanworks onchain.", 
      image: "/3.png"     
    },
  ]

  // 自动播放功能
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 20000) // 20秒间隔

    return () => clearInterval(interval) 
  }, [slides.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-full">
      {/* 轮播容器 */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="relative min-w-full h-full">
            {/* 背景图片 */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>

            {/* 半透明遮罩 */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* 文字内容 */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-6xl font-bold mb-4 drop-shadow-lg font-mansalva">
                  {slide.title}
                </h2>       
                <p className="text-3xl drop-shadow-md font-mansalva">
                  {slide.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 向下滑动提示箭头 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-white text-3xl">
      ↓
        </div>
      </div>

      {/* 导航按钮 */}
      {/* <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded"
      >
        ←
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded"
      >
        →
      </button> */}

      {/* 点导航 */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div> */}
    </div>
  )
}