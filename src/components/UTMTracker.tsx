"use client";

import { useEffect } from "react";
import { captureUtmParams } from "@/lib/utmTracker";

export function UTMTracker() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return null;
}
