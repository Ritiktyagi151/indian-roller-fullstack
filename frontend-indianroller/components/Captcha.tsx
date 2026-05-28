"use client";

import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LeHo-csAAAAAA-RUUtC-xmee5YqI4LM";

interface CaptchaProps {
  error?: string;
  onChange: (token: string | null) => void;
}

export default function Captcha({ error, onChange }: CaptchaProps) {
  return (
    <div className="space-y-2">
      <div className="max-w-full overflow-hidden">
        <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={onChange} onExpired={() => onChange(null)} />
      </div>
      {error ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-400">{error}</p> : null}
    </div>
  );
}
