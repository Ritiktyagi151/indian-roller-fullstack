"use client";
import React, { useState } from 'react';

type EffectType = 'blink' | 'horizontal' | 'backwards' | 'zoom';

interface Section {
  id: string;
  title: string;
  img: string;
  desc: string;
  highlight: string;
}

const sections: Section[] = [
  { id: 'snapping', title: 'First, Snapping Points', img: 'flower-white.png', desc: 'Set Y-axis mandatory snapping.', highlight: 'text-pink-400' },
  { id: 'scrolling', title: 'Next, Animation', img: 'flower-yellow.png', desc: 'Track view() position.', highlight: 'text-yellow-400' },
  { id: 'layout', title: 'Then, Fixed Layout', img: 'flower-blue.png', desc: 'Stack sections using fixed position.', highlight: 'text-blue-400' },
  { id: 'transition', title: 'Finally, Effects', img: 'flower-red.png', desc: 'Smoothly transition between layers.', highlight: 'text-red-400' },
];

export default function ScrollExperience() {
  const [effect, setEffect] = useState<EffectType>('blink');

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">
      {/* Controls */}
      <header className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center px-4">
        <div className="flex bg-black/50 backdrop-blur-lg border border-white/20 rounded-full p-1 shadow-2xl overflow-hidden">
          {(['blink', 'horizontal', 'backwards', 'zoom'] as EffectType[]).map((eff) => (
            <button
              key={eff}
              onClick={() => setEffect(eff)}
              className={`px-4 py-2 text-xs md:text-sm transition-all rounded-full ${
                effect === eff ? 'bg-white text-black' : 'hover:bg-white/10'
              }`}
            >
              {eff.charAt(0).toUpperCase() + eff.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Scroll Container */}
      <main className="container-snap h-full">
        {sections.map((sec) => (
          <section key={sec.id} className="section-snap relative h-screen">
            <div className={`content-fixed effect-${effect} flex items-center justify-center`}>
              <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 px-8">
                <h2 className="text-4xl md:text-6xl font-extralight tracking-tight flex-1">
                  <span className={`font-bold italic ${sec.highlight}`}>{sec.title.split(',')[0]}</span>, 
                  {sec.title.split(',')[1]}
                </h2>
                
                <div className="flex-1 text-center md:text-left">
                  <img 
                    src={`https://assets.codepen.io/197359/${sec.img}`} 
                    alt="Flower"
                    className="w-48 h-48 md:w-80 md:h-80 mx-auto object-contain opacity-80"
                  />
                  <p className="mt-6 text-lg text-white/60 font-light leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}