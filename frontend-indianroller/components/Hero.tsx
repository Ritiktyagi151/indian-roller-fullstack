"use client";
import React, { useState, useRef, useEffect } from "react";

// ── MOBILE SLIDE TEXT CONFIG (Indian Roller Brand) ──
const mobileSlideTexts = [
  {
    tag: "Est. 1990",
    heading: "India's Trusted\nRoller Brand",
    sub: "Rubber & Polyurethane Rollers — Quality You Can Rely On",
    accent: "Sahibabad, Ghaziabad (Delhi NCR)",
  },
  {
    tag: "ISO 9001 : 2008",
    heading: "Certified\nExcellence",
    sub: "State-of-art manufacturing across 36,000 sq. ft. facility",
    accent: "Under One Roof",
  },
  {
    tag: "Since 1990",
    heading: "Honestly Made,\nSincerely Served",
    sub: "PU Rollers · Rubber Rollers · Turnkey Solutions",
    accent: "To Evolve is to Last Forever",
  },
];

const Hero = () => {
  const [videoIndex, setVideoIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const desktopVideos = [
    "/videos/home-page-landing.mp4",
    
  ];

  const mobileVideos = [
    "/videos/home-mv/video-mobileview.mp4",
   
  ];

  const videos = isMobile ? mobileVideos : desktopVideos;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setVideoIndex(0);
    setAnimKey((k) => k + 1);
  }, [isMobile]);

  const switchSlide = (newIndex: number) => {
    setTextVisible(false);
    setTimeout(() => {
      setVideoIndex(newIndex);
      setAnimKey((k) => k + 1);
      setTextVisible(true);
    }, 350);
  };

  const handleVideoEnd = () => {
    switchSlide((videoIndex + 1) % videos.length);
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[videoIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {});
    }
  }, [videoIndex, isMobile]);

  const slide = mobileSlideTexts[videoIndex % mobileSlideTexts.length];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Barlow:wght@300;400&family=Barlow+Condensed:wght@600;700&display=swap');

        @keyframes iri-bar {
          from { width: 0; opacity: 0; }
          to   { width: 40px; opacity: 1; }
        }
        @keyframes iri-tag {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes iri-head {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iri-sub {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iri-accent {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .iri-bar  { animation: iri-bar  0.4s cubic-bezier(.22,1,.36,1) both 0.05s; }
        .iri-tag  { animation: iri-tag  0.42s cubic-bezier(.22,1,.36,1) both 0.12s; }
        .iri-head { animation: iri-head 0.52s cubic-bezier(.22,1,.36,1) both 0.2s; }
        .iri-sub  { animation: iri-sub  0.48s cubic-bezier(.22,1,.36,1) both 0.32s; }
        .iri-acc  { animation: iri-accent 0.5s ease both 0.42s; }
      `}</style>

      <section
        className="relative w-full flex items-center justify-center overflow-hidden bg-black"
        style={{ height: isMobile ? "60vh" : "100vh" }}
      >
        {/* ── VIDEOS ── */}
        {videos.map((src, i) => (
  <video
    key={`${isMobile ? "mob" : "desk"}-${src}`}
    ref={(el) => { videoRefs.current[i] = el; }}
    src={src}
    muted
    playsInline
    // Agar list mein sirf ek hi video hai (Desktop), toh seedha loop use karein
    loop={videos.length === 1} 
    autoPlay={i === videoIndex}
    // Agar ek se zyada videos hain, toh ended hone par next slide par jayein
    onEnded={() => {
      if (videos.length > 1) {
        handleVideoEnd();
      }
    }}
    className="absolute inset-0 w-full h-full object-fill transition-opacity duration-1000"
    style={{
      opacity: i === videoIndex ? 1 : 0,
      zIndex: i === videoIndex ? 1 : 0,
    }}
  />
))}

        {/* ── MOBILE GRADIENT OVERLAY ── */}
        {isMobile && (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 5,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.48) 42%, rgba(0,0,0,0.0) 100%)",
            }}
          />
        )}

        {/* ── MOBILE TEXT SLIDER ── */}
        {isMobile && (
          <div
            key={animKey}
            className="absolute left-0 right-0 px-5"
            style={{
              bottom: "68px",
              zIndex: 10,
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 0.32s ease, transform 0.32s ease",
            }}
          >
            {/* Orange gradient bar */}
            <div
              className="iri-bar"
              style={{
                height: "2px",
                background: "linear-gradient(90deg, #f97316, rgba(249,115,22,0.25))",
                borderRadius: "2px",
                marginBottom: "12px",
              }}
            />

            {/* Tag badge */}
            <div
              className="iri-tag"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.45)",
                color: "#f97316",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: "3px",
                marginBottom: "10px",
              }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#f97316">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              {slide.tag}
            </div>

            {/* Main heading */}
            <h2
              className="iri-head"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "clamp(24px, 6.5vw, 34px)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                margin: "0 0 10px 0",
                whiteSpace: "pre-line",
                textTransform: "uppercase",
                textShadow: "0 2px 18px rgba(0,0,0,0.65)",
              }}
            >
              {slide.heading}
            </h2>

            {/* Subtitle */}
            <p
              className="iri-sub"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "12px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.65)",
                margin: "0 0 8px 0",
                lineHeight: 1.65,
                maxWidth: "280px",
              }}
            >
              {slide.sub}
            </p>

            {/* Accent caption */}
            <p
              className="iri-acc"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                color: "rgba(249,115,22,0.75)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              — {slide.accent}
            </p>
          </div>
        )}

        {/* ── INDICATORS ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-20"
          style={{ bottom: isMobile ? "44px" : "96px" }}
        >
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => switchSlide(i)}
              style={{
                width: i === videoIndex
                  ? (isMobile ? "24px" : "32px")
                  : (isMobile ? "6px" : "8px"),
                height: isMobile ? "6px" : "8px",
                borderRadius: "4px",
                backgroundColor:
                  i === videoIndex ? "#f97316" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* ── SCROLL DECORATION (desktop only) ── */}
        {!isMobile && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
            <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent animate-pulse" />
            <span className="text-white/40 text-[9px] font-bold tracking-widest uppercase">
              Scroll
            </span>
          </div>
        )}
      </section>
    </>
  );
};

export default Hero;