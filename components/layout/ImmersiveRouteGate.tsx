"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Routes that fill the viewport and capture scroll themselves — page chrome
// like the top brand and footer would compete with them, so it is not
// rendered there.
const IMMERSIVE_ROUTES = ["/photos"];

export function ImmersiveRouteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (IMMERSIVE_ROUTES.includes(pathname)) return null;
  return <>{children}</>;
}
