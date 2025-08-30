'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline'

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  const slides = [
    {
      title: "AI-Powered Climate Adaptation",
      subtitle: "Smart climate insights for Kenyan communities",
      image: "/images/climate-adaptation.jpg",
      cta: "View Climate Data"
    },
    {
      title: "AI-Powered Agriculture",
      subtitle: "Satellite monitoring and crop disease detection",
      image: "/images/smart-farming.jpg",
      cta: "Optimize Farming"
    },
    {
      title: "Clean Energy Solutions",
      subtitle: "Smart grid optimization and demand forecasting",
      image: "/images/clean-energy.jpg",
      cta: "Monitor Energy"
    },
    {
      title: "Conservation Alerts",
      subtitle: "Real-time deforestation and ecosystem monitoring",
      image: "/images/conservation.jpg",
      cta: "Protect Nature"
    }
  ]

  useEffect(() => {
    setIsClient(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  // Use first slide content for initial server render
  const displaySlide = isClient ? slides[currentSlide] : slides[0]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      {/* Background Video/Animation */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          <span className="text-gradient bg-gradient-to-r from-white to-earth-200 bg-clip-text text-transparent">
            Uzima
          </span>
          <span className="text-white">Smart</span>
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-200 max-w-4xl mx-auto animate-slide-up">
          {displaySlide.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            href="/dashboard" 
            className="btn-primary px-8 py-4 text-lg font-semibold flex items-center gap-2 shadow-glow"
          >
            {displaySlide.cta}
            <ChevronRightIcon className="w-5 h-5" />
          </Link>
          
          <button className="flex items-center gap-2 text-white hover:text-earth-200 transition-colors duration-200">
            <PlayIcon className="w-6 h-6" />
            Watch Demo
          </button>
        </div>

        {/* Slide Indicators */}
        {isClient && (
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-earth-200">50K+</div>
              <div className="text-sm text-gray-200">Farmers Supported</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-earth-200">47</div>
              <div className="text-sm text-gray-200">Counties Monitored</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-earth-200">15%</div>
              <div className="text-sm text-gray-200">Energy Savings</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-earth-200">100K</div>
              <div className="text-sm text-gray-200">Hectares Protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <ChevronRightIcon className="w-6 h-6 text-white rotate-90" />
        </div>
      </div>
    </section>
  )
}
