import type { ReactNode } from "react";
import { appConfig } from "@/config/app";
import { brandConfig } from "@/config/brand";

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
    <div className="min-h-screen px-shell-x py-shell-y sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-shell flex-col gap-section">
        {hasTopBar ? (
          <header className="flex items-center justify-between gap-4 border-b border-brass/20 pb-4">
            <div>{navigation}</div>
            <div>{profileArea}</div>
          </header>
        ) : null}

        <main className="flex-1">{children}</main>

        {footer ?? (
          <footer className="border-t border-brass/20 pt-4 text-xs font-bold uppercase tracking-ritual text-brass/70">
            {brandConfig.shortName} v{appConfig.version}
          </footer>
        )}
      </div>
    </div>
  );
}
