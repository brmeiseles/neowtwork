"use client";

import { useMemo, useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { captureAnalyticsEvent } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { PublicEnv } from "@/lib/env";

type FollowBoardActionProps = {
  initialIsFollowing: boolean;
  publicEnv: PublicEnv;
  targetProfileId: string;
};

export function FollowBoardAction({
  initialIsFollowing,
  publicEnv,
  targetProfileId,
}: FollowBoardActionProps) {
  const supabase = useMemo(
    () => createSupabaseBrowserClient(publicEnv),
    [publicEnv],
  );
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFollowBoard() {
    if (!supabase || isFollowing || isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Sign in again to follow this board.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("friends").insert({
      friend_user_id: targetProfileId,
      user_id: user.id,
    });

    setIsSaving(false);

    if (error) {
      setMessage(
        error.code === "23505"
          ? "Already following this board."
          : "Could not follow this board yet.",
      );

      if (error.code === "23505") {
        setIsFollowing(true);
      }

      return;
    }

    setIsFollowing(true);
    setMessage("Following this board.");
    captureAnalyticsEvent("board_followed", {
      is_logged_in: true,
      source: "profile_board",
      viewed_profile_type: "public",
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        disabled={isFollowing || isSaving}
        size="sm"
        type="button"
        onClick={handleFollowBoard}
      >
        {isFollowing ? (
          <>
            <Check className="size-4" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            {isSaving ? "Following..." : "Follow Board"}
          </>
        )}
      </Button>
      {message ? (
        <p className="text-xs font-bold uppercase tracking-title text-brass">
          {message}
        </p>
      ) : null}
    </div>
  );
}
