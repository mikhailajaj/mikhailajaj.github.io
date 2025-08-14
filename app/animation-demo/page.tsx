"use client";
import React from "react";
import { 
  MagneticButton, 
  AnimatedCounter, 
  StaggeredList,
  InteractiveCard,
  RippleButton
} from "@/components/animations";
import { FaRocket, FaCode, FaCloud } from "react-icons/fa";

export default function AnimationDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Animation Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Interactive demonstration of advanced micro-interactions
          </p>
        </div>
      </section>

      {/* Animated Counters */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Animated Counters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <AnimatedCounter 
                value={30000000} 
                prefix="$" 
                suffix="M+" 
                className="text-4xl font-bold text-primary"
                duration={2.5}
              />
              <p className="text-muted-foreground mt-2">Business Impact</p>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                value={98} 
                suffix="%" 
                className="text-4xl font-bold text-green-500"
                duration={2}
              />
              <p className="text-muted-foreground mt-2">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                value={150} 
                suffix="+" 
                className="text-4xl font-bold text-purple-500"
                duration={1.8}
              />
              <p className="text-muted-foreground mt-2">Projects Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Buttons */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Interactive Buttons</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <MagneticButton 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold"
              strength={0.4}
              onClick={() => alert("Magnetic button clicked!")}
            >
              <FaRocket className="inline mr-2" />
              Magnetic Button
            </MagneticButton>
            
            <RippleButton 
              className="px-8 py-4 bg-green-500 text-white rounded-lg text-lg font-semibold"
              onClick={() => alert("Ripple button clicked!")}
            >
              Ripple Effect
            </RippleButton>
          </div>
        </div>
      </section>

      {/* Interactive Cards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Interactive Cards</h2>
          <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Full-Stack Development", icon: FaCode, color: "text-blue-500" },
              { title: "Cloud Architecture", icon: FaCloud, color: "text-sky-500" },
              { title: "Data Analytics", icon: FaRocket, color: "text-green-500" }
            ].map((item, index) => (
              <InteractiveCard
                key={index}
                className="bg-card border border-border rounded-xl p-8 text-center"
                glowEffect
                onClick={() => alert(`${item.title} card clicked!`)}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  Hover and click to see the interactive effects in action.
                </p>
              </InteractiveCard>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* Success Message */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-green-500 mb-4">
              Animation System Working!
            </h3>
            <p className="text-muted-foreground">
              All animations are loading correctly. You can now integrate these components 
              into your existing portfolio pages.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}