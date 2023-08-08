"use client";

import {
  Hydrate as HydrationBoundary,
  HydrateProps,
} from "@tanstack/react-query";

export default function Hydrate(props: HydrateProps) {
  return <HydrationBoundary {...props} />;
}
