"use client";

import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ToastItem } from "./types";

type ToastViewportProps = {
  toasts: ToastItem[];
};

const toneMap = {
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200",
  },
  warning: {
    icon: TriangleAlert,
    classes: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-200",
  },
  info: {
    icon: Info,
    classes: "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
  },
} as const;

export default function ToastViewport({ toasts }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const tone = toneMap[toast.tone ?? "info"];
        const Icon = tone.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-lg ${tone.classes}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-1 text-sm opacity-90">{toast.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
