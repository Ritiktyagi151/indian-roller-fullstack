"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface EnquiryModalProps {
  product: {
    name: string;
    category?: { name?: string } | null;
    [key: string]: any;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductEnquiryModal({ product, isOpen, onClose }: EnquiryModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", company: "", message: "" });
        setSubmitted(false);
      }, 400);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // ── Replace with your actual API call ──
    await new Promise((res) => setTimeout(res, 1500));
    // await fetch("/api/enquiry", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ ...form, productName: product.name }),
    // });
    setLoading(false);
    setSubmitted(true);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');

        :root {
          --cream:  #f5f0e8;
          --paper:  #ede8dd;
          --ink:    #1a1610;
          --muted:  #6b6358;
          --rule:   #c8beaf;
          --gold:   #a8873a;
          --forest: #1e3326;
          --accent: #c84b2a;
        }

        .enq-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(26, 22, 16, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .enq-panel {
          position: relative;
          background: var(--cream);
          border: 1px solid var(--rule);
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 3.5rem;
          scrollbar-width: thin;
          scrollbar-color: var(--rule) transparent;
        }

        .enq-corner {
          position: absolute;
          width: 20px; height: 20px;
          border-color: var(--gold);
          border-style: solid;
          pointer-events: none;
        }
        .enq-corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .enq-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
        .enq-corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
        .enq-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

        .enq-close {
          position: absolute;
          top: 1.5rem; right: 1.5rem;
          background: transparent;
          border: 1px solid var(--rule);
          color: var(--muted);
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .enq-close:hover { border-color: var(--accent); color: var(--accent); }

        .enq-header { margin-bottom: 2.5rem; }

        .enq-eyebrow {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 1rem;
        }
        .enq-eyebrow-line { height: 1px; width: 40px; background: var(--gold); }
        .enq-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          color: var(--gold);
          text-transform: uppercase;
        }

        .enq-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1;
          color: var(--forest);
          margin-bottom: 0.6rem;
        }
        .enq-title em { font-style: italic; color: var(--accent); }

        .enq-form { display: flex; flex-direction: column; gap: 1.5rem; }

        .enq-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .enq-field { display: flex; flex-direction: column; gap: 0.5rem; }

        .enq-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .enq-req { color: var(--accent); }

        /* ── Read-only product name field ── */
        .enq-product-field {
          background: var(--paper);
          border: 1px solid var(--rule);
          border-left: 3px solid var(--gold);
          padding: 0.9rem 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          width: 100%;
          box-sizing: border-box;
        }
        .enq-product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--forest);
        }
        .enq-product-category {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          margin-left: auto;
          padding: 0.25rem 0.6rem;
          border: 1px solid var(--rule);
          background: var(--cream);
        }

        .enq-input {
          background: var(--paper);
          border: 1px solid var(--rule);
          padding: 0.9rem 1.1rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .enq-input::placeholder { color: var(--rule); font-style: italic; }
        .enq-input:focus { border-color: var(--gold); background: #f9f5ee; }

        .enq-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }

        .enq-submit-wrap { position: relative; margin-top: 0.5rem; }
        .enq-cta-bg {
          position: absolute; inset: 0;
          background: var(--forest);
          transform: translate(5px, 5px);
        }
        .enq-submit-btn {
          position: relative;
          width: 100%;
          padding: 1.3rem;
          background: var(--accent);
          border: 1px solid var(--accent);
          color: var(--cream);
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.25s;
        }
        .enq-submit-btn:hover:not(:disabled) { background: var(--cream); color: var(--accent); }
        .enq-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .enq-loading { display: flex; align-items: center; justify-content: center; gap: 6px; }
        .enq-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--cream);
          animation: enq-bounce 1.2s infinite;
        }
        .enq-dot:nth-child(2) { animation-delay: 0.2s; }
        .enq-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes enq-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-6px); opacity: 1; }
        }

        .enq-footnote { display: flex; align-items: center; gap: 0.7rem; }
        .enq-footnote-dot {
          width: 5px; height: 5px;
          border-radius: 50%; background: var(--gold); flex-shrink: 0;
        }
        .enq-footnote-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          color: var(--muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .enq-success {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 2rem 1rem; gap: 1.5rem;
        }
        .enq-success-icon { animation: enq-pop 0.5s ease; }
        @keyframes enq-pop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .enq-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem; font-weight: 700;
          color: var(--forest); line-height: 1;
        }
        .enq-success-body {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; line-height: 1.7;
          color: var(--muted); max-width: 420px;
        }
        .enq-success-body strong { color: var(--ink); }
        .enq-success-body em { font-style: italic; color: var(--accent); }

        .enq-success-close {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--muted);
          background: transparent; border: 1px solid var(--rule);
          padding: 0.8rem 2rem; cursor: pointer; transition: 0.2s;
        }
        .enq-success-close:hover { border-color: var(--gold); color: var(--gold); }

        @media (max-width: 560px) {
          .enq-row { grid-template-columns: 1fr; }
          .enq-panel { padding: 2rem 1.5rem; }
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={overlayRef}
            className="enq-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className="enq-panel"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="enq-corner tl" />
              <div className="enq-corner tr" />
              <div className="enq-corner bl" />
              <div className="enq-corner br" />

              <button className="enq-close" onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {!submitted ? (
                <>
                  <div className="enq-header">
                    <div className="enq-eyebrow">
                      <div className="enq-eyebrow-line" />
                      <span className="enq-eyebrow-text">Product Enquiry</span>
                    </div>
                    <h2 className="enq-title">
                      Request a <em>Quote</em>
                    </h2>
                  </div>

                  <form className="enq-form" onSubmit={handleSubmit}>

                    {/* ── AUTO-FILLED PRODUCT NAME ── */}
                    <div className="enq-field">
                      <label className="enq-label">Product</label>
                      <div className="enq-product-field">
                        <span className="enq-product-name">{product.name}</span>
                        {product.category?.name && (
                          <span className="enq-product-category">
                            {product.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="enq-row">
                      <div className="enq-field">
                        <label className="enq-label" htmlFor="enq-name">
                          Full Name <span className="enq-req">*</span>
                        </label>
                        <input
                          className="enq-input"
                          id="enq-name"
                          name="name"
                          type="text"
                          placeholder="John Smith"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="enq-field">
                        <label className="enq-label" htmlFor="enq-company">
                          Company
                        </label>
                        <input
                          className="enq-input"
                          id="enq-company"
                          name="company"
                          type="text"
                          placeholder="Acme Industries"
                          value={form.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="enq-row">
                      <div className="enq-field">
                        <label className="enq-label" htmlFor="enq-email">
                          Email Address <span className="enq-req">*</span>
                        </label>
                        <input
                          className="enq-input"
                          id="enq-email"
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="enq-field">
                        <label className="enq-label" htmlFor="enq-phone">
                          Phone Number
                        </label>
                        <input
                          className="enq-input"
                          id="enq-phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="enq-field">
                      <label className="enq-label" htmlFor="enq-message">
                        Your Requirements <span className="enq-req">*</span>
                      </label>
                      <textarea
                        className="enq-input enq-textarea"
                        id="enq-message"
                        name="message"
                        rows={4}
                        placeholder={`Quantity, specifications, delivery timeline for ${product.name}...`}
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="enq-submit-wrap">
                      <div className="enq-cta-bg" />
                      <button type="submit" className="enq-submit-btn" disabled={loading}>
                        {loading ? (
                          <span className="enq-loading">
                            <span className="enq-dot" />
                            <span className="enq-dot" />
                            <span className="enq-dot" />
                          </span>
                        ) : (
                          "Send Enquiry →"
                        )}
                      </button>
                    </div>

                    <div className="enq-footnote">
                      <div className="enq-footnote-dot" />
                      <span className="enq-footnote-text">
                        We respond within 24 hours · All enquiries are confidential
                      </span>
                    </div>
                  </form>
                </>
              ) : (
                <motion.div
                  className="enq-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="enq-success-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="19" stroke="var(--gold)" strokeWidth="1.5" />
                      <path d="M12 20.5L17.5 26L28 15" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="enq-success-title">Enquiry Sent</h3>
                  <p className="enq-success-body">
                    Thank you, <strong>{form.name}</strong>. Your enquiry for{" "}
                    <em>{product.name}</em> has been received. Our team will get
                    back to you at <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <button className="enq-success-close" onClick={onClose}>
                    Close
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
