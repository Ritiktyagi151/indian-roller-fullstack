// components/about/AboutHero.tsx
import React from 'react';
import Link from 'next/link';

interface AboutHeroProps {
  title: string;
  subtitle: string;
  imagePath: string;
}

const AboutHero = ({ title, subtitle, imagePath }: AboutHeroProps) => {
  return (
    <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${imagePath}')` }}
      >
        {/* Dark Overlay taaki text saaf dikhe */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex justify-center space-x-2 text-sm font-light uppercase tracking-widest opacity-80">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-orange-500">About Us</span>
        </nav>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {title}
        </h1>
        
        {/* Subtitle */}
        <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
        <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default AboutHero;