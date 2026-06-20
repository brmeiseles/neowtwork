"use client";

import { useState, type FormEvent } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { appConfig } from "@/config/app";
import { captureAnalyticsEvent } from "@/lib/analytics";
import { hasSupabaseEnv, type PublicEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FeedbackType = "bug" | "idea" | "confusion" | "praise";

type FeedbackDialogProps = {
  publicEnv: PublicEnv;
};

const FEEDBACK_TYPES: Array<{
  label: string;
  value: FeedbackType;
}> = [
  { label: "Bug", value: "bug" },
  { label: "Idea", value: "idea" },
  { label: "Confusion", value: "confusion" },
  { label: "Praise", value: "praise" },
];

export function FeedbackDialog({ publicEnv }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("bug");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();
    setError("");

    if (trimmedMessage.length < 3) {
      setError("Write a little more so the note is useful.");
      return;
    }

    if (trimmedMessage.length > 2000) {
      setError("Keep feedback under 2,000 characters for now.");
      return;
    }

    if (!hasSupabaseEnv(publicEnv)) {
      setError("Feedback is not connected yet. Try again after launch wiring.");
      return;
    }

    const supabase = createSupabaseBrowserClient(publicEnv);

    if (!supabase) {
      setError("Feedback is not connected yet. Try again later.");
      return;
    }

    setStatus("saving");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user.id ?? null;
    const pagePath = `${window.location.pathname}${window.location.hash}`;

    const { error: insertError } = await supabase.from("feedback").insert({
      app_version: appConfig.version,
      feedback_type: feedbackType,
      message: trimmedMessage,
      page_path: pagePath,
      user_id: userId,
    });

    if (insertError) {
      setStatus("idle");
      setError("Could not send feedback yet. Try again in a moment.");
      return;
    }

    captureAnalyticsEvent("feedback_submitted", {
      feedback_type: feedbackType,
      is_logged_in: Boolean(userId),
      source: "footer",
    });
    setMessage("");
    setStatus("success");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setFeedbackType("bug");
      setMessage("");
      setStatus("idle");
      setError("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="version" type="button" variant="version">
          <MessageSquareText aria-hidden="true" className="size-3" />
          Submit Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Send a bug, idea, confusion, or tiny victory shout. Keep secrets out
            of the note.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="grid gap-4">
            <p className="rounded-card border border-antiqueGold/35 bg-pitch/60 p-3 text-sm font-semibold text-parchment">
              Feedback sent. The codex has received your note.
            </p>
            <div className="flex justify-end">
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-title text-brass">
              Type
              <select
                className="h-11 rounded-card border border-brass/25 bg-pitch/60 px-3 text-base normal-case tracking-normal text-parchment outline-none focus:border-ember"
                value={feedbackType}
                onChange={(event) =>
                  setFeedbackType(event.target.value as FeedbackType)
                }
              >
                {FEEDBACK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold uppercase tracking-title text-brass">
              Message
              <textarea
                className="min-h-32 rounded-card border border-brass/25 bg-pitch/60 px-3 py-2 text-base normal-case tracking-normal text-parchment outline-none placeholder:text-bone/50 focus:border-ember"
                maxLength={2000}
                placeholder="What broke, what confused you, or what should exist next?"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>

            {error ? (
              <p className="rounded-card border border-ember/45 bg-blood/35 p-3 text-sm font-semibold text-parchment">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                disabled={status === "saving"}
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button disabled={status === "saving"} type="submit">
                <Send className="size-4" />
                {status === "saving" ? "Sending..." : "Send Feedback"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
