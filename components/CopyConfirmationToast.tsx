"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

type CopyConfirmationToastProps = {
  message: string;
};

export function useCopyConfirmation(delay = 1800) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showCopyConfirmation = useCallback(
    (nextMessage: string) => {
      setMessage(nextMessage);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setMessage("");
        timeoutRef.current = null;
      }, delay);
    },
    [delay],
  );

  return { copyMessage: message, showCopyConfirmation };
}

export function CopyConfirmationToast({
  message,
}: CopyConfirmationToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[100] inline-flex items-center gap-2 rounded-card border border-antiqueGold/45 bg-pitch/95 px-3 py-2 text-sm font-black uppercase tracking-title text-parchment shadow-card backdrop-blur"
      role="status"
    >
      <Check aria-hidden="true" className="size-4 text-emberBright" />
      {message}
    </div>
  );
}
