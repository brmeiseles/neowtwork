import type { ReactNode } from "react";
import { ScrollText } from "lucide-react";
import { appConfig } from "@/config/app";
import { brandConfig } from "@/config/brand";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: ReactNode;
  navigation?: ReactNode;
  profileArea?: ReactNode;
  footer?: ReactNode;
};

export function AppShell({
  children,
  navigation,
  profileArea,
  footer,
}: AppShellProps) {
  const hasTopBar = Boolean(navigation || profileArea);

  return (
    <div className="min-h-screen px-shell-x py-shell-y sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-shell flex-col gap-6">
        {hasTopBar ? (
          <header className="flex items-center justify-between gap-4 border-b border-brass/20 pb-4">
            <div>{navigation}</div>
            <div>{profileArea}</div>
          </header>
        ) : null}

        <main className="flex-1">{children}</main>

        {footer ?? (
          <footer className="border-t border-brass/25 pt-3 text-xs font-bold uppercase tracking-ritual text-brass/75">
            <Button
              asChild
              aria-label={`${brandConfig.shortName} version ${appConfig.version}`}
              size="version"
              variant="version"
            >
              <span>
                <ScrollText aria-hidden="true" className="size-3" />
                {brandConfig.shortName} v{appConfig.version}
              </span>
            </Button>
          </footer>
        )}
      </div>
    </div>
  );
}
