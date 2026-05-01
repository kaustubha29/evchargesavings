"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { LeadCaptureBox, LEAD_FORM_SUBMITTED_KEY } from "./LeadCaptureBox";

interface Props {
  sourcePage?: string;
  children?: ReactNode;
}

export function LeadCaptureBoxGate({ sourcePage = "/", children }: Props) {
  const [isSubmitted, setIsSubmitted] = useState<boolean | null>(null);
  const gateId = useId();

  useEffect(() => {
    const checkSubmission = (event?: Event) => {
      try {
        const submittedGateId = event instanceof CustomEvent ? event.detail?.gateId : null;
        if (submittedGateId === gateId) return;

        setIsSubmitted(localStorage.getItem(LEAD_FORM_SUBMITTED_KEY) === "true");
      } catch {
        setIsSubmitted(false);
      }
    };

    checkSubmission();
    window.addEventListener("ecs-lead-submitted", checkSubmission);

    return () => window.removeEventListener("ecs-lead-submitted", checkSubmission);
  }, [gateId]);

  if (isSubmitted === null || isSubmitted) {
    return null;
  }

  return (
    <>
      {children}
      <LeadCaptureBox sourcePage={sourcePage} gateId={gateId} />
    </>
  );
}
