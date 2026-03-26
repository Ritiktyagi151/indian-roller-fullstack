"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductEnquiryModal from "../ProductEnquiryModal";


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

type ProductDetail = {
  name: string;
  image?: string;
  category?: { name?: string } | null;
  technicalSpecs?: Record<string, string>;
  benefits?: string[];
  shortDescription?: string;
  shortDesc?: string;
  description?: string;
};

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
   const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSpec, setActiveSpec] = useState<number | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
  const [imgSrc, setImgSrc] = useState(
    product.image?.startsWith("/")
      ? `${baseUrl}${product.image}`
      : product.image
  );

  const specs = product.technicalSpecs
    ? Object.entries(product.technicalSpecs)
    : [];
  const benefits: string[] = product.benefits || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');

        :root {
          --cream:   #f5f0e8;
          --paper:   #ede8dd;
          --ink:     #1a1610;
          --muted:   #6b6358;
          --rule:    #c8beaf;
          --gold:    #a8873a;
          --gold-lt: #d4aa5a;
          --forest:  #1e3326;
          --accent:  #c84b2a;
        }

        .pd-root {
          background: var(--cream);
          min-height: 100vh;
          color: var(--ink);
          font-family: 'Syne', sans-serif;
          padding-bottom: 8rem;
        }

        /* ── HERO BAND ── */
        .pd-hero-band {
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          overflow: hidden;
          white-space: nowrap;
          margin-bottom: 4rem;
        }
        .pd-marquee {
          display: inline-flex;
          gap: 4rem;
          animation: marquee 20s linear infinite;
        }
        .pd-marquee span {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .pd-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── TWO-COL LAYOUT ── */
        .pd-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 6rem;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .pd-grid { grid-template-columns: 1fr; gap: 3rem; }
        }

        /* ── LEFT STICKY COLUMN ── */
        .pd-left-sticky {
          position: sticky;
          top: 4rem;
          height: fit-content;
        }

        .pd-eyebrow {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.8rem;
        }
        .pd-eyebrow-line {
          height: 1px;
          width: 60px;
          background: var(--gold);
        }
        .pd-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          color: var(--gold);
          text-transform: uppercase;
        }

        .pd-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: var(--forest);
          margin-bottom: 2rem;
        }
        .pd-title em {
          font-style: italic;
          color: var(--accent);
        }

        .pd-img-frame {
          position: relative;
          background: var(--paper);
          border: 1px solid var(--rule);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .pd-img-frame::before {
          content: '';
          position: absolute;
          inset: -6px;
          border: 1px solid var(--gold);
          pointer-events: none;
          opacity: 0.4;
        }
        .pd-img-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: var(--gold);
          border-style: solid;
        }
        .pd-img-corner.tl { top: 6px; left: 6px; border-width: 2px 0 0 2px; }
        .pd-img-corner.tr { top: 6px; right: 6px; border-width: 2px 2px 0 0; }
        .pd-img-corner.bl { bottom: 6px; left: 6px; border-width: 0 0 2px 2px; }
        .pd-img-corner.br { bottom: 6px; right: 6px; border-width: 0 2px 2px 0; }

        .pd-img-frame img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          filter: sepia(5%) contrast(1.05);
        }

        .pd-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }
        .pd-benefit-pill {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.45rem 1rem;
          border: 1px solid var(--rule);
          background: var(--paper);
          color: var(--muted);
          transition: all 0.25s;
        }

        /* ── RIGHT SCROLL COLUMN ── */
        .pd-right-scroll {
           /* Normal flow, will scroll with page */
        }

        .pd-shortdesc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 300;
          line-height: 1.6;
          color: var(--muted);
          border-left: 2px solid var(--gold);
          padding-left: 1.2rem;
          margin-bottom: 3.5rem;
        }

        .pd-section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .pd-section-num {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: var(--gold);
        }
        .pd-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .pd-section-rule {
          flex: 1;
          height: 1px;
          background: var(--rule);
        }

        .Product-content {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          line-height: 1.9;
          color: var(--ink);
        }

        .pd-spec-item {
          border-bottom: 1px solid var(--rule);
          cursor: pointer;
        }
        .pd-spec-header {
          display: flex;
          justify-content: space-between;
          padding: 1.2rem 0;
        }
        .pd-spec-key {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .pd-spec-arrow {
          color: var(--gold);
          transition: transform 0.3s ease;
        }
        .pd-spec-arrow.open { transform: rotate(90deg); }
        .pd-spec-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-style: italic;
          color: var(--forest);
          font-weight: 600;
          padding-bottom: 1.2rem;
        }

        .pd-cta-wrap { margin-top: 4rem; position: relative; }
        .pd-cta-bg {
          position: absolute;
          inset: 0;
          background: var(--forest);
          transform: translate(6px, 6px);
        }
        .pd-cta-btn {
          position: relative;
          width: 100%;
          padding: 1.6rem;
          background: var(--accent);
          border: 1px solid var(--accent);
          color: var(--cream);
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.25s;
        }
        .pd-cta-btn:hover {
          background: var(--cream);
          color: var(--accent);
        }

        .pd-footnote {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .pd-footnote-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold);
        }
        .pd-footnote-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: var(--muted);
          text-transform: uppercase;
        }
        .pd-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--rule) 60%, transparent 100%);
          margin: 3.5rem 0;
        }

        /* ═══════════════════════════════════════════
           RESPONSIVE — TABLET  (≤ 1024px)
        ════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .pd-root {
            padding-bottom: 5rem;
          }

          /* Disable sticky on tablet — left col scrolls normally */
          .pd-left-sticky {
            position: static;
          }

          .pd-wrap {
            padding: 0 1.5rem;
          }

          .pd-hero-band {
            margin-bottom: 3rem;
          }

          .pd-shortdesc {
            font-size: 1.25rem;
            margin-bottom: 2.5rem;
          }

          .pd-divider {
            margin: 2.5rem 0;
          }
        }

        /* ═══════════════════════════════════════════
           RESPONSIVE — MOBILE  (≤ 768px)
        ════════════════════════════════════════════ */
        @media (max-width: 768px) {
          .pd-root {
            padding-bottom: 4rem;
          }

          /* Hero band — shorter on mobile */
          .pd-hero-band {
            height: 100px !important;
            padding-top: 0 !important;
            margin-bottom: 2rem;
          }

          .pd-marquee {
            gap: 2rem;
          }

          .pd-marquee span {
            font-size: 0.6rem;
            letter-spacing: 0.18em;
          }

          .pd-wrap {
            padding: 0 1rem;
          }

          .pd-grid {
            gap: 2rem;
          }

          .pd-eyebrow {
            margin-bottom: 1.2rem;
          }

          .pd-eyebrow-line {
            width: 40px;
          }

          .pd-title {
            font-size: clamp(2rem, 8vw, 3rem);
            margin-bottom: 1.5rem;
          }

          .pd-img-frame {
            padding: 1rem;
            margin-bottom: 1.5rem;
          }

          .pd-benefits {
            gap: 0.4rem;
            margin-top: 1rem;
          }

          .pd-benefit-pill {
            padding: 0.35rem 0.75rem;
          }

          .pd-shortdesc {
            font-size: 1.1rem;
            line-height: 1.55;
            margin-bottom: 2rem;
          }

          .pd-section-header {
            margin-bottom: 1rem;
          }

          .Product-content {
            font-size: 1.05rem;
            line-height: 1.8;
          }

          .pd-spec-header {
            padding: 1rem 0;
          }

          .pd-spec-key {
            font-size: 0.62rem;
          }

          .pd-spec-value {
            font-size: 1rem;
            padding-bottom: 1rem;
          }

          .pd-cta-wrap {
            margin-top: 2.5rem;
          }

          .pd-cta-btn {
            padding: 1.2rem;
            font-size: 0.75rem;
            letter-spacing: 0.2em;
          }

          .pd-footnote {
            margin-top: 1.5rem;
          }

          .pd-divider {
            margin: 2rem 0;
          }
        }

        /* ═══════════════════════════════════════════
           RESPONSIVE — SMALL MOBILE  (≤ 480px)
        ════════════════════════════════════════════ */
        @media (max-width: 480px) {
          .pd-hero-band {
            height: 80px !important;
          }

          .pd-marquee span {
            font-size: 0.55rem;
            letter-spacing: 0.12em;
          }

          .pd-wrap {
            padding: 0 0.85rem;
          }

          .pd-title {
            font-size: clamp(1.75rem, 9vw, 2.5rem);
            line-height: 1;
          }

          .pd-eyebrow-text {
            font-size: 0.55rem;
            letter-spacing: 0.22em;
          }

          .pd-img-frame {
            padding: 0.75rem;
          }

          .pd-img-corner {
            width: 12px;
            height: 12px;
          }

          .pd-shortdesc {
            font-size: 1rem;
          }

          .pd-section-title {
            font-size: 0.58rem;
            letter-spacing: 0.2em;
          }

          .pd-cta-btn {
            padding: 1rem;
            font-size: 0.68rem;
            letter-spacing: 0.15em;
          }

          .pd-footnote-text {
            font-size: 0.55rem;
          }
        }
      `}</style>

      <div className="pd-root">
        {/* Marquee band */}
        <div className="pd-hero-band h-[230px] pt-38 flex items-center bg-black">
          <div className="pd-marquee" aria-hidden>
            {[...Array(8)].map((_, i) => (
              <span className="text-orange-500" key={i}>
                {product.name} &nbsp;·&nbsp; {product.category?.name || "Industrial"} &nbsp;·&nbsp; Precision Engineered
              </span>
            ))}
          </div>
        </div>

        <div className="pd-wrap">
          <div className="pd-grid">
            
            {/* ── LEFT COLUMN: FIXED/STICKY ── */}
            <div className="pd-left-sticky">
              <motion.div className="pd-eyebrow" {...fadeUp(0.1)}>
                <div className="pd-eyebrow-line" />
                <span className="pd-eyebrow-text">
                  {product.category?.name || "Industrial"} / Product Detail
                </span>
              </motion.div>

              <motion.h1 className="pd-title" {...fadeUp(0.2)}>
                {(product.name || "").split(" ").map((word: string, i: number) =>
                  i % 3 === 2 ? <em key={i}>{word} </em> : `${word} `
                )}
              </motion.h1>

              <motion.div className="pd-img-frame" {...fadeLeft(0.3)}>
                <div className="pd-img-corner tl" />
                <div className="pd-img-corner tr" />
                <div className="pd-img-corner bl" />
                <div className="pd-img-corner br" />
                <img
                  src={imgSrc}
                  alt={product.name}
                  onError={() =>
                    setImgSrc("https://placehold.co/800x800/1e3326/d4aa5a?text=IMAGE")
                  }
                />
              </motion.div>

              {benefits.length > 0 && (
                <motion.div {...fadeUp(0.4)}>
                  <div className="pd-section-header" style={{ marginBottom: "1rem" }}>
                    <span className="pd-section-num">00</span>
                    <span className="pd-section-title">Key Benefits</span>
                    <div className="pd-section-rule" />
                  </div>
                  <div className="pd-benefits">
                    {benefits.map((b: string, i: number) => (
                      <span key={i} className="pd-benefit-pill">{b}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT COLUMN: SCROLLABLE ── */}
            <div className="pd-right-scroll">
              <motion.p className="pd-shortdesc" {...fadeUp(0.3)}>
                {product.shortDescription || product.shortDesc}
              </motion.p>

              <div className="pd-section-header">
                <span className="pd-section-num">01</span>
                <span className="pd-section-title">Product Overview</span>
                <div className="pd-section-rule" />
              </div>
              
              <motion.div
                className="Product-content"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
                {...fadeUp(0.4)}
              />

              <div className="pd-divider" />

              {/* Technical Specs */}
              {specs.length > 0 && (
                <>
                  <div className="pd-section-header">
                    <span className="pd-section-num">02</span>
                    <span className="pd-section-title">Technical Specifications</span>
                    <div className="pd-section-rule" />
                  </div>

                  <div style={{ marginBottom: "3.5rem" }}>
                    {specs.map(([key, value], i: number) => (
                      <div
                        key={key}
                        className="pd-spec-item"
                        onClick={() => setActiveSpec(activeSpec === i ? null : i)}
                      >
                        <div className="pd-spec-header">
                          <span className="pd-spec-key">{key}</span>
                          <span className={`pd-spec-arrow ${activeSpec === i ? "open" : ""}`}>›</span>
                        </div>
                        <AnimatePresence initial={false}>
                          {activeSpec === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="pd-spec-value">{value}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* CTA Section */}
             {/* Modal — component ke andar, pd-root ke upar */}
<ProductEnquiryModal
  product={product}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>

{/* Button — design bilkul same, sirf onClick add hua */}
<motion.div className="pd-cta-wrap" {...fadeUp(0.5)}>
  <div className="pd-cta-bg" />
  <button
    className="pd-cta-btn"
    onClick={() => setIsModalOpen(true)} // ✅ sirf yeh line add karo
  >
    Request a Professional Quote
  </button>
</motion.div>

              <div className="pd-footnote">
                <div className="pd-footnote-dot" />
                <span className="pd-footnote-text">
                  All quotes are tailored — response within 24 hours
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
