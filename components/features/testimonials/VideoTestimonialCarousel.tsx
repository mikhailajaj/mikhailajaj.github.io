"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { testimonials, getFeaturedTestimonials } from "@/data/testimonials";

interface VideoTestimonial {
  id: string;
  client: string;
  role: string;
  company: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  transcript: string;
  rating: number;
  featured: boolean;
  category: string;
}

interface EnhancedTestimonialCarouselProps {
  showVideoTestimonials?: boolean;
  autoPlay?: boolean;
  showTranscripts?: boolean;
  className?: string;
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: "video-testimonial-1",
    client: "Sarah Johnson",
    role: "HR Director",
    company: "TechCorp Solutions",
    videoUrl: "/testimonials/videos/sarah-johnson.mp4",
    thumbnail: "/testimonials/sarah-johnson.jpg",
    duration: "2:15",
    transcript: "Working with Mikhail on our Secret Santa app was incredible. The automation completely transformed our holiday planning process, saving us weeks of coordination time.",
    rating: 5,
    featured: true,
    category: "full-stack",
  },
  {
    id: "video-testimonial-2",
    client: "Michael Chen",
    role: "CTO",
    company: "InnovateTech",
    videoUrl: "/testimonials/videos/michael-chen.mp4",
    thumbnail: "/testimonials/michael-chen.jpg",
    duration: "3:20",
    transcript: "The cloud infrastructure automation platform exceeded all our expectations. We went from dreading deployments to deploying multiple times per day with complete confidence.",
    rating: 5,
    featured: true,
    category: "cloud",
  },
];

const EnhancedTestimonialCarousel: React.FC<EnhancedTestimonialCarouselProps> = ({
  showVideoTestimonials = true,
  autoPlay = false,
  showTranscripts = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "video">("text");
  const videoRef = useRef<HTMLVideoElement>(null);

  const textTestimonials = getFeaturedTestimonials();
  const allTestimonials = showVideoTestimonials 
    ? [...textTestimonials, ...videoTestimonials]
    : textTestimonials;

  const currentTestimonial = allTestimonials[currentIndex];
  const isVideoTestimonial = 'videoUrl' in currentTestimonial;

  useEffect(() => {
    if (autoPlay && !isVideoTestimonial) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isVideoTestimonial, allTestimonials.length]);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
    setIsPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
    setIsPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${
          i < rating ? "text-yellow-400" : "text-gray-300"
        } transition-colors duration-200`}
      />
    ));
  };

  return (
    <div className={`relative max-w-4xl mx-auto ${className}`}>
      {/* Tab Navigation */}
      {showVideoTestimonials && (
        <div className="flex justify-center mb-8">
          <div className="bg-card/50 backdrop-blur-md rounded-lg p-1 border border-border/50">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === "text"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Written Reviews
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === "video"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Video Testimonials
            </button>
          </div>
        </div>
      )}

      {/* Main Carousel */}
      <div className="relative bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            {isVideoTestimonial ? (
              // Video Testimonial Layout
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full rounded-lg shadow-lg"
                    poster={currentTestimonial.thumbnail}
                    muted={isMuted}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  >
                    <source src={currentTestimonial.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <button
                      onClick={handleVideoPlay}
                      className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    
                    <div className="text-white text-sm bg-black/70 px-2 py-1 rounded">
                      {currentTestimonial.duration}
                    </div>
                    
                    <button
                      onClick={handleVideoMute}
                      className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(currentTestimonial.rating)}
                  </div>
                  
                  <blockquote className="text-lg text-foreground italic">
                    <FaQuoteLeft className="text-primary mb-2" />
                    {showTranscripts && currentTestimonial.transcript}
                  </blockquote>
                  
                  <div className="flex items-center space-x-4">
                    <Image
                      src={currentTestimonial.thumbnail}
                      alt={currentTestimonial.client}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {currentTestimonial.client}
                      </h4>
                      <p className="text-muted-foreground">
                        {currentTestimonial.role} at {currentTestimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Text Testimonial Layout
              <div className="text-center space-y-6">
                <div className="flex justify-center items-center space-x-1">
                  {renderStars(currentTestimonial.rating)}
                </div>
                
                <blockquote className="text-xl text-foreground italic max-w-3xl mx-auto">
                  <FaQuoteLeft className="text-primary mb-4 mx-auto" />
                  {currentTestimonial.testimonial}
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  {currentTestimonial.image && (
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.client}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <h4 className="font-semibold text-foreground">
                      {currentTestimonial.client}
                    </h4>
                    <p className="text-muted-foreground">
                      {currentTestimonial.role} at {currentTestimonial.company}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Project: {currentTestimonial.project}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-card/80 backdrop-blur-md border border-border/50 text-foreground p-3 rounded-full hover:bg-card transition-colors shadow-lg"
          aria-label="Previous testimonial"
        >
          <FaChevronLeft />
        </button>
        
        <button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-card/80 backdrop-blur-md border border-border/50 text-foreground p-3 rounded-full hover:bg-card transition-colors shadow-lg"
          aria-label="Next testimonial"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {allTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex
                ? "bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Trust Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-card/50 backdrop-blur-md rounded-lg p-4 border border-border/50">
          <div className="text-2xl font-bold text-primary">98%</div>
          <div className="text-sm text-muted-foreground">Client Satisfaction</div>
        </div>
        <div className="bg-card/50 backdrop-blur-md rounded-lg p-4 border border-border/50">
          <div className="text-2xl font-bold text-primary">$30M+</div>
          <div className="text-sm text-muted-foreground">Business Impact</div>
        </div>
        <div className="bg-card/50 backdrop-blur-md rounded-lg p-4 border border-border/50">
          <div className="text-2xl font-bold text-primary">5.0</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTestimonialCarousel;