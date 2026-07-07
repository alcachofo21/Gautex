"use client";

import { Suspense, useEffect, useState } from "react";
import { AnalyticsScripts } from "./AnalyticsScripts";
import { PageViewTracker } from "./PageViewTracker";
import { CONSENT_CHANGE_EVENT, hasAnalyticsConsent } from "@/lib/analytics";

export function AnalyticsProvider() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasAnalyticsConsent());

    const onConsentChange = () => {
      setConsented(hasAnalyticsConsent());
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
  }, []);

  if (!consented) return null;

  return (
    <>
      <AnalyticsScripts />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
